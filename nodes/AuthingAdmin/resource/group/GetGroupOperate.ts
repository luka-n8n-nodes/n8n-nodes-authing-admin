import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetGroupOperate: ResourceOperations = {
    name: '获取分组详情',
    value: 'getGroup',
    action: '获取分组详情',
    options: [
        {
            displayName: '分组 Code',
            name: 'code',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：分组1',

        },
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            options: [
                {
                    displayName: 'With Custom Data',
                    name: 'withCustomData',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to get custom data',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const code = this.getNodeParameter('code', index, '') as string;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        if (!code || typeof code !== 'string' || code.trim() === '') {
            throw new Error('分组 code 是必填参数，不能为空');
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'GET',
            url: '/api/v3/get-group',
            qs: {
                code,
            },
        };

        // 处理 options 中的可选参数
        if (options && Object.keys(options).length > 0) {
            const opts = options as any;

            if (opts.withCustomData !== undefined) {
                requestOptions.qs!.withCustomData = opts.withCustomData;
            }
        }

        const response = await RequestUtils.request.call(this, requestOptions);

        // 返回响应数据
        return response as IDataObject;
    },
};

export default GetGroupOperate;

