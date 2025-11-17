import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const KickUserOperate: ResourceOperations = {
    name: '强制下线用户',
    value: 'kickUser',
    action: '强制下线用户',
    options: [
        {
            displayName: '用户ID',
            name: 'userId',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：6319a1504f3xxxxf214dd5b7',
            description: '用户ID',
        },
        {
            displayName: 'APP ID 列表',
            name: 'appIds',
            type: 'json',
            required: true,
            default: JSON.stringify(["62188e71cxxxx3075289c580"], null, 2),
            typeOptions: {
                rows: 3,
            },
            placeholder: '例如：["62188e71cxxxx3075289c580"]',
            description: 'APP ID 列表，JSON 数组格式',
        },
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            options: [
                {
                    displayName: 'User Id Type',
                    name: 'userldType',
                    type: 'string',
                    required: false,
                    default: 'user_id',
                    placeholder: '例如：user_id',
                    description: '用户ID 类型，可选值：user_id, external_id, phone, email, username, identity, sync_relation, custom_field。默认值为 user_id',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const userId = this.getNodeParameter('userId', index, '') as string;
        const appIdsData = this.getNodeParameter('appIds', index, '') as string | string[];
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        if (!userId) {
            throw new Error('用户ID不能为空');
        }

        // 处理 appIds 数组
        let appIds: string[] = [];
        if (appIdsData) {
            try {
                const parsed = typeof appIdsData === 'string'
                    ? JSON.parse(appIdsData)
                    : appIdsData;
                if (Array.isArray(parsed) && parsed.length > 0) {
                    appIds = parsed.filter((id) => id && typeof id === 'string' && id.trim() !== '');
                }
            } catch (error: any) {
                throw new Error(`Invalid JSON in appIds: ${error.message || error}`);
            }
        }

        if (appIds.length === 0) {
            throw new Error('APP ID 列表不能为空');
        }

        const requestBody: IDataObject = {
            userld: userId,
            applds: appIds,
        };

        // 处理 options 中的可选参数
        if (options && Object.keys(options).length > 0) {
            const opts = options as any;

            // 处理 userldType 参数
            if (opts.userldType) {
                if (!requestBody.options) {
                    requestBody.options = {};
                }
                (requestBody.options as IDataObject).userldType = opts.userldType;
            }
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: '/api/v3/kick-users',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        };

        const response = await RequestUtils.request.call(this, requestOptions);

        // 返回响应数据
        return response as IDataObject;
    },
};

export default KickUserOperate;

