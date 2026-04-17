import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const VerifyCustomDomainHttpsOperate: ResourceOperations = {
    name: '验证域名 HTTPS 归属',
    value: 'verifyCustomDomainHttps',
    action: '验证域名 HTTPS 归属',
    options: [],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const response = await RequestUtils.request.call(this, {
            method: 'GET',
            url: '/api/v3/verify-custom-domain-https',
        });

        return response as IDataObject;
    },
};

export default VerifyCustomDomainHttpsOperate;
