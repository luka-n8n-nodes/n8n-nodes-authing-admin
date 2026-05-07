import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const ListGroupsOperate: ResourceOperations = {
    name: '获取分组列表',
    value: 'listGroups',
    action: '获取分组列表',
    order: 900,
    options: [
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
                    displayName: 'Keywords',
                    name: 'keywords',
                    type: 'string',

                    default: '',
                    placeholder: '例如：分组1',
                    description: '搜索分组 code 或分组名称',
                },
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
                    displayName: 'With Metadata',
                    name: 'withMetadata',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to display metadata content',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
        const limit = this.getNodeParameter('limit', index, 50) as number;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        // 统一的请求函数
        const fetchPage = async (pageNum: number, pageSize: number) => {
            const requestOptions: IHttpRequestOptions = {
                method: 'GET',
                url: '/api/v3/list-groups',
                qs: {},
            };

            // 处理分页参数
            requestOptions.qs!.page = pageNum;
            requestOptions.qs!.limit = pageSize;

            // 处理 options 中的可选参数
            if (options && Object.keys(options).length > 0) {
                const opts = options as any;

                // 处理 keywords
                if (opts.keywords !== undefined && opts.keywords !== '') {
                    requestOptions.qs!.keywords = opts.keywords;
                }

                if (opts.withMetadata !== undefined) {
                    requestOptions.qs!.withMetadata = opts.withMetadata;
                }
                if (opts.withCustomData !== undefined) {
                    requestOptions.qs!.withCustomData = opts.withCustomData;
                }
                if (opts.flatCustomData !== undefined) {
                    requestOptions.qs!.flatCustomData = opts.flatCustomData;
                }
            }

            const response = await RequestUtils.request.call(this, requestOptions);

            // 处理响应数据
            const responseData = response as any;
            const data = responseData?.list || [];
            const total = responseData?.totalCount || 0;

            return {
                data,
                total,
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

export default ListGroupsOperate;

