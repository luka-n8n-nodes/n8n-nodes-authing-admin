export declare const enum ResourceType {
    User = 'user',
    // 可以根据 Authing Admin API 的其他资源类型继续添加
}

export declare const enum OperationType {
    // 用户相关操作
    ListUsers = 'listUsers',
    GetUser = 'getUser',
    GetUserBatch = 'getUserBatch',
    UpdateUser = 'updateUser',
    CreateUser = 'createUser',
    // 可以根据 Authing Admin API 的其他操作类型继续添加
}

export declare const enum OutputType {
    Single = 'single',
    Multiple = 'multiple',
    None = 'none',
}

export declare const enum Credentials {
    AuthingAdminApi = 'authingAdminApi',
    Id = 'authing-admin-api',
    Type = 'authing-admin-api',
}

export declare const enum BaseUrl {
    Default = 'https://console.authing.cn',
}

