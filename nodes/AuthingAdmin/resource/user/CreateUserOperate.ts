import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const CreateUserOperate: ResourceOperations = {
    name: '创建用户',
    value: 'createUser',
    action: '创建用户',
    options: [
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            options: [
                {
                    displayName: 'Address',
                    name: 'address',
                    type: 'string',
                    default: '',
                    description: '地址',
                },
                {
                    displayName: 'Auto Generate Password',
                    name: 'autoGeneratePassword',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to auto generate password',
                },
                {
                    displayName: 'Birthdate',
                    name: 'birthdate',
                    type: 'string',
                    default: '',
                    placeholder: '例如：2022-06-03',
                    description: '出生日期',
                },
                {
                    displayName: 'Browser',
                    name: 'browser',
                    type: 'string',
                    default: '',
                    description: '上次登录使用的浏览器 User Agent',
                },
                {
                    displayName: 'City',
                    name: 'city',
                    type: 'string',
                    default: '',
                    description: '所在城市',
                },
                {
                    displayName: 'Company',
                    name: 'company',
                    type: 'string',
                    default: '',
                    description: '公司',
                },
                {
                    displayName: 'Country',
                    name: 'country',
                    type: 'string',
                    default: '',
                    description: '所在国家',
                },
                {
                    displayName: 'Custom Data',
                    name: 'customData',
                    type: 'json',
                    default: JSON.stringify({}, null, 2),
                    typeOptions: {
                        rows: 5,
                    },
                    description: '自定义数据，传入对象中的 key 必须在用户池中预先定义为自定义字段',
                },
                {
                    displayName: 'Department ID Type',
                    name: 'departmentIdType',
                    type: 'string',
                    default: '',
                    description: '部门ID类型',
                },
                {
                    displayName: 'Department IDs',
                    name: 'departmentIds',
                    type: 'json',
                    default: JSON.stringify([], null, 2),
                    typeOptions: {
                        rows: 3,
                    },
                    description: '用户所属部门ID列表',
                },
                {
                    displayName: 'Device',
                    name: 'device',
                    type: 'string',
                    default: '',
                    description: '上次登录使用的设备',
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    placeholder: 'name@email.com',
                    default: '',
                    description: '邮箱，不区分大小写',
                },
                {
                    displayName: 'Email Verified',
                    name: 'emailVerified',
                    type: 'boolean',
                    default: false,
                    description: 'Whether the email is verified',
                },
                {
                    displayName: 'External ID',
                    name: 'externalId',
                    type: 'string',
                    default: '',
                    description: '第三方外部ID',
                },
                {
                    displayName: 'Family Name',
                    name: 'familyName',
                    type: 'string',
                    default: '',
                    description: '姓',
                },
                {
                    displayName: 'Formatted',
                    name: 'formatted',
                    type: 'string',
                    default: '',
                    description: '标准完整地址',
                },
                {
                    displayName: 'Gender',
                    name: 'gender',
                    type: 'options',
                    default: 'U',
                    options: [
                        { name: '男性', value: 'M' },
                        { name: '女性', value: 'F' },
                        { name: '未知', value: 'U' },
                    ],
                    description: '性别',
                },
                {
                    displayName: 'Given Name',
                    name: 'givenName',
                    type: 'string',
                    default: '',
                    description: '名',
                },
                {
                    displayName: 'Identities',
                    name: 'identities',
                    type: 'json',
                    default: JSON.stringify(
                        [
                            {
                                extIdpId: '6076bacxxxxxxxxd80d993b5',
                                provider: 'wechat',
                                type: 'openid',
                                userIdInIdp: 'oj7Nq05R-RRaqak0_YlMLnnIwsvg',
                                userInfoInIdp: {},
                            },
                        ],
                        null,
                        2,
                    ),
                    typeOptions: {
                        rows: 5,
                    },
                    description:
                        '第三方身份源（建议通过专用接口进行绑定），JSON 格式。数组中每个对象必填字段：extIdpId（身份源连接ID）、provider（外部身份源类型）、type（身份类型）、userIdInIdp（用户在外部身份源中的ID）、userInfoInIdp（用户在 IdP 中的身份信息）。非必填字段：accessToken、refreshToken、originConnIds。provider的可选值可参考：https://api-explorer.authing.cn/?tag=tag/%E7%AE%A1%E7%90%86%E7%94%A8%E6%88%B7/API%20%E5%88%97%E8%A1%A8/operation/UsersManagementController_createUser',
                },
                {
                    displayName: 'Identity Number',
                    name: 'identityNumber',
                    type: 'string',
                    default: '',
                    description: '用户身份证号',
                },
                {
                    displayName: 'Keep Password',
                    name: 'keepPassword',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to keep password',
                },
                {
                    displayName: 'Locale',
                    name: 'locale',
                    type: 'string',
                    default: '',
                    description: '语言信息',
                },
                {
                    displayName: 'Metadata Source',
                    name: 'metadataSource',
                    type: 'json',
                    default: JSON.stringify({}, null, 2),
                    typeOptions: {
                        rows: 5,
                    },
                    description: '数据对象数据，传入对象中的 key 必须在用户池中预先定义为与用户数据对象相关的自定义字段',
                },
                {
                    displayName: 'Middle Name',
                    name: 'middleName',
                    type: 'string',
                    default: '',
                    description: '中间名',
                },
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    description: '用户真实姓名，不保证唯一性',
                },
                {
                    displayName: 'Nickname',
                    name: 'nickname',
                    type: 'string',
                    default: '',
                    description: '昵称',
                },
                {
                    displayName: 'OTP',
                    name: 'otp',
                    type: 'json',
                    default: JSON.stringify(
                        {
                            recoveryCode: 'b471-8ec0-874a-087f-bccb-cd54',
                            secret: 'HZ2F6J3AGNAVSOTV',
                        },
                        null,
                        2,
                    ),
                    typeOptions: {
                        rows: 3,
                    },
                    description: '用户的 OTP 认证器。secret 必填，recoveryCode 非必填',
                },
                {
                    displayName: 'Password',
                    name: 'password',
                    type: 'string',
                    typeOptions: { password: true },
                    default: '',
                    description: '用户密码，默认为明文。使用 HTTPS 进行安全传输',
                },
                {
                    displayName: 'Password Encrypt Type',
                    name: 'passwordEncryptType',
                    type: 'options',
                    default: 'none',
                    options: [
                        { name: 'None', value: 'none', description: '不对密码进行加密，使用明文进行传输' },
                        { name: 'RSA', value: 'rsa', description: '使用 RSA256 算法对密码进行加密' },
                        { name: 'SM2', value: 'sm2', description: '使用 国密 SM2 算法 对密码进行加密' },
                    ],
                    description: '密码加密类型',
                },
                {
                    displayName: 'Phone',
                    name: 'phone',
                    type: 'string',
                    default: '',
                    description: '手机号，不包含国家码。如果是国际手机号，需要在 phoneCountryCode 参数中指定国家码',
                },
                {
                    displayName: 'Phone Country Code',
                    name: 'phoneCountryCode',
                    type: 'string',
                    default: '',
                    placeholder: '例如：+86',
                    description: '手机号国家码，中国大陆手机号不需要此参数',
                },
                {
                    displayName: 'Phone Verified',
                    name: 'phoneVerified',
                    type: 'boolean',
                    default: false,
                    description: 'Whether the phone number is verified',
                },
                {
                    displayName: 'Photo',
                    name: 'photo',
                    type: 'string',
                    default: '',
                    description: '头像链接',
                },
                {
                    displayName: 'Postal Code',
                    name: 'postalCode',
                    type: 'string',
                    default: '',
                    description: '邮政编码',
                },
                {
                    displayName: 'Preferred Username',
                    name: 'preferredUsername',
                    type: 'string',
                    default: '',

                },
                {
                    displayName: 'Profile',
                    name: 'profile',
                    type: 'string',
                    default: '',
                    description: '个人资料',
                },
                {
                    displayName: 'Province',
                    name: 'province',
                    type: 'string',
                    default: '',
                    description: '所在省份',
                },
                {
                    displayName: 'Region',
                    name: 'region',
                    type: 'string',
                    default: '',
                    description: '用户所在地区',
                },
                {
                    displayName: 'Reset Password On First Login',
                    name: 'resetPasswordOnFirstLogin',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to require password reset on first login',
                },
                {
                    displayName: 'Salt',
                    name: 'salt',
                    type: 'string',
                    default: '',
                    description: '加密用户密码的盐值',
                },
                {
                    displayName: 'Send Notification',
                    name: 'sendNotification',
                    type: 'json',
                    default: JSON.stringify(
                        {
                            sendEmailNotification: true,
                            sendPhoneNotification: true,
                            appId: '',
                        },
                        null,
                        2,
                    ),
                    typeOptions: {
                        rows: 3,
                    },
                    description: '发送通知配置。包含 sendEmailNotification（创建账号之后,是否发送邮件通知）、sendPhoneNotification（创建账号之后,是否发送短信通知）、appId（发送登录地址时,指定的应用ID）',
                },
                {
                    displayName: 'Status',
                    name: 'status',
                    type: 'options',
                    default: 'Activated',
                    options: [
                        { name: 'Activated', value: 'Activated' },
                        { name: 'Archived', value: 'Archived' },
                        { name: 'Deactivated', value: 'Deactivated' },
                        { name: 'Resigned', value: 'Resigned' },
                        { name: 'Suspended', value: 'Suspended' },
                    ],
                    description: '当前账号状态',
                },
                {
                    displayName: 'Street Address',
                    name: 'streetAddress',
                    type: 'string',
                    default: '',
                    description: '街道地址',
                },
                {
                    displayName: 'Tenant IDs',
                    name: 'tenantIds',
                    type: 'json',
                    default: JSON.stringify([], null, 2),
                    typeOptions: {
                        rows: 3,
                    },
                    description: '租户ID 数组',
                },
                {
                    displayName: 'Username',
                    name: 'username',
                    type: 'string',
                    default: '',
                    description: '用户名，在用户池内唯一',
                },
                {
                    displayName: 'Website',
                    name: 'website',
                    type: 'string',
                    default: '',
                    description: '个人网站',
                },
                {
                    displayName: 'Zoneinfo',
                    name: 'zoneinfo',
                    type: 'string',
                    default: '',
                    description: '用户时区信息',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: '/api/v3/create-user',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const requestBody: IDataObject = {};

        // 处理 options 中的参数
        if (options && Object.keys(options).length > 0) {
            const opts = options as any;

            // 处理基本字段
            const basicFields = [
                'name', 'nickname', 'photo', 'externalId', 'status', 'emailVerified', 'phoneVerified',
                'birthdate', 'country', 'province', 'city', 'address', 'streetAddress', 'postalCode',
                'gender', 'username', 'email', 'phone', 'phoneCountryCode', 'password', 'salt', 'company',
                'browser', 'device', 'givenName', 'familyName', 'middleName', 'profile',
                'preferredUsername', 'website', 'zoneinfo', 'locale', 'formatted', 'region', 'identityNumber',
            ];

            basicFields.forEach((field) => {
                if (opts[field] !== undefined && opts[field] !== null && opts[field] !== '') {
                    requestBody[field] = opts[field];
                }
            });

            // 处理 customData
            if (opts.customData) {
                try {
                    const parsed = typeof opts.customData === 'string'
                        ? JSON.parse(opts.customData)
                        : opts.customData;
                    if (parsed !== null && parsed !== undefined) {
                        requestBody.customData = parsed;
                    }
                } catch (error) {
                    throw new Error(`Invalid JSON in customData: ${error.message}`);
                }
            }

            // 处理 metadataSource
            if (opts.metadataSource) {
                try {
                    const parsed = typeof opts.metadataSource === 'string'
                        ? JSON.parse(opts.metadataSource)
                        : opts.metadataSource;
                    if (parsed !== null && parsed !== undefined) {
                        requestBody.metadataSource = parsed;
                    }
                } catch (error) {
                    throw new Error(`Invalid JSON in metadataSource: ${error.message}`);
                }
            }

            // 处理 tenantIds
            if (opts.tenantIds) {
                try {
                    const parsed = typeof opts.tenantIds === 'string'
                        ? JSON.parse(opts.tenantIds)
                        : opts.tenantIds;
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        requestBody.tenantIds = parsed;
                    }
                } catch (error) {
                    throw new Error(`Invalid JSON in tenantIds: ${error.message}`);
                }
            }

            // 处理 departmentIds
            if (opts.departmentIds) {
                try {
                    const parsed = typeof opts.departmentIds === 'string'
                        ? JSON.parse(opts.departmentIds)
                        : opts.departmentIds;
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        requestBody.departmentIds = parsed;
                    }
                } catch (error) {
                    throw new Error(`Invalid JSON in departmentIds: ${error.message}`);
                }
            }

            // 处理 otp
            if (opts.otp) {
                try {
                    const parsed = typeof opts.otp === 'string'
                        ? JSON.parse(opts.otp)
                        : opts.otp;
                    if (parsed !== null && parsed !== undefined) {
                        requestBody.otp = parsed;
                    }
                } catch (error) {
                    throw new Error(`Invalid JSON in otp: ${error.message}`);
                }
            }

            // 处理 identities
            if (opts.identities) {
                try {
                    const parsed = typeof opts.identities === 'string'
                        ? JSON.parse(opts.identities)
                        : opts.identities;
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        requestBody.identities = parsed;
                    }
                } catch (error) {
                    throw new Error(`Invalid JSON in identities: ${error.message}`);
                }
            }

            // 处理 options 对象中的字段
            const optionsObj: IDataObject = {};

            // 处理密码相关选项
            if (opts.autoGeneratePassword !== undefined) {
                optionsObj.autoGeneratePassword = opts.autoGeneratePassword;
            }
            if (opts.resetPasswordOnFirstLogin !== undefined) {
                optionsObj.resetPasswordOnFirstLogin = opts.resetPasswordOnFirstLogin;
            }
            if (opts.keepPassword !== undefined) {
                optionsObj.keepPassword = opts.keepPassword;
            }
            if (opts.departmentIdType) {
                optionsObj.departmentIdType = opts.departmentIdType;
            }
            if (opts.passwordEncryptType) {
                optionsObj.passwordEncryptType = opts.passwordEncryptType;
            }

            // 处理 sendNotification 对象
            if (opts.sendNotification) {
                try {
                    const parsed = typeof opts.sendNotification === 'string'
                        ? JSON.parse(opts.sendNotification)
                        : opts.sendNotification;
                    if (parsed !== null && parsed !== undefined && Object.keys(parsed).length > 0) {
                        optionsObj.sendNotification = parsed;
                    }
                } catch (error) {
                    throw new Error(`Invalid JSON in sendNotification: ${error.message}`);
                }
            }

            // 如果有任何 options 字段，则添加到请求体
            if (Object.keys(optionsObj).length > 0) {
                requestBody.options = optionsObj;
            }
        }

        requestOptions.body = requestBody;

        const response = await RequestUtils.request.call(this, requestOptions);

        // 返回响应数据
        return response as IDataObject;
    },
};

export default CreateUserOperate;

