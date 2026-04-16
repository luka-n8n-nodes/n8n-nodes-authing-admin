import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const ListDepartmentMembersOperate: ResourceOperations = {
    name: '获取部门成员列表',
    value: 'listDepartmentMembers',
    action: '获取部门成员列表',
    options: [
        {
            displayName: '组织 Code',
            name: 'organizationCode',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：steamory',
            description: 'The unique code of the organization',
        },
        {
            displayName: '部门 ID',
            name: 'departmentId',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：root',
            description: 'Department ID. Use "root" for the root department',
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
                    displayName: '部门 ID 类型',
                    name: 'departmentIdType',
                    type: 'options',
                    default: 'department_id',
                    options: [
                        { name: 'department_id', value: 'department_id' },
                        { name: 'open_department_id', value: 'open_department_id' },
                        { name: 'sync_relation', value: 'sync_relation' },
                        { name: 'custom_field', value: 'custom_field' },
                        { name: 'code', value: 'code' },
                    ],
                    description: 'The type of department ID used in this request',
                },
                {
                    displayName: '是否包含子部门的成员',
                    name: 'includeChildrenDepartments',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to include members from child departments',
                },
                {
                    displayName: '租户 ID',
                    name: 'tenantId',
                    type: 'string',
                    default: '',
                    placeholder: '例如：623c20b2a062aaaaf41b17da',
                    description: 'Tenant ID',
                },
                {
                    displayName: 'Sort By',
                    name: 'sortBy',
                    type: 'options',
                    default: 'Default',
                    options: [
                        { name: 'Default', value: 'Default' },
                        { name: 'JoinDepartmentAt', value: 'JoinDepartmentAt' },
                        { name: 'userId', value: 'userId' },
                        { name: 'createAt', value: 'createAt' },
                        { name: 'updatedAt', value: 'updatedAt' },
                    ],
                    description: 'Field to sort results by',
                },
                {
                    displayName: 'Order By',
                    name: 'orderBy',
                    type: 'options',
                    default: 'Desc',
                    options: [
                        { name: 'Asc', value: 'Asc' },
                        { name: 'Desc', value: 'Desc' },
                    ],
                    description: 'Sort order: ascending or descending',
                },
                {
                    displayName: 'With Custom Data',
                    name: 'withCustomData',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to get custom data',
                },
                {
                    displayName: 'With Identities',
                    name: 'withIdentities',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to get identities',
                },
                {
                    displayName: 'With Department IDs',
                    name: 'withDepartmentIds',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to get department ID list',
                }
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const organizationCode = this.getNodeParameter('organizationCode', index, '') as string;
        const departmentId = this.getNodeParameter('departmentId', index, 'root') as string;
        const returnAll = this.getNodeParameter('returnAll', index, false) as boolean;
        const limit = this.getNodeParameter('limit', index, 50) as number;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        const fetchPage = async (pageNum: number, pageSize: number) => {
            const qs: IDataObject = {
                organizationCode,
                departmentId,
                page: pageNum,
                limit: pageSize,
            };

            const opts = options as any;
            if (opts.sortBy) qs.sortBy = opts.sortBy;
            if (opts.orderBy) qs.orderBy = opts.orderBy;
            if (opts.departmentIdType) qs.departmentIdType = opts.departmentIdType;
            if (opts.includeChildrenDepartments !== undefined) qs.includeChildrenDepartments = opts.includeChildrenDepartments;
            if (opts.withCustomData !== undefined) qs.withCustomData = opts.withCustomData;
            if (opts.withIdentities !== undefined) qs.withIdentities = opts.withIdentities;
            if (opts.withDepartmentIds !== undefined) qs.withDepartmentIds = opts.withDepartmentIds;
            if (opts.tenantId) qs.tenantId = opts.tenantId;

            const response = await RequestUtils.request.call(this, {
                method: 'GET',
                url: '/api/v3/list-department-members',
                qs,
            }) as any;

            return {
                data: response?.list || [],
                total: response?.totalCount || 0,
            };
        };

        if (returnAll) {
            let allResults: any[] = [];
            let pageNum = 1;
            const pageSize = 50;

            while (true) {
                const { data, total } = await fetchPage(pageNum, pageSize);
                allResults = allResults.concat(data);

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
            const { data } = await fetchPage(1, Math.min(limit, 50));
            return data;
        }
    },
};

export default ListDepartmentMembersOperate;
