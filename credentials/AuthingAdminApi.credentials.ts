import {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
    IHttpRequestHelper,
    ICredentialDataDecryptedObject
} from 'n8n-workflow';

export class AuthingAdminApi implements ICredentialType {
    name = 'authingAdminApi';
    displayName = 'Authing Admin API';
    documentationUrl = 'https://api-explorer.authing.cn/';
    // @ts-ignore
    icon = 'file:icon.svg';
    properties: INodeProperties[] = [
        {
            displayName: 'Authing 基础地址',
            name: 'baseUrl',
            type: 'string',
            default: 'https://console.authing.cn',
            required: true,
            description: 'Authing API 基础地址（默认：https://console.authing.cn）',
        },
        {
            displayName: 'AccessKey ID',
            name: 'accessKeyId',
            type: 'string',
            default: '',
            required: true,
            description: '如果是以用户池全局 AK/SK 初始化，为用户池 ID;如果是以协作管理员的 AK/SK 初始化，为协作管理员的 AccessKey ID。',
        },
        {
            displayName: 'AccessKey Secret',
            name: 'accessKeySecret',
            type: 'string',
            typeOptions: {
                password: true
            },
            default: '',
            required: true,
            description: '如果是以用户池全局 AK/SK 初始化，为用户池密钥；如果是以协作管理员的 AK/SK 初始化，为协作管理员的 SK。',
        },
        {
            displayName: 'AccessToken',
            name: 'accessToken',
            type: 'hidden',
            default: '',
            typeOptions: {
                expirable: true,
            },
        },
    ];

    // 认证配置 - 在实际请求中自动添加必要的头部信息
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'x-authing-userpool-id': '={{$credentials.accessKeyId}}',
                'authorization': '={{$credentials.accessToken}}',
            },
        },
    };

    // 在认证前处理 token
    async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
        const res = (await this.helpers.httpRequest({
            method: 'POST',
            baseURL: `${credentials.baseUrl}`,
            url: '/api/v3/get-management-token',
            body: {
                accessKeyId: credentials.accessKeyId,
                accessKeySecret: credentials.accessKeySecret,
            },
            json: true,
        })) as any;

        if (!res?.data?.access_token) {
            throw new Error(`获取 access_token 失败：${res?.message || '未知错误'}`);
        }

        return {
            accessToken: res.data.access_token
        };
    }

    // 测试连接配置
    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials.baseUrl}}',
            url: '/api/v3/list-users',
            method: 'POST',
            body: {
                accessKeyId: '={{$credentials.accessKeyId}}',
                accessKeySecret: '={{$credentials.accessKeySecret}}',
            }
        },
        rules: [
            {
                type: 'responseSuccessBody',
                properties: {
                    key: 'apiCode',
                    value: 2020,
                    message: '尚未登录，无权限访问此请求',
                },
            },
        ],
    };
}

