import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetUsersOfPublicAccountOperate: ResourceOperations = {
    name: '公共账号的用户列表',
    value: 'getUsersOfPublicAccount',
    action: '公共账号的用户列表',
    options: [
        {
            displayName: '公共账号 ID',
            name: 'publicAccountId',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：6229ffaxxxxxxxxcade3e3d9',
            description: '公共账号 ID',
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const publicAccountId = this.getNodeParameter('publicAccountId', index, '') as string;

        if (!publicAccountId || typeof publicAccountId !== 'string' || publicAccountId.trim() === '') {
            throw new Error('公共账号 ID 是必填参数，不能为空');
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'GET',
            url: '/api/v3/get-users-of-public-account',
            qs: {
                publicAccountId,
            },
        };

        const response = await RequestUtils.request.call(this, requestOptions);

        // 返回响应数据
        return response as IDataObject;
    },
};

export default GetUsersOfPublicAccountOperate;

