import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeProperties,
	jsonParse,
	sleep,
} from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_MAX_PAGES = 1000;

interface PaginationConfig {
	pageSizeField?: string;
	pageNumField?: string;
	dataPath?: string;
	totalPath?: string;
	maxPages?: number;
	paginationInterval?: number;
}

interface RequestOptions {
	batching?: { batch?: { batchSize?: number; batchInterval?: number } };
	timeout?: number;
	returnAll?: boolean;
	paginationConfig?: { config?: PaginationConfig };
}

interface ParameterItem {
	name: string;
	value: string;
}

const CustomRequestOperate: ResourceOperations = {
	name: '自定义请求',
	value: 'customRequest',
	action: '自定义请求',
	options: [
		{
			displayName: 'Method',
			name: 'method',
			type: 'options',
			options: [
				{
					name: 'DELETE',
					value: 'DELETE',
				},
				{
					name: 'GET',
					value: 'GET',
				},
				{
					name: 'PATCH',
					value: 'PATCH',
				},
				{
					name: 'POST',
					value: 'POST',
				},
				{
					name: 'PUT',
					value: 'PUT',
				},
			],
			default: 'GET',
			description: 'HTTP 请求方法',
		},
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			default: '',
			placeholder: '/api/endpoint',
			description: 'API 端点路径（基础URL从凭证中获取）',
			required: true,
		},
		{
			displayName: 'Send Query Parameters',
			name: 'sendQuery',
			type: 'boolean',
			default: false,
			noDataExpression: true,
			description: 'Whether to send query parameters',
		},
		{
			displayName: 'Specify Query Parameters',
			name: 'specifyQuery',
			type: 'options',
			displayOptions: {
				show: {
					sendQuery: [true],
				},
			},
			options: [
				{
					name: 'Using Fields Below',
					value: 'keypair',
				},
				{
					name: 'Using JSON',
					value: 'json',
				},
			],
			default: 'keypair',
		},
		{
			displayName: 'Query Parameters',
			name: 'queryParameters',
			type: 'fixedCollection',
			displayOptions: {
				show: {
					sendQuery: [true],
					specifyQuery: ['keypair'],
				},
			},
			typeOptions: {
				multipleValues: true,
			},
			placeholder: 'Add Parameter',
			default: {
				parameters: [
					{
						name: '',
						value: '',
					},
				],
			},
			options: [
				{
					name: 'parameters',
					displayName: 'Parameter',
					values: [
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
						},
					],
				},
			],
		},
		{
			displayName: 'JSON',
			name: 'jsonQuery',
			type: 'json',
			displayOptions: {
				show: {
					sendQuery: [true],
					specifyQuery: ['json'],
				},
			},
			default: '',
		},
		{
			displayName: 'Send Body',
			name: 'sendBody',
			type: 'boolean',
			default: false,
			noDataExpression: true,
			description: 'Whether to send request body',
		},
		{
			displayName: 'Specify Body',
			name: 'specifyBody',
			type: 'options',
			displayOptions: {
				show: {
					sendBody: [true],
				},
			},
			options: [
				{
					name: 'Using Fields Below',
					value: 'keypair',
				},
				{
					name: 'Using JSON',
					value: 'json',
				},
			],
			default: 'keypair',
		},
		{
			displayName: 'Body Parameters',
			name: 'bodyParameters',
			type: 'fixedCollection',
			displayOptions: {
				show: {
					sendBody: [true],
					specifyBody: ['keypair'],
				},
			},
			typeOptions: {
				multipleValues: true,
			},
			placeholder: 'Add Parameter',
			default: {
				parameters: [
					{
						name: '',
						value: '',
					},
				],
			},
			options: [
				{
					name: 'parameters',
					displayName: 'Parameter',
					values: [
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
						},
					],
				},
			],
		},
		{
			displayName: 'JSON',
			name: 'jsonBody',
			type: 'json',
			displayOptions: {
				show: {
					sendBody: [true],
					specifyBody: ['json'],
				},
			},
			default: '',
		},
		{
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			placeholder: 'Add option',
			default: {},
			options: [
				{
					displayName: 'Return All',
					name: 'returnAll',
					type: 'boolean',
					default: false,
					description: 'Whether to return all results or only up to a given limit',
				},
				{
					displayName: 'Pagination Config',
					name: 'paginationConfig',
					type: 'fixedCollection',
					typeOptions: {
						multipleValues: false,
					},
					displayOptions: {
						show: {
							returnAll: [true],
						},
					},
					default: {
						config: {},
					},
					options: [
						{
							displayName: 'Config',
							name: 'config',
							values: [
								{
									displayName: 'Max Pages',
									name: 'maxPages',
									type: 'number',
									default: 1000,
									typeOptions: {
										minValue: 1,
									},
									description: '最大分页数限制，防止无限循环',
								},
								{
									displayName: 'Page Number Field',
									name: 'pageNumField',
									type: 'string',
									default: 'page',
									description: '页码参数的字段名（如：page, pageNum, offset）',
								},
								{
									displayName: 'Page Size Field',
									name: 'pageSizeField',
									type: 'string',
									default: 'limit',
									description: '分页大小参数的字段名（如：limit, pageSize, per_page）',
								},
								{
									displayName: 'Pagination Interval (Ms)',
									name: 'paginationInterval',
									type: 'number',
									typeOptions: {
										minValue: 0,
									},
									default: 0,
									description: '每次分页请求之间的时间间隔（毫秒），用于避免触发频控。0 表示不限制。',
								},
								{
									displayName: 'Response Data Path',
									name: 'dataPath',
									type: 'string',
									default: 'list',
									placeholder: 'list 或 data.list',
									description: '响应数据在返回对象中的路径（使用点号分隔，如：list, data.list）。注意：RequestUtils 在成功时返回的是 data 字段，所以默认路径是 list',
								},
								{
									displayName: 'Response Total Path',
									name: 'totalPath',
									type: 'string',
									default: 'totalCount',
									placeholder: 'totalCount 或 data.totalCount',
									description: '总数据量在返回对象中的路径（使用点号分隔，如：totalCount, data.totalCount）。注意：RequestUtils 在成功时返回的是 data 字段，所以默认路径是 totalCount',
								},
							],
						},
					],
				},
				{
					displayName: 'Batching',
					name: 'batching',
					placeholder: 'Add Batching',
					type: 'fixedCollection',
					typeOptions: {
						multipleValues: false,
					},
					default: {
						batch: {},
					},
					options: [
						{
							displayName: 'Batching',
							name: 'batch',
							values: [
								{
									displayName: 'Items per Batch',
									name: 'batchSize',
									type: 'number',
									typeOptions: {
										minValue: -1,
									},
									default: 50,
									description:
										'输入将被分批处理以限制请求。 -1 表示禁用。0 将被视为 1。',
								},
								{
									displayName: 'Batch Interval (Ms)',
									name: 'batchInterval',
									type: 'number',
									typeOptions: {
										minValue: 0,
									},
									default: 1000,
									description: '每批请求之间的时间（毫秒）。0 表示禁用。',
								},
							],
						},
					],
				},
				{
					displayName: 'Timeout',
					name: 'timeout',
					type: 'number',
					typeOptions: {
						minValue: 1,
					},
					default: 300000,
					description:
						'等待服务器发送响应头（并开始响应体）的时间（毫秒），超过此时间将中止请求',
				},
			],
		},
	] as INodeProperties[],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const method = this.getNodeParameter('method', index) as IHttpRequestMethods;
		const url = this.getNodeParameter('url', index) as string;
		const sendQuery = this.getNodeParameter('sendQuery', index, false) as boolean;
		const sendBody = this.getNodeParameter('sendBody', index, false) as boolean;
		const options = this.getNodeParameter('options', index, {}) as RequestOptions;

		const getValueByPath = (obj: any, path: string): any => {
			if (!path) return obj;
			return path.split('.').reduce((current, key) => current?.[key], obj);
		};

		const parseValue = (value: string): any => {
			if (value === '') {
				return '';
			}
			// 尝试解析为 JSON（支持数字、布尔值、null、对象、数组）
			try {
				const parsed = jsonParse(value);
				return parsed;
			} catch {
				// 如果不是有效的 JSON，返回原始字符串
				return value;
			}
		};

		const parseKeyValuePairs = (parameters: ParameterItem[]): IDataObject => {
			const result: IDataObject = {};
			parameters.forEach((param) => {
				if (param.name) {
					const value = parseValue(param.value);
					// 如果参数名包含点号，将其解析为嵌套对象路径
					if (param.name.includes('.')) {
						setValueByPath(result, param.name, value);
					} else {
						result[param.name] = value;
					}
				}
			});
			return result;
		};

		const parseParameters = (
			paramName: string,
			specifyName: string,
			jsonParamName: string,
			errorMsg: string,
		): IDataObject | undefined => {
			const specifyType = this.getNodeParameter(specifyName, index, 'keypair') as string;

			if (specifyType === 'keypair') {
				const parameters = this.getNodeParameter(paramName, index, []) as ParameterItem[];
				return parameters.length > 0 ? parseKeyValuePairs(parameters) : undefined;
			}

			if (specifyType === 'json') {
				const jsonString = this.getNodeParameter(jsonParamName, index, '') as string;
				if (jsonString) {
					try {
						return jsonParse(jsonString);
					} catch (error) {
						throw new Error(errorMsg);
					}
				}
			}

			return undefined;
		};

		const setValueByPath = (obj: any, path: string, value: any): void => {
			if (!path) {
				return;
			}
			const keys = path.split('.');
			let current = obj;
			for (let i = 0; i < keys.length - 1; i++) {
				const key = keys[i];
				if (!current[key] || typeof current[key] !== 'object') {
					current[key] = {};
				}
				current = current[key];
			}
			current[keys[keys.length - 1]] = value;
		};

		const detectPaginationPath = (
			params: IDataObject,
			pageSizeField: string,
		): string | null => {
			// 常见的分页路径
			const commonPaths = [
				'options.pagination',
				'pagination',
				'pageInfo',
				'paging',
			];

			for (const path of commonPaths) {
				const obj = getValueByPath(params, path);
				if (obj && typeof obj === 'object' && obj[pageSizeField] !== undefined) {
					return path;
				}
			}

			return null;
		};

		const applyPaginationParams = (
			params: IDataObject,
			pageNum: number,
			config: PaginationConfig,
			method?: IHttpRequestMethods,
		): void => {
			const pageSizeField = config.pageSizeField || 'limit';
			const pageNumField = config.pageNumField || 'page';

			// 自动检测分页路径
			let paginationPath: string | null = detectPaginationPath(params, pageSizeField);

			// 如果检测不到，根据 HTTP 方法决定
			if (!paginationPath) {
				if (method && method !== 'GET') {
					// 对于 POST/PUT/PATCH 等方法，默认使用 options.pagination（Authing API 标准格式）
					paginationPath = 'options.pagination';
				}
			}

			if (paginationPath) {
				// 分页参数在嵌套路径中
				// 检查是否已存在分页对象
				const existingPagination = getValueByPath(params, paginationPath);
				if (existingPagination && typeof existingPagination === 'object') {
					// 创建新对象，保留现有字段，更新 page 字段
					const updatedPagination: IDataObject = { ...existingPagination };
					updatedPagination[pageNumField] = pageNum;
					// 如果 limit 不存在，才设置默认值（保留用户设置的值）
					if (!updatedPagination[pageSizeField]) {
						updatedPagination[pageSizeField] = DEFAULT_PAGE_SIZE;
					}
					// 使用 setValueByPath 确保修改被应用到原始对象
					setValueByPath(params, paginationPath, updatedPagination);
				} else {
					// 创建新对象
					const paginationObj: IDataObject = {};
					paginationObj[pageNumField] = pageNum;
					paginationObj[pageSizeField] = DEFAULT_PAGE_SIZE;
					setValueByPath(params, paginationPath, paginationObj);
				}
			} else {
				// 分页参数在顶层（主要用于 GET 请求）
				params[pageNumField] = pageNum;
				if (!params[pageSizeField]) {
					params[pageSizeField] = DEFAULT_PAGE_SIZE;
				}
			}
		};

		const buildRequestOptions = (
			pageNum?: number,
			cachedParams?: { qs?: IDataObject; body?: IDataObject },
		): IHttpRequestOptions => {
			const requestOptions: IHttpRequestOptions = { method, url, json: true };

			// 如果提供了缓存的参数，使用缓存的参数（用于分页时复用）
			if (cachedParams) {
				if (cachedParams.qs) {
					// 深拷贝以避免修改原始对象
					requestOptions.qs = JSON.parse(JSON.stringify(cachedParams.qs));
				}
				if (cachedParams.body) {
					// 深拷贝以避免修改原始对象
					requestOptions.body = JSON.parse(JSON.stringify(cachedParams.body));
				}
			} else {
				// 否则重新解析参数
				if (sendQuery) {
					const qs = parseParameters(
						'queryParameters.parameters',
						'specifyQuery',
						'jsonQuery',
						'查询参数 JSON 格式无效',
					);
					if (qs) requestOptions.qs = qs;
				}

				if (sendBody) {
					const body = parseParameters(
						'bodyParameters.parameters',
						'specifyBody',
						'jsonBody',
						'请求体 JSON 格式无效',
					);
					if (body) requestOptions.body = body;
				}
			}

			if (pageNum !== undefined && options.returnAll) {
				const config = options.paginationConfig?.config || {};

				// 如果 query 和 body 都没有，根据 HTTP 方法决定创建 qs 还是 body
				if (!requestOptions.qs && !requestOptions.body) {
					// GET 方法使用 query 参数，其他方法使用 body
					if (method === 'GET') {
						requestOptions.qs = {};
					} else {
						requestOptions.body = {};
					}
				}

				const targetParams = (requestOptions.qs || requestOptions.body) as IDataObject;
				applyPaginationParams(targetParams, pageNum, config, method);
			}

			if (options.timeout) {
				requestOptions.timeout = options.timeout;
			}

			return requestOptions;
		};

		const handleBatchDelay = async (): Promise<void> => {
			const batchSize = options.batching?.batch?.batchSize ?? -1;
			const batchInterval = options.batching?.batch?.batchInterval ?? 0;

			if (index > 0 && batchSize >= 0 && batchInterval > 0) {
				const effectiveBatchSize = batchSize > 0 ? batchSize : 1;
				if (index % effectiveBatchSize === 0) {
					await sleep(batchInterval);
				}
			}
		};

		const fetchAllPages = async (): Promise<any[]> => {
			const config = options.paginationConfig?.config || {};
			// RequestUtils.request 在成功时返回的是 data 字段，所以默认路径应该是 list 和 totalCount
			const dataPath = config.dataPath || 'list';
			const totalPath = config.totalPath || 'totalCount';
			const maxPages = config.maxPages || DEFAULT_MAX_PAGES;
			const paginationInterval = config.paginationInterval ?? 0;

			// 预先解析并缓存参数对象，以便在分页时复用（避免每次重新解析导致 page 无法累加）
			const cachedParams: { qs?: IDataObject; body?: IDataObject } = {};
			if (sendQuery) {
				const qs = parseParameters(
					'queryParameters.parameters',
					'specifyQuery',
					'jsonQuery',
					'查询参数 JSON 格式无效',
				);
				if (qs) {
					// 深拷贝以避免修改原始对象
					cachedParams.qs = JSON.parse(JSON.stringify(qs));
				}
			}
			if (sendBody) {
				const body = parseParameters(
					'bodyParameters.parameters',
					'specifyBody',
					'jsonBody',
					'请求体 JSON 格式无效',
				);
				if (body) {
					// 深拷贝以避免修改原始对象
					cachedParams.body = JSON.parse(JSON.stringify(body));
				}
			}

			const allResults: any[] = [];
			let pageNum = 1;

			const requestOptions = buildRequestOptions(pageNum, cachedParams);
			const response = await RequestUtils.request.call(this, requestOptions);

			// 如果响应本身就是数组，直接返回
			if (Array.isArray(response)) {
				return response;
			}

			const data = getValueByPath(response, dataPath);
			const total = getValueByPath(response, totalPath);

			const hasPaginationStructure = data !== undefined && total !== undefined;

			if (!hasPaginationStructure) {
				return Array.isArray(response) ? response : [response];
			}

			if (!Array.isArray(data)) {
				return Array.isArray(response) ? response : [response];
			}

			allResults.push(...data);

			// 如果已经获取了所有数据，直接返回
			if (allResults.length >= total || data.length === 0) {
				return allResults;
			}

			pageNum++;

			while (true) {
				if (paginationInterval > 0) {
					await sleep(paginationInterval);
				}

				// 使用缓存的参数对象，只更新 page 值
				const nextRequestOptions = buildRequestOptions(pageNum, cachedParams);
				const nextResponse = await RequestUtils.request.call(this, nextRequestOptions);

				// 如果响应本身就是数组，直接添加
				if (Array.isArray(nextResponse)) {
					allResults.push(...nextResponse);
					break;
				}

				const nextData = getValueByPath(nextResponse, dataPath) || [];
				const nextTotal = getValueByPath(nextResponse, totalPath) || 0;

				if (!Array.isArray(nextData)) {
					break;
				}

				allResults.push(...nextData);

				// 如果已经获取了所有数据，或者达到最大页数，或者当前页没有数据，停止
				if (allResults.length >= nextTotal || pageNum >= maxPages || nextData.length === 0) {
					break;
				}

				pageNum++;
			}

			return allResults;
		};

		await handleBatchDelay();

		if (!options.returnAll) {
			return await RequestUtils.request.call(this, buildRequestOptions());
		}

		return await fetchAllPages();
	},
};

export default CustomRequestOperate;
