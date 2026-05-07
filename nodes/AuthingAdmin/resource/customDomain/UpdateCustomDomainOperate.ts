import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const UpdateCustomDomainOperate: ResourceOperations = {
    name: '更新自定义域名',
    value: 'updateCustomDomain',
    action: '更新自定义域名',
    order: 400,
    options: [
        {
            displayName: '证书',
            name: 'httpsCertificate',
            type: 'string',
            required: true,
            default: '',
            placeholder: '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----',
            typeOptions: {
                rows: 5,
            },
            description: 'HTTPS 证书内容，必须以 <code>-----BEGIN CERTIFICATE-----</code> 开头，支持证书链（多个证书块）',
        },
        {
            displayName: '证书私钥',
            name: 'httpsPrivateKey',
            type: 'string',
            required: true,
            default: '',
            placeholder: '-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----',
            typeOptions: {
                rows: 5,
            },
            description: 'HTTPS 证书私钥内容，必须以 <code>-----BEGIN RSA PRIVATE KEY-----</code> 开头',
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const rawCertificate = this.getNodeParameter('httpsCertificate', index, '') as string;
        const rawPrivateKey = this.getNodeParameter('httpsPrivateKey', index, '') as string;

        const httpsCertificate = rawCertificate.replace(/\r\n/g, '\n').trim();
        const httpsPrivateKey = rawPrivateKey.replace(/\r\n/g, '\n').trim();

        if (!httpsCertificate || httpsCertificate === '') {
            throw new Error('HTTPS 证书不能为空');
        }
        if (!httpsCertificate.startsWith('-----BEGIN CERTIFICATE-----')) {
            throw new Error('HTTPS 证书格式错误，必须以 -----BEGIN CERTIFICATE----- 开头');
        }
        if (!httpsPrivateKey || httpsPrivateKey === '') {
            throw new Error('HTTPS 证书私钥不能为空');
        }
        if (!httpsPrivateKey.startsWith('-----BEGIN RSA PRIVATE KEY-----')) {
            throw new Error('HTTPS 证书私钥格式错误，必须以 -----BEGIN RSA PRIVATE KEY----- 开头');
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
