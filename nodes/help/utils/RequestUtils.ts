import { IExecuteFunctions, IHttpRequestOptions, JsonObject, NodeApiError } from 'n8n-workflow';
import { Credentials } from '../type/enums';

class RequestUtils {
    /**
     * 处理响应体数据，统一处理业务逻辑
     * @param context 执行上下文
     * @param response 原始响应数据
     * @param isRetry 是否为重试请求（用于错误提示）
     * @returns 处理后的响应数据
     */
    private static handleResponse(
        context: IExecuteFunctions,
        response: any,
        isRetry = false,
    ): any {
        // 处理二进制数据（如下载资源操作）
        if (response instanceof Buffer || response instanceof ArrayBuffer || response instanceof Uint8Array) {
            return response;
        }

        // Authing API 响应格式检查
        if (response?.apiCode !== undefined) {
            // 如果 apiCode 不为 200，表示有错误
            if (response.apiCode !== 200) {
                const errorPrefix = isRetry ? '刷新凭证后请求 Authing API 仍然失败' : '请求 Authing API 错误';
                const errorMsg = `${errorPrefix}: ${response.apiCode}, ${response.message || '未知错误'}`;

                throw new NodeApiError(context.getNode(), response as JsonObject, {
                    message: errorMsg,
                    description: response?.message || '',
                });
            }
        }

        // 正常响应，返回 data 字段或原始响应
        return response?.data || response;
    }

    static async originRequest(
        this: IExecuteFunctions,
        options: IHttpRequestOptions,
        clearAccessToken = false,
    ) {
        const authenticationMethod = Credentials.AuthingAdminApi;

        const credentials = await this.getCredentials(authenticationMethod);
        options.baseURL = credentials.baseUrl as string;

        // 如果 clearAccessToken 为 true，则将 accessToken 替换为空字符串，
        // 这样可以触发 preAuthentication 方法获取新的 access token
        if (clearAccessToken) {
            const additionalCredentialOptions = {
                credentialsDecrypted: {
                    id: Credentials.Id,
                    name: Credentials.AuthingAdminApi,
                    type: Credentials.Type,
                    data: {
                        ...credentials,
                        accessToken: '',
                    },
                },
            };

            return this.helpers.httpRequestWithAuthentication.call(
                this,
                authenticationMethod,
                options,
                additionalCredentialOptions,
            );
        }

        return this.helpers.httpRequestWithAuthentication.call(this, authenticationMethod, options);
    }

    static async request(this: IExecuteFunctions, options: IHttpRequestOptions) {
        if (options.json === undefined) options.json = true;

        return RequestUtils.originRequest
            .call(this, options)
            .then(async (response) => {
                // 处理 token 过期或其他认证错误
                if (response?.apiCode === 2020 || response?.apiCode === 401) {
                    // 重新获取 token 后的请求
                    const retryResponse = await RequestUtils.originRequest.call(this, options, true);
                    // 使用统一的响应处理函数，标记为重试请求
                    return RequestUtils.handleResponse(this, retryResponse, true);
                }

                // 使用统一的响应处理函数
                return RequestUtils.handleResponse(this, response);
            })
            .catch((error) => {
                // 处理真正的网络错误或其他异常（非200响应）
                throw error;
            });
    }
}

export default RequestUtils;

