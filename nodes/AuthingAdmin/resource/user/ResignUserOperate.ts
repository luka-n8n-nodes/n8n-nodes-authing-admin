import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const ResignUserOperate: ResourceOperations = {
    name: '离职用户',
    value: 'resignUser',
    action: '离职用户',
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
                    displayName: 'User Id Type',
                    name: 'userIdType',
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
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            throw new Error('用户ID是必填参数，不能为空');
        }

        const requestBody: IDataObject = {
            userId,
        };

        // 处理 options 中的可选参数
        if (options && Object.keys(options).length > 0) {
            const opts = options as any;

            // 处理 userIdType 参数
            if (opts.userIdType) {
                requestBody.userIdType = opts.userIdType;
            }
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: '/api/v3/resign-user',
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

export default ResignUserOperate;

