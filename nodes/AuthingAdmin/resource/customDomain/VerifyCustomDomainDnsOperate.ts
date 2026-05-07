import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const VerifyCustomDomainDnsOperate: ResourceOperations = {
    name: '验证域名 DNS 归属',
    value: 'verifyCustomDomainDns',
    action: '验证域名 DNS 归属',
    order: 300,
    options: [],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const response = await RequestUtils.request.call(this, {
            method: 'GET',
            url: '/api/v3/verify-custom-domain-dns',
        });

        return response as IDataObject;
    },
};

export default VerifyCustomDomainDnsOperate;
