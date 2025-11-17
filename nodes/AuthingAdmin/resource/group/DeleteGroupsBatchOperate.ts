import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DeleteGroupsBatchOperate: ResourceOperations = {
    name: '批量删除分组',
    value: 'deleteGroupsBatch',
    action: '批量删除分组',
    options: [
        {
            displayName: '分组 Code 列表',
            name: 'codeList',
            type: 'json',
            required: true,
            default: JSON.stringify(['code1'], null, 2),
            typeOptions: {
                rows: 3,
            },
            placeholder: '例如：["code1", "code2"]',
            description: '分组 code 列表，JSON 数组格式',
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const codeListData = this.getNodeParameter('codeList', index, '') as string | string[];

        // 处理 codeList 数组
        let codeList: string[] = [];
        if (codeListData) {
            try {
                const parsed = typeof codeListData === 'string'
                    ? JSON.parse(codeListData)
                    : codeListData;
                if (Array.isArray(parsed) && parsed.length > 0) {
                    codeList = parsed.filter((code) => code && typeof code === 'string' && code.trim() !== '');
                }
            } catch (error: any) {
                throw new Error(`Invalid JSON in codeList: ${error.message || error}`);
            }
        }

        if (codeList.length === 0) {
            throw new Error('分组 code 列表不能为空');
        }

        const requestBody: IDataObject = {
            codeList,
        };

        const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: '/api/v3/delete-groups-batch',
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

export default DeleteGroupsBatchOperate;

