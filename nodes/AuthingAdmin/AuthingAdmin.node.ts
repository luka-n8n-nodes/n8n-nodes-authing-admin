import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';
import ResourceFactory from '../help/builder/ResourceFactory';
import { getUserPoolId } from '../help/utils/CredentialUtils';
import { configuredOutputs } from '../help/utils/parameters';
import { Credentials, OutputType } from '../help/type/enums';

const resourceBuilder = ResourceFactory.build(__dirname);

export class AuthingAdmin implements INodeType {
	methods = {
		loadOptions: {
			async getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const credentials = await this.getCredentials('authingAdminApi');
					const baseUrl = credentials.baseUrl as string;
					const accessKeyId = credentials.accessKeyId as string;
					const accessKeySecret = credentials.accessKeySecret as string;
					const userPoolId = getUserPoolId(credentials);					const tokenResponse = await this.helpers.httpRequest({
						method: 'POST',
						url: `${baseUrl}/api/v3/get-management-token`,
						body: { accessKeyId, accessKeySecret },
						json: true,
					}) as any;

					const accessToken = tokenResponse?.data?.access_token;
					if (!accessToken) {
						const errMsg = tokenResponse?.message || JSON.stringify(tokenResponse);
						return [{ name: `[Token错误] ${errMsg}`, value: '_token_error_' }];
					}

					const PAGE_SIZE = 50;
					let page = 1;
					let allGroups: any[] = [];

					while (true) {						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseUrl}/api/v3/list-groups`,
							qs: { page, limit: PAGE_SIZE },
							headers: {
								'x-authing-userpool-id': userPoolId,
								'authorization': accessToken,
							},
							json: true,
						}) as any;

						const list: any[] = response?.data?.list || [];
						const totalCount: number = response?.data?.totalCount || 0;
						allGroups = allGroups.concat(list);

						if (allGroups.length >= totalCount || list.length === 0) break;
						page++;
					}

					return allGroups.map((group) => ({
						name: group.name,
						value: group.code,
						description: `分组唯一code：${group.code}`,
					}));
				} catch (e: any) {
					return [{ name: `[异常] ${e.message || String(e)}`, value: '_exception_' }];
				}
			},
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Authing',
		subtitle: '={{ $parameter.resource }}:{{ $parameter.operation }}',
		name: 'authingAdmin',
		icon: 'file:icon.svg',
		group: ['transform'],
		version: [1],
		defaultVersion: 1,
		description: 'Authing Admin API集成，支持用户管理等功能',
		defaults: {
			name: 'Authing',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: `={{(${configuredOutputs})($parameter)}}`,
		credentials: [
			{
				name: Credentials.AuthingAdminApi,
				required: true,
			},
		],
		properties: [...resourceBuilder.build()],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		// 使用数组初始化，支持多输出
		let returnData: INodeExecutionData[][] = Array.from({ length: 1 }, () => []);

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		const callFunc = resourceBuilder.getCall(resource, operation);

		if (!callFunc) {
			throw new NodeOperationError(
				this.getNode(),
				'未实现方法: ' + resource + '.' + operation,
			);
		}

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				this.logger.debug('call function', {
					resource,
					operation,
					itemIndex,
				});

				const responseData = await callFunc.call(this, itemIndex);

				// 检查是否有自定义输出类型
				if (responseData && typeof responseData === 'object' && 'outputType' in responseData) {
					const typedResponse = responseData as { outputType: OutputType; outputData?: INodeExecutionData[][] };
					const { outputType } = typedResponse;

					if (outputType === OutputType.Multiple && typedResponse.outputData) {
						// 多输出模式：直接使用返回的输出数据
						returnData = typedResponse.outputData;
					} else if (outputType === OutputType.None) {
						// 无输出模式
						return [];
					}
					// OutputType.Single 会走下面的默认处理
				} else {
					// 默认单输出模式
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData as IDataObject),
						{ itemData: { item: itemIndex } },
					);
					returnData[0].push(...executionData);
				}
			} catch (error) {
				this.logger.error('call function error', {
					resource,
					operation,
					itemIndex,
					errorMessage: error.message,
					stack: error.stack,
				});

				if (this.continueOnFail()) {
					// 优化错误信息提取，优先使用 description
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({
							error: error.description ?? error.message,
							...(error.name === 'NodeApiError' && error.cause?.error
								? { details: error.cause.error }
								: {}),
						}),
						{ itemData: { item: itemIndex } },
					);
					returnData[0].push(...executionErrorData);
					continue;
				} else if (error.name === 'NodeApiError') {
					throw error;
				} else {
					throw new NodeOperationError(this.getNode(), error, {
						message: error.message,
						itemIndex,
					});
				}
			}
		}

		return returnData;
	}
}
