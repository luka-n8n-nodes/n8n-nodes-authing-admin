import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const UpdateUserOperate: ResourceOperations = {
    name: '修改用户资料',
    value: 'updateUser',
    action: '修改用户资料',
    options: [
        {
            displayName: '用户ID',
            name: 'userId',
            type: 'string',
            required: true,
            default: '',
            placeholder: '例如：6229ffaxxxxcxcade3e3d9',
            description: '用户的唯一标志，可以是用户ID、用户名、邮箱、手机号、externalId、在外部身份源的ID',
        },
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            options: [
                {
                    displayName: 'User Id Type',
                    name: 'userIdType',
                    type: 'string',
                    required: false,
                    default: 'user_id',
                    placeholder: '例如：user_id',
                    description: '用户ID 类型，可选值：user_id, external_id, phone, email, username, identity, sync_relation, custom_field。默认值为 user_id',
                },
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '用户真实姓名，不保证唯一性',
                },
                {
                    displayName: 'Nickname',
                    name: 'nickname',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '昵称',
                },
                {
                    displayName: 'Photo',
                    name: 'photo',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '头像链接',
                },
                {
                    displayName: 'External Id',
                    name: 'externalId',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '第三方外部ID',
                },
                {
                    displayName: 'Status',
                    name: 'status',
                    type: 'options',
                    required: false,
                    default: 'Activated',
                    options: [
                        { name: 'Activated', value: 'Activated' },
                        { name: 'Suspended', value: 'Suspended' },
                        { name: 'Resigned', value: 'Resigned' },
                        { name: 'Archived', value: 'Archived' },
                        { name: 'Deactivated', value: 'Deactivated' },
                    ],
                    description: '当前账号状态',
                },
                {
                    displayName: 'Email Verified',
                    name: 'emailVerified',
                    type: 'boolean',
                    required: false,
                    default: false,
                    description: '邮箱是否验证',
                },
                {
                    displayName: 'Phone Verified',
                    name: 'phoneVerified',
                    type: 'boolean',
                    required: false,
                    default: false,
                    description: '手机号是否验证',
                },
                {
                    displayName: 'Birthdate',
                    name: 'birthdate',
                    type: 'string',
                    required: false,
                    default: '',
                    placeholder: '例如：2022-06-03',
                    description: '出生日期',
                },
                {
                    displayName: 'Country',
                    name: 'country',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '所在国家',
                },
                {
                    displayName: 'Province',
                    name: 'province',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '所在省份',
                },
                {
                    displayName: 'City',
                    name: 'city',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '所在城市',
                },
                {
                    displayName: 'Address',
                    name: 'address',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '地址',
                },
                {
                    displayName: 'Street Address',
                    name: 'streetAddress',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '街道地址',
                },
                {
                    displayName: 'Postal Code',
                    name: 'postalCode',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '邮政编码',
                },
                {
                    displayName: 'Gender',
                    name: 'gender',
                    type: 'options',
                    required: false,
                    default: 'U',
                    options: [
                        { name: '男性', value: 'M' },
                        { name: '女性', value: 'F' },
                        { name: '未知', value: 'U' },
                    ],
                    description: '性别',
                },
                {
                    displayName: 'Username',
                    name: 'username',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '用户名，在用户池内唯一',
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '邮箱，不区分大小写',
                },
                {
                    displayName: 'Phone',
                    name: 'phone',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '手机号，不包含国家码。如果是国际手机号，需要在 phoneCountryCode 参数中指定国家码',
                },
                {
                    displayName: 'Phone Country Code',
                    name: 'phoneCountryCode',
                    type: 'string',
                    required: false,
                    default: '',
                    placeholder: '例如：-86',
                    description: '手机号国家码，中国大陆手机号不需要此参数',
                },
                {
                    displayName: 'Password',
                    name: 'password',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '用户密码，默认为明文。使用 HTTPS 进行安全传输',
                },
                {
                    displayName: 'Company',
                    name: 'company',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '公司',
                },
                {
                    displayName: 'Browser',
                    name: 'browser',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '上次登录使用的浏览器 User Agent',
                },
                {
                    displayName: 'Device',
                    name: 'device',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '上次登录使用的设备',
                },
                {
                    displayName: 'Given Name',
                    name: 'givenName',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '名',
                },
                {
                    displayName: 'Family Name',
                    name: 'familyName',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '姓',
                },
                {
                    displayName: 'Middle Name',
                    name: 'middleName',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '中文名',
                },
                {
                    displayName: 'Profile',
                    name: 'profile',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '个人资料',
                },
                {
                    displayName: 'Preferred Username',
                    name: 'preferredUsername',
                    type: 'string',
                    required: false,
                    default: '',
                    description: 'Preferred Username',
                },
                {
                    displayName: 'Website',
                    name: 'website',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '个人网站',
                },
                {
                    displayName: 'Zoneinfo',
                    name: 'zoneinfo',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '用户时区信息',
                },
                {
                    displayName: 'Locale',
                    name: 'locale',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '语言信息',
                },
                {
                    displayName: 'Formatted',
                    name: 'formatted',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '标准完整地址',
                },
                {
                    displayName: 'Region',
                    name: 'region',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '用户所在地区',
                },
                {
                    displayName: 'Identity Number',
                    name: 'identityNumber',
                    type: 'string',
                    required: false,
                    default: '',
                    description: '用户身份证号',
                },
                {
                    displayName: 'Custom Data',
                    name: 'customData',
                    type: 'json',
                    required: false,
                    default: JSON.stringify({}, null, 2),
                    description: '自定义数据，传入对象中的 key 必须在用户池中预先定义为自定义字段',
                },
                {
                    displayName: 'Metadata',
                    name: 'metadata',
                    type: 'json',
                    required: false,
                    default: JSON.stringify({}, null, 2),
                    typeOptions: {
                        rows: 5,
                    },
                    description: '数据对象数据，传入对象中的 key 必须在用户池中预先定义为与用户数据对象相关的自定义字段',
                },
                {
                    displayName: 'Auto Generate Password',
                    name: 'autoGeneratePassword',
                    type: 'boolean',
                    default: false,
                    description: '是否自动生成密码',
                },
                {
                    displayName: 'Reset Password On First Login',
                    name: 'resetPasswordOnFirstLogin',
                    type: 'boolean',
                    default: false,
                    description: '设置用户首次登录要求重置密码',
                },
                {
                    displayName: 'Reset Password On Next Login',
                    name: 'resetPasswordOnNextLogin',
                    type: 'boolean',
                    default: false,
                    description: '下次登录要求重置密码',
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
                    displayName: 'Send Default Email Notification',
                    name: 'sendDefaultEmailNotification',
                    type: 'boolean',
                    default: false,
                    description: '是否发送默认邮箱通知',
                },
                {
                    displayName: 'Send Default Phone Notification',
                    name: 'sendDefaultPhoneNotification',
                    type: 'boolean',
                    default: false,
                    description: '是否发送默认手机号通知',
                },
                {
                    displayName: 'Input Send Email Notification',
                    name: 'inputSendEmailNotification',
                    type: 'string',
                    default: '',
                    description: '指定发送邮箱通知的邮箱地址',
                },
                {
                    displayName: 'Input Send Phone Notification',
                    name: 'inputSendPhoneNotification',
                    type: 'string',
                    default: '',
                    description: '指定发送手机号通知的手机号',
                },
                {
                    displayName: 'App Id',
                    name: 'appId',
                    type: 'string',
                    default: '',
                    description: '应用ID',
                },
            ],
        },
    ],
    async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
        const userId = this.getNodeParameter('userId', index, '') as string;
        const options = this.getNodeParameter('options', index, {}) as IDataObject;

        if (!userId) {
            throw new Error('用户ID不能为空');
        }

        const requestOptions: IHttpRequestOptions = {
            method: 'POST',
            url: '/api/v3/update-user',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const requestBody: IDataObject = {
            userId: userId,
        };

        // 处理 options 中的参数
        if (options && Object.keys(options).length > 0) {
            const opts = options as any;

            // 处理基本字段
            const basicFields = [
                'name', 'nickname', 'photo', 'externalId', 'status', 'emailVerified', 'phoneVerified',
                'birthdate', 'country', 'province', 'city', 'address', 'streetAddress', 'postalCode',
                'gender', 'username', 'email', 'phone', 'phoneCountryCode', 'password', 'company',
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

            // 处理 metadata
            if (opts.metadata) {
                try {
                    const parsed = typeof opts.metadata === 'string'
                        ? JSON.parse(opts.metadata)
                        : opts.metadata;
                    if (parsed !== null && parsed !== undefined) {
                        requestBody.metadata = parsed;
                    }
                } catch (error) {
                    throw new Error(`Invalid JSON in metadata: ${error.message}`);
                }
            }

            // 处理 options 对象中的字段
            const optionsObj: IDataObject = {};

            // 处理 userIdType
            if (opts.userIdType) {
                optionsObj.userIdType = opts.userIdType;
            }

            // 处理密码相关选项
            if (opts.autoGeneratePassword !== undefined) {
                optionsObj.autoGeneratePassword = opts.autoGeneratePassword;
            }
            if (opts.resetPasswordOnFirstLogin !== undefined) {
                optionsObj.resetPasswordOnFirstLogin = opts.resetPasswordOnFirstLogin;
            }
            if (opts.resetPasswordOnNextLogin !== undefined) {
                optionsObj.resetPasswordOnNextLogin = opts.resetPasswordOnNextLogin;
            }
            if (opts.passwordEncryptType) {
                optionsObj.passwordEncryptType = opts.passwordEncryptType;
            }

            // 处理 sendPasswordResetNotification 对象
            const notificationFields = [
                'sendDefaultEmailNotification',
                'sendDefaultPhoneNotification',
                'inputSendEmailNotification',
                'inputSendPhoneNotification',
                'appId',
            ];
            const hasNotificationFields = notificationFields.some(
                (field) => opts[field] !== undefined && opts[field] !== null && opts[field] !== '',
            );

            if (hasNotificationFields) {
                const notificationObj: IDataObject = {};
                notificationFields.forEach((field) => {
                    if (opts[field] !== undefined && opts[field] !== null && opts[field] !== '') {
                        notificationObj[field] = opts[field];
                    }
                });
                if (Object.keys(notificationObj).length > 0) {
                    optionsObj.sendPasswordResetNotification = notificationObj;
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

export default UpdateUserOperate;

