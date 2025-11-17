import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const ListGroupMembersOperate: ResourceOperations = {
    name: '获取分组成员列表',
    value: 'listGroupMembers',
    action: '获取分组成员列表',
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
            displayName: 'Return All',
            name: 'returnAll',
            type: 'boolean',
            default: false,
            description: 'Whether to return all results or only up to a given limit',
        },
        {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            default: 50,
            typeOptions: {
                minValue: 1,
            },
            displayOptions: {
                show: {
                    returnAll: [false],
                },
            },
            description: 'Max number of results to return',
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
                    displayName: 'With Custom Data',
                    name: 'withCustomData',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to get custom data',
                },
                {
                    displayName: 'With Department IDs',
                    name: 'withDepartmentIds',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to get department ID list',
                },
                {
                    displayName: 'With Identities',
                    name: 'withIdentities',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to get identities',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const code = this.getNodeParameter('code', index, '') as string;
        const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
        const limit = this.getNodeParameter('limit', index, 50) as number;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        // 统一的请求函数
        const fetchPage = async (pageNum: number, pageSize: number) => {
            const opts = options as any;
            const qs: any = {
                code,
                page: pageNum,
                limit: pageSize,
            };

            if (opts.withCustomData !== undefined) qs.withCustomData = opts.withCustomData;
            if (opts.withIdentities !== undefined) qs.withIdentities = opts.withIdentities;
            if (opts.withDepartmentIds !== undefined) qs.withDepartmentIds = opts.withDepartmentIds;
            if (opts.flatCustomData !== undefined) qs.flatCustomData = opts.flatCustomData;

            const response = await RequestUtils.request.call(this, {
                method: 'GET',
                url: '/api/v3/list-group-members',
                qs,
            }) as any;

            return {
                data: response?.list || [],
                total: response?.totalCount || 0,
            };
        };

        // 处理分页逻辑
        if (returnAll) {
            let allResults: any[] = [];
            let pageNum = 1;
            const pageSize = Math.min(limit || 50, 50);

            while (true) {
                const { data, total } = await fetchPage(pageNum, pageSize);
                allResults = allResults.concat(data);

                // 检查是否还有更多数据
                if (allResults.length >= total || data.length === 0 || pageNum >= 1000) {
                    if (pageNum >= 1000) {
                        this.logger.warn('已达到最大分页数限制(1000页)，停止获取');
                    }
                    break;
                }

                pageNum++;
            }

            return allResults;
        } else {
            // 单次请求，返回第一页数据
            const { data } = await fetchPage(1, Math.min(limit || 50, 50));
            return data;
        }
    },
};

export default ListGroupMembersOperate;

