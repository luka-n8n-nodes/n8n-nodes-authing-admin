import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const CreateOrUpdateGroupOperate: ResourceOperations = {
    name: '创建或修改分组',
    value: 'createOrUpdateGroup',
    action: '创建或修改分组',
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
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const code = this.getNodeParameter('code', index, '') as string;
        const name = this.getNodeParameter('name', index, '') as string;
        const description = this.getNodeParameter('description', index, '') as string;
        const type = this.getNodeParameter('type', index, '') as string;

        const requestBody: IDataObject = {
            code,
            name,
            description,
            type,
        };

        const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: '/api/v3/create-or-update-group',
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

export default CreateOrUpdateGroupOperate;

