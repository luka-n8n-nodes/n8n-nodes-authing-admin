import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetAllDepartmentsOperate: ResourceOperations = {
    name: '获取所有部门列表',
    value: 'getAllDepartments',
    action: '获取所有部门列表',
    options: [
        {
            displayName: '组织 Code',
            name: 'organizationCode',
            type: 'string',
            required: true,
            default: '0',
            placeholder: '例如：steamory',
            description: 'The unique code of the organization',
        },
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            options: [
                {
                    displayName: '部门 ID',
                    name: 'departmentId',
                    type: 'string',
                    default: '',
                    placeholder: '例如：root',
                    description: 'Department ID. Defaults to the root department ID if not specified.',
                },
                {
                    displayName: '部门 ID 类型',
                    name: 'departmentIdType',
                    type: 'options',
                    default: 'department_id',
                    options: [
                        {
                            name: 'Department_id',
                            value: 'department_id',
                        },
                        {
                            name: 'Open_department_id',
                            value: 'open_department_id',
                        },
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
                    displayName: 'With Post',
                    name: 'withPost',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to get post data',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const organizationCode = this.getNodeParameter('organizationCode', index, '') as string;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        const qs: IDataObject = { organizationCode };

        if (options.departmentId !== undefined && options.departmentId !== '') {
            qs.departmentId = options.departmentId;
        }
        if (options.departmentIdType !== undefined) {
            qs.departmentIdType = options.departmentIdType;
        }
        if (options.withCustomData !== undefined) {
            qs.withCustomData = options.withCustomData;
        }
        if (options.withPost !== undefined) {
            qs.withPost = options.withPost;
        }

        const response = await RequestUtils.request.call(this, {
            method: 'GET',
            url: '/api/v3/get-all-departments',
            qs,
        });

        const data = response as any;
        return (data?.list ?? data) as IDataObject | IDataObject[];
    },
};

export default GetAllDepartmentsOperate;
