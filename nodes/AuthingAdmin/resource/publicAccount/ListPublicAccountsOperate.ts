import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const ListPublicAccountsOperate: ResourceOperations = {
    name: '获取/搜索公共账号列表',
    value: 'listPublicAccounts',
    action: '获取/搜索公共账号列表',
    options: [
        {
            displayName: '模糊搜索关键字',
            name: 'keywords',
            type: 'string',

            default: '',
            placeholder: '例如：张三'
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
                    displayName: '高级搜索',
                    name: 'advancedFilter',
                    type: 'json',

                    default: JSON.stringify(
                        [
                            {
                                field: 'status',
                                operator: 'EQUAL',
                                value: 'Activated',
                            },
                        ],
                        null,
                        2,
                    ),
                    typeOptions: {
                        rows: 5,
                    },
                    description: '高级搜索，JSON 格式',
                },
                {
                    displayName: 'Fuzzy Search On',
                    name: 'fuzzySearchOn',
                    type: 'json',

                    default: JSON.stringify(
                        ['phone', 'email', 'name', 'username', 'nickname', 'identityNumber'],
                        null,
                        2,
                    ),
                    typeOptions: {
                        rows: 3,
                    },
                    description: '模糊搜索匹配的公共账号字段，可选值为：ID, phone, email, name, username, externalId, nickname, company, givenName, familyName, middleName, profile, preferredUsername, website, address, formatted, streetAddress, postalCode, identityNumber',
                },
                {
                    displayName: 'Search Query',
                    name: 'searchQuery',
                    type: 'json',

                    default: JSON.stringify(
                        {
                            query: {
                                bool: {
                                    must: [{ term: { phone: '18818888888' } }],
                                    must_not: [],
                                },
                            },
                            sort: ['_score', { created_at: 'ASC' }],
                        },
                        null,
                        2,
                    ),
                    typeOptions: {
                        rows: 5,
                    },
                    description: '使用 ES 查询语句执行搜索命令'
                },
                {
                    displayName: 'Sort',
                    name: 'sort',
                    type: 'json',

                    default: JSON.stringify(
                        [
                            {
                                field: 'createdAt',
                                direction: 'desc',
                            },
                        ],
                        null,
                        2,
                    ),
                    typeOptions: {
                        rows: 5,
                    },
                    description: '排序设置，可以设置多项按照多个字段进行排序（field: 排序字段, direction: 排序方向 desc/asc）',
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
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
        const limit = this.getNodeParameter('limit', index, 50) as number;

        const keywords = this.getNodeParameter('keywords', index, '') as string;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        // 统一的请求函数
        const fetchPage = async (pageNum: number, pageSize: number) => {
            const requestOptions: IHttpRequestOptions = {
                method: 'POST',
                url: '/api/v3/list-public-accounts',
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const requestBody: IDataObject = {};

            // 处理 keywords
            if (keywords) {
                requestBody.keywords = keywords;
            }

            // 处理 options collection
            const optionsObj: IDataObject = {};

            if (options && Object.keys(options).length > 0) {
                const opts = options as any;

                // 处理 advancedFilter
                if (opts.advancedFilter) {
                    try {
                        const parsed = typeof opts.advancedFilter === 'string'
                            ? JSON.parse(opts.advancedFilter)
                            : opts.advancedFilter;
                        if (parsed !== null && parsed !== undefined) {
                            requestBody.advancedFilter = parsed;
                        }
                    } catch (error) {
                        throw new Error(`Invalid JSON in advancedFilter: ${error.message}`);
                    }
                }

                // 处理 pagination（分页参数由函数参数控制，覆盖用户设置）
                optionsObj.pagination = {
                    page: pageNum,
                    limit: pageSize,
                };

                // 处理 fuzzySearchOn
                if (opts.fuzzySearchOn) {
                    try {
                        const parsed = typeof opts.fuzzySearchOn === 'string'
                            ? JSON.parse(opts.fuzzySearchOn)
                            : opts.fuzzySearchOn;
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            optionsObj.fuzzySearchOn = parsed;
                        }
                    } catch (error) {
                        throw new Error(`Invalid JSON in fuzzySearchOn: ${error.message}`);
                    }
                }

                // 处理 searchQuery
                if (opts.searchQuery) {
                    try {
                        const parsed = typeof opts.searchQuery === 'string'
                            ? JSON.parse(opts.searchQuery)
                            : opts.searchQuery;
                        if (parsed !== null && parsed !== undefined) {
                            requestBody.searchQuery = parsed;
                        }
                    } catch (error) {
                        throw new Error(`Invalid JSON in searchQuery: ${error.message}`);
                    }
                }

                // 处理 sort
                if (opts.sort) {
                    try {
                        const parsed = typeof opts.sort === 'string'
                            ? JSON.parse(opts.sort)
                            : opts.sort;
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            const sortArray = parsed.map((item: any) => {
                                if (item.direction) {
                                    return {
                                        field: item.field,
                                        direction: item.direction,
                                    };
                                }
                                return item;
                            });
                            optionsObj.sort = sortArray;
                        }
                    } catch (error) {
                        throw new Error(`Invalid JSON in sort: ${error.message}`);
                    }
                }

                // 处理 boolean 选项
                if (opts.withCustomData !== undefined) {
                    optionsObj.withCustomData = opts.withCustomData;
                }
                if (opts.withDepartmentIds !== undefined) {
                    optionsObj.withDepartmentIds = opts.withDepartmentIds;
                }
            } else {
                // 如果没有 options，至少需要设置 pagination
                optionsObj.pagination = {
                    page: pageNum,
                    limit: pageSize,
                };
            }

            if (Object.keys(optionsObj).length > 0) {
                requestBody.options = optionsObj;
            }

            if (Object.keys(requestBody).length > 0) {
                requestOptions.body = requestBody;
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

export default ListPublicAccountsOperate;

