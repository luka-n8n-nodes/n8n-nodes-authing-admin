import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const CreateCustomDomainOperate: ResourceOperations = {
    name: '创建自定义域名',
    value: 'createCustomDomain',
    action: '创建自定义域名',
    order: 500,
    options: [
        {
            displayName: '自定义域名',
            name: 'customDomain',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：sso.example.com',
            description: 'The custom domain to create',
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const customDomain = this.getNodeParameter('customDomain', index, '') as string;

        const response = await RequestUtils.request.call(this, {
            method: 'POST',
            url: '/api/v3/create-custom-domain',
            body: {
                customDomain,
            },
        });

        return response as IDataObject;
    },
};

export default CreateCustomDomainOperate;
