import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const UpdateGroupOperate: ResourceOperations = {
    name: '修改分组',
    value: 'updateGroup',
    action: '修改分组',
    options: [
        {
            displayName: '分组 Code',
            name: 'code',
            type: 'options',
            required: true,
            default: '',
            typeOptions: {
                loadOptionsMethod: 'getGroups',
            },
        },
        {
            displayName: '分组描述',
            name: 'description',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：描述内容',

        },
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            options: [
                {
                    displayName: '分组名称',
                    name: 'name',
                    type: 'string',

                    default: '',
                    placeholder: '例如：开发者',

                },
                {
                    displayName: 'New Code',
                    name: 'newCode',
                    type: 'string',

                    default: '',
                    placeholder: '例如：developer',
                    description: '分组新的 code',
                },
                {
                    displayName: 'Custom Data',
                    name: 'customData',
                    type: 'json',

                    default: JSON.stringify({ "custom_id": "xxx" }, null, 2),
                    typeOptions: {
                        rows: 5,
                    },
                    description: '自定义数据，传入的对象中的 key 必须先在用户池定义相关自定义字段',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const code = this.getNodeParameter('code', index, '') as string;
        const description = this.getNodeParameter('description', index, '') as string;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        const requestBody: IDataObject = {
            code,
            description,
        };

        // 处理 options 中的可选参数
        if (options && Object.keys(options).length > 0) {
            const opts = options as any;

            if (opts.name) {
                requestBody.name = opts.name;
            }
            if (opts.newCode) {
                requestBody.newCode = opts.newCode;
            }
            if (opts.customData) {
                try {
                    const parsed = typeof opts.customData === 'string'
                        ? JSON.parse(opts.customData)
                        : opts.customData;
                    if (parsed) {
                        requestBody.customData = parsed;
                    }
                } catch (error: any) {
                    throw new Error(`Invalid JSON in customData: ${error.message || error}`);
                }
            }
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: '/api/v3/update-group',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        };

        const response = await RequestUtils.request.call(this, requestOptions);

        // 返回响应数据
        return response as IDataObject;
    },
};

export default UpdateGroupOperate;

