import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const RemoveCustomDomainOperate: ResourceOperations = {
    name: '移除自定义域名',
    value: 'removeCustomDomain',
    action: '移除自定义域名',
    options: [],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const response = await RequestUtils.request.call(this, {
            method: 'POST',
            url: '/api/v3/remove-custom-domain',
        });

        return response as IDataObject;
    },
};

export default RemoveCustomDomainOperate;
