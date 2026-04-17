import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DeleteGroupsBatchOperate: ResourceOperations = {
    name: '批量删除分组',
    value: 'deleteGroupsBatch',
    action: '批量删除分组',
    options: [
        {
            // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
            displayName: '分组 Code',
            name: 'codeList',
            // eslint-disable-next-line n8n-nodes-base/node-param-description-missing-from-dynamic-multi-options
            type: 'multiOptions',
            required: true,
            default: [],
            typeOptions: {
                loadOptionsMethod: 'getGroups',
            },
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const codeList = this.getNodeParameter('codeList', index, []) as string[];

        if (!codeList.length) {
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

