import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const CreateGroupOperate: ResourceOperations = {
    name: '创建分组',
    value: 'createGroup',
    action: '创建分组',
    order: 600,
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
            displayName: '分组名称',
            name: 'name',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：开发者',

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
            displayName: '分组类型',
            name: 'type',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：static',

        },
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            options: [
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
        const name = this.getNodeParameter('name', index, '') as string;
        const description = this.getNodeParameter('description', index, '') as string;
        const type = this.getNodeParameter('type', index, '') as string;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        const requestBody: IDataObject = {
            code,
            name,
            description,
            type,
        };

        // 处理 options 中的可选参数
        if (options && Object.keys(options).length > 0) {
            const opts = options as any;

            if (opts.customData) {
                try {
                    const parsed = typeof opts.customData === 'string'
                        ? JSON.parse(opts.customData)
                        : opts.customData;
                    if (parsed !== null && parsed !== undefined) {
                        requestBody.customData = parsed;
                    }
                } catch (error: any) {
                    throw new Error(`Invalid JSON in customData: ${error.message || error}`);
                }
            }
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: '/api/v3/create-group',
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

export default CreateGroupOperate;

