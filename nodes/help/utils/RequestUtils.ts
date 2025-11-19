import {
	IExecuteFunctions,
	IHttpRequestOptions,
	JsonObject,
	NodeApiError
} from 'n8n-workflow';
import { Credentials } from '../type/enums';

class RequestUtils {
	/**
	 * 判断是否是凭证失效的错误
	 * @param statusCode 业务请求状态码
	 * @param apiCode 业务错误码
	 * @returns 是否是凭证失效
	 */
	private static isAuthenticationError(statusCode?: number, apiCode?: number): boolean {
		// 2020: 尚未登录，无权限访问此请求
		const authenticationErrorCodes = [2020];

		return apiCode !== undefined && authenticationErrorCodes.includes(apiCode);
	}

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

		const { statusCode, apiCode, data, message } = response || {};

		// statusCode 为 200 时表示请求成功，此时不会带有 apiCode
		if (statusCode === 200) {
			return data !== undefined ? data : response;
		}

		// statusCode 不为 200 时表示请求失败，此时可能带有 apiCode
		const errorPrefix = isRetry ? '刷新凭证后请求Authing API仍然失败' : '请求Authing API错误';
		const errorDetails = apiCode
			? `statusCode: ${statusCode}, apiCode: ${apiCode}`
			: `statusCode: ${statusCode}`;
		const errorMsg = `${errorPrefix}: ${errorDetails}${message ? `, ${message}` : ''}`;

		throw new NodeApiError(context.getNode(), response as JsonObject, {
			message: errorMsg,
			description: response?.message || '',
		});
	}

	static async originRequest(
		this: IExecuteFunctions,
		options: IHttpRequestOptions,
		clearAccessToken = false,
	) {
		const authenticationMethod = this.getNodeParameter(
			'authentication',
			0,
			Credentials.AuthingAdminApi,
		) as string;

		const credentials = await this.getCredentials(authenticationMethod);
		options.baseURL = credentials.baseUrl as string;

		if (authenticationMethod === Credentials.AuthingAdminApi) {
			// 如果 clearAccessToken 为 true，则将 accessToken 替换为空字符串，
			// 这样可以触发 preAuthentication 方法获取新的 access token
			const additionalCredentialOptions = {
				credentialsDecrypted: {
					id: Credentials.Id,
					name: Credentials.AuthingAdminApi,
					type: Credentials.Type,
					data: {
						...credentials,
						accessToken: clearAccessToken ? '' : credentials.accessToken,
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
				// Authing API 所有接口返回的 HTTP 状态码均为 200
				// 需要通过响应体的 statusCode 判断请求是否成功
				const { statusCode, apiCode } = response || {};

				// statusCode 为 200 时表示请求成功
				if (statusCode === 200) {
					return RequestUtils.handleResponse(this, response);
				}

				// statusCode 不为 200 时，检查是否是凭证失效
				if (RequestUtils.isAuthenticationError(statusCode, apiCode)) {
					// 凭证失效，清除 accessToken 并重新获取凭证后重试
					const retryResponse = await RequestUtils.originRequest.call(this, options, true);
					// 使用统一的响应处理函数，标记为重试请求
					return RequestUtils.handleResponse(this, retryResponse, true);
				}

				// 其他错误，直接处理
				return RequestUtils.handleResponse(this, response);
			})
			.catch((error) => {
				// 处理真正的网络错误或其他异常（非200 HTTP状态码）
				throw error;
			});
	}
}

export default RequestUtils;

