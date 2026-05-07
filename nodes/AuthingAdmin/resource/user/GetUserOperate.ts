import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetUserOperate: ResourceOperations = {
    name: '获取用户信息',
    value: 'getUser',
    action: '获取用户信息',
    order: 500,
    options: [
        {
            displayName: '用户ID',
            name: 'userId',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：6229ffaxxxxxxxxcade3e3d9',
            description: '用户的唯一标志，可以是用户ID、用户名、邮箱、手机号、externalId、在外部身份源的ID',
        },
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            options: [
                {
                    displayName: 'Flat Custom Data',
                    name: 'flatCustomData',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to flatten extended fields',
                },
                {
                    displayName: 'User ID Type',
                    name: 'userIdType',
                    type: 'string',

                    default: 'user_id',
                    placeholder: '例如：user_id',
                    description: '用户ID 类型，可选值：user_id, external_id, phone, email, username, identity, sync_relation, custom_field。默认值为 user_id',
                },
                {
                    displayName: 'With Custom Data',
                    name: 'withCustomData',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to get custom data',
                },
                {
                    displayName: 'With Department IDs',
                    name: 'withDepartmentIds',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to get department ID list',
                },
                {
                    displayName: 'With Identities',
                    name: 'withIdentities',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to get identities',
                },
                {
                    displayName: 'With Post',
                    name: 'withPost',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to get department information',
                },
                {
                    displayName: 'With Tenant IDs',
                    name: 'withTenantIds',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to get tenant ID list that the user has joined',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const userId = this.getNodeParameter('userId', index, '') as string;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        if (!userId) {
            throw new Error('用户ID不能为空');
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'GET',
            url: '/api/v3/get-user',
            qs: {
                userId,
            },
        };

        // 处理 options 中的可选参数
        if (options && Object.keys(options).length > 0) {
            const opts = options as any;

            // 处理 userIdType 参数
            if (opts.userIdType) {
                requestOptions.qs!.userIdType = opts.userIdType;
            }

            if (opts.flatCustomData !== undefined) {
                requestOptions.qs!.flatCustomData = opts.flatCustomData;
            }
            if (opts.withCustomData !== undefined) {
                requestOptions.qs!.withCustomData = opts.withCustomData;
            }
            if (opts.withPost !== undefined) {
                requestOptions.qs!.withPost = opts.withPost;
            }
            if (opts.withIdentities !== undefined) {
                requestOptions.qs!.withIdentities = opts.withIdentities;
            }
            if (opts.withDepartmentIds !== undefined) {
                requestOptions.qs!.withDepartmentIds = opts.withDepartmentIds;
            }
            if (opts.withTenantIds !== undefined) {
                requestOptions.qs!.withTenantIds = opts.withTenantIds;
            }
        }

        const response = await RequestUtils.request.call(this, requestOptions);

        // 返回响应数据
        return response as IDataObject;
    },
};

export default GetUserOperate;

