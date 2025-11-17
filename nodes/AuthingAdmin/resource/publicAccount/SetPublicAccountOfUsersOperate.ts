import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const SetPublicAccountOfUsersOperate: ResourceOperations = {
    name: '公共账号绑定批量用户',
    value: 'setPublicAccountOfUsers',
    action: '公共账号绑定批量用户',
    options: [
        {
            displayName: '公共账号 ID',
            name: 'publicAccountId',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：6229ffaxxxxxxxxcade3e3d9',

        },
        {
            displayName: '用户 ID 数组',
            name: 'userIds',
            type: 'json',
            required: true,
            default: JSON.stringify(['6229ffaxxxxxxxxcade3e3d9'], null, 2),
            typeOptions: {
                rows: 3,
            },
            placeholder: '例如：["6229ffaxxxxxxxxcade3e3d9"]',
            description: '用户 ID 数组，JSON 数组格式',
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const publicAccountId = this.getNodeParameter('publicAccountId', index, '') as string;
        const userIdsData = this.getNodeParameter('userIds', index, '') as string | string[];

        let userIds: string[] = [];
        try {
            const parsed = typeof userIdsData === 'string' ? JSON.parse(userIdsData) : userIdsData;
            userIds = Array.isArray(parsed) ? parsed.filter((id) => id && typeof id === 'string' && id.trim()) : [];
        } catch (error: any) {
            throw new Error(`Invalid JSON in userIds: ${error.message || error}`);
        }

        if (!userIds.length) throw new Error('用户 ID 数组不能为空');

        return await RequestUtils.request.call(this, {
            method: 'POST',
            url: '/api/v3/set-public-account-of-users',
            headers: { 'Content-Type': 'application/json' },
            body: { publicAccountId, userIds },
        }) as IDataObject;
    },
};

export default SetPublicAccountOfUsersOperate;

