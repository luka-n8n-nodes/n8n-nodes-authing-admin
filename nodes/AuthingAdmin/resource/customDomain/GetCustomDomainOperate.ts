import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const GetCustomDomainOperate: ResourceOperations = {
    name: '获取自定义域名',
    value: 'getCustomDomain',
    action: '获取自定义域名',
    options: [],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const response = await RequestUtils.request.call(this, {
            method: 'GET',
            url: '/api/v3/get-custom-domain',
        });

        return response as IDataObject;
    },
};

export default GetCustomDomainOperate;
