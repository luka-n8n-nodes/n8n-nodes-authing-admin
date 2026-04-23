import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const ListUsersOperate: ResourceOperations = {
    name: '获取/搜索用户列表',
    value: 'listUsers',
    action: '获取/搜索用户列表',
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
                    displayName: 'Flat Custom Data',
                    name: 'flatCustomData',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to flatten extended fields',
                },
                {
                    displayName: 'Full Custom Data',
                    name: 'fullCustomData',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return all custom data',
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
                    description: '模糊搜索字段数组',
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
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: false,
                    },
                    placeholder: 'Configure',
                    default: {
                        sortPair: {
                            field: 'createdAt',
                            order: 'desc',
                        },
                    },
                    options: [
                        {
                            name: 'sortPair',
                            displayName: 'Sort',
                            values: [
                                {
                                    displayName: 'Field',
                                    name: 'field',
                                    type: 'options',
                                    noDataExpression: true,
                                    default: 'createdAt',
                                    description: '与 Authing list-users 文档一致的可排序字段',
                                    options: [
                                        { name: 'Created At', value: 'createdAt' },
                                        { name: 'Email', value: 'email' },
                                        { name: 'External ID', value: 'externalId' },
                                        { name: 'Gender', value: 'gender' },
                                        { name: 'ID', value: 'id' },
                                        { name: 'Last IP', value: 'lastIp' },
                                        { name: 'Last Login', value: 'lastLogin' },
                                        { name: 'Last MFA Time', value: 'lastMfaTime' },
                                        { name: 'Logins Count', value: 'loginsCount' },
                                        { name: 'Password Last Set At', value: 'passwordLastSetAt' },
                                        { name: 'Password Security Level', value: 'passwordSecurityLevel' },
                                        { name: 'Phone', value: 'phone' },
                                        { name: 'Phone Country Code', value: 'phoneCountryCode' },
                                        { name: 'Status', value: 'status' },
                                        { name: 'Status Changed At', value: 'statusChangedAt' },
                                        { name: 'Updated At', value: 'updatedAt' },
                                        { name: 'User Source Type', value: 'userSourceType' },
                                        { name: 'Username', value: 'username' },
                                    ],
                                },
                                {
                                    displayName: 'Order',
                                    name: 'order',
                                    type: 'options',
                                    noDataExpression: true,
                                    default: 'desc',
                                    description: '排序方向：desc 降序，asc 升序',
                                    options: [
                                        { name: 'Asc', value: 'asc' },
                                        { name: 'Desc', value: 'desc' },
                                    ],
                                },
                            ],
                        },
                    ],
                    description:
                        'Field 与 Order 为一组同时出现/移除；去掉排序请从 Options 移除整项 Sort。对应 Authing options.sort 单条 { field, order }',
                },
                {
                    displayName: 'With Custom Data',
                    name: 'withCustomData',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return custom data',
                },
                {
                    displayName: 'With Department IDs',
                    name: 'withDepartmentIds',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return department ID list',
                },
                {
                    displayName: 'With Identities',
                    name: 'withIdentities',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return identities',
                },
                {
                    displayName: 'With Post',
                    name: 'withPost',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return department information',
                },
                {
                    displayName: 'With Tenant IDs',
                    name: 'withTenantIds',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return tenant ID list that the user has joined',
                },
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
                    description: '高级搜索，JSON 格式，详见：https://api-explorer.authing.cn/?tag=tag/%E7%AE%A1%E7%90%86%E7%94%A8%E6%88%B7/API%20%E5%88%97%E8%A1%A8/operation/UsersManagementController_listUsers',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
        const limit = this.getNodeParameter('limit', index, 50) as number;

        const keywords = this.getNodeParameter('keywords', index, '') as string;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        const normalizeSortOrder = (raw: unknown): 'asc' | 'desc' => {
            const lo = String(raw ?? 'desc').toLowerCase();
            return lo === 'asc' ? 'asc' : 'desc';
        };

        // 统一的请求函数；applyReturnAllSort 为 true 且用户未在 Options 里配置 sort 时，再在 options 中追加 id 降序 sort（returnAll 分页稳定排序）
        const fetchPage = async (pageNum: number, pageSize: number, applyReturnAllSort = false) => {
            const requestOptions: IHttpRequestOptions = {
                method: 'POST',
                url: '/api/v3/list-users',
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

                // 处理 sort：fixedCollection 存为 { sortPair: { field, order } }；兼容旧版扁平 collection、sortRule / sortRules / JSON 数组
                let sortSingle: { field: string; order: 'asc' | 'desc' } | null = null;
                if (opts.sort) {
                    if (typeof opts.sort === 'string') {
                        try {
                            const parsed = JSON.parse(opts.sort);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                const item = parsed[0];
                                if (typeof item === 'object' && item !== null && item.field) {
                                    sortSingle = {
                                        field: item.field,
                                        order: normalizeSortOrder(item.order),
                                    };
                                }
                            }
                        } catch (error) {
                            throw new Error(`Invalid JSON in sort: ${error.message}`);
                        }
                    } else if (typeof opts.sort === 'object' && opts.sort !== null) {
                        const so = opts.sort as IDataObject;
                        const pairFromObject = (obj: unknown) => {
                            if (!obj || typeof obj !== 'object') return;
                            const o = obj as IDataObject;
                            if (typeof o.field === 'string' && o.field.trim() !== '') {
                                sortSingle = {
                                    field: o.field,
                                    order: normalizeSortOrder(o.order),
                                };
                            }
                        };
                        const sp = so.sortPair;
                        if (Array.isArray(sp) && sp.length > 0) {
                            pairFromObject(sp[0]);
                        } else {
                            pairFromObject(sp);
                        }
                        if (!sortSingle && typeof so.field === 'string' && so.field.trim() !== '') {
                            sortSingle = {
                                field: so.field,
                                order: normalizeSortOrder(so.order),
                            };
                        }
                        if (!sortSingle) {
                            const rule = so.sortRule as IDataObject | undefined;
                            if (rule && typeof rule.field === 'string' && rule.field.trim() !== '') {
                                sortSingle = {
                                    field: rule.field,
                                    order: normalizeSortOrder(rule.order),
                                };
                            } else if (Array.isArray(so.sortRules) && (so.sortRules as any[]).length > 0) {
                                const item = (so.sortRules as any[])[0];
                                if (typeof item === 'object' && item !== null && item.field) {
                                    sortSingle = {
                                        field: item.field,
                                        order: normalizeSortOrder(item.order),
                                    };
                                }
                            }
                        }
                    }
                }
                if (sortSingle) {
                    optionsObj.sort = [sortSingle];
                }

                // 处理 boolean 选项
                if (opts.withCustomData !== undefined) {
                    optionsObj.withCustomData = opts.withCustomData;
                }
                if (opts.withPost !== undefined) {
                    optionsObj.withPost = opts.withPost;
                }
                if (opts.withIdentities !== undefined) {
                    optionsObj.withIdentities = opts.withIdentities;
                }
                if (opts.withDepartmentIds !== undefined) {
                    optionsObj.withDepartmentIds = opts.withDepartmentIds;
                }
                if (opts.fullCustomData !== undefined) {
                    optionsObj.fullCustomData = opts.fullCustomData;
                }
                if (opts.withTenantIds !== undefined) {
                    optionsObj.withTenantIds = opts.withTenantIds;
                }
                if (opts.flatCustomData !== undefined) {
                    optionsObj.flatCustomData = opts.flatCustomData;
                }
            } else {
                // 如果没有 options，至少需要设置 pagination
                optionsObj.pagination = {
                    page: pageNum,
                    limit: pageSize,
                };
            }

            if (applyReturnAllSort && !optionsObj.sort) {
                optionsObj.sort = [{ field: 'id', order: 'desc' }];
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
                const { data, total } = await fetchPage(pageNum, pageSize, true);
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

export default ListUsersOperate;

