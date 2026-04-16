import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const UpdateCustomDomainOperate: ResourceOperations = {
    name: '更新自定义域名',
    value: 'updateCustomDomain',
    action: '更新自定义域名',
    options: [
        {
            displayName: '证书',
            name: 'httpsCertificate',
            type: 'string',
            required: true,
            default: '',
            placeholder: 'BEGIN CERTIFICATE--- ... END CERTIFICATE-----',
            typeOptions: {
                rows: 5,
            },
            description: 'HTTPS 证书内容',
        },
        {
            displayName: '证书私钥',
            name: 'httpsPrivateKey',
            type: 'string',
            required: true,
            default: '',
            placeholder: 'BEGIN RSA PRIVATE KEY ... END RSA PRIVATE KEY-----',
            typeOptions: {
                rows: 5,
            },
            description: 'HTTPS 证书私钥内容',
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const httpsCertificate = this.getNodeParameter('httpsCertificate', index, '') as string;
        const httpsPrivateKey = this.getNodeParameter('httpsPrivateKey', index, '') as string;

        if (!httpsCertificate || httpsCertificate.trim() === '') {
            throw new Error('HTTPS 证书不能为空');
        }
        if (!httpsPrivateKey || httpsPrivateKey.trim() === '') {
            throw new Error('HTTPS 证书私钥不能为空');
        }

        const response = await RequestUtils.request.call(this, {
            method: 'POST',
            url: '/api/v3/update-custom-domain',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                httpsCertificate,
                httpsPrivateKey,
            },
        });

        return response as IDataObject;
    },
};

export default UpdateCustomDomainOperate;
