import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetDepartmentOperate: ResourceOperations = {
    name: '获取部门信息',
    value: 'getDepartment',
    action: '获取部门信息',
    options: [
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
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            options: [
                {
                    displayName: '组织 code',
                    name: 'organizationCode',
                    type: 'string',
                    default: '',
                    placeholder: '例如：steamory',
                    description: 'The unique code of the organization',
                },
                {
                    displayName: '部门 code',
                    name: 'departmentCode',
                    type: 'string',
                    default: '',
                    placeholder: '例如：example',
                    description: 'Department code',
                },
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
                    displayName: 'With Custom Data',
                    name: 'withCustomData',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to get custom data',
                },
                {
                    displayName: 'Flat Custom Data',
                    name: 'flatCustomData',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to flatten extended fields',
                },
                {
                    displayName: 'Tenant ID',
                    name: 'tenantId',
                    type: 'string',
                    default: '',
                    placeholder: 'e.g. 623c20b2a062aaaaf41b17da',
                    description: 'Tenant ID',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const departmentId = this.getNodeParameter('departmentId', index, '') as string;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        const qs: IDataObject = { departmentId };

        if (options.organizationCode) qs.organizationCode = options.organizationCode;
        if (options.departmentCode) qs.departmentCode = options.departmentCode;
        if (options.departmentIdType) qs.departmentIdType = options.departmentIdType;
        if (options.withCustomData !== undefined) qs.withCustomData = options.withCustomData;
        if (options.flatCustomData !== undefined) qs.flatCustomData = options.flatCustomData;
        if (options.tenantId) qs.tenantId = options.tenantId;

        const response = await RequestUtils.request.call(this, {
            method: 'GET',
            url: '/api/v3/get-department',
            qs,
        });

        return response as IDataObject;
    },
};

export default GetDepartmentOperate;
