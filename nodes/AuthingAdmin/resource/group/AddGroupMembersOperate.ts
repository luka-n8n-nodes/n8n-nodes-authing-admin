import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const AddGroupMembersOperate: ResourceOperations = {
    name: '添加分组成员',
    value: 'addGroupMembers',
    action: '添加分组成员',
    options: [
        {
            displayName: '分组 Code',
            name: 'code',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：developer',

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
        const code = this.getNodeParameter('code', index, '') as string;
        const userIdsData = this.getNodeParameter('userIds', index, '') as string | string[];

        // 处理 userIds 数组
        let userIds: string[] = [];
        try {
            const parsed = typeof userIdsData === 'string' ? JSON.parse(userIdsData) : userIdsData;
            if (Array.isArray(parsed)) {
                userIds = parsed.filter((id) => id && typeof id === 'string' && id.trim());
            }
        } catch (error: any) {
            throw new Error(`Invalid JSON in userIds: ${error.message || error}`);
        }

        if (userIds.length === 0) {
            throw new Error('用户 ID 数组不能为空');
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: '/api/v3/add-group-members',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                code,
                userIds,
            },
        };

        return await RequestUtils.request.call(this, requestOptions) as IDataObject;
    },
};

export default AddGroupMembersOperate;

