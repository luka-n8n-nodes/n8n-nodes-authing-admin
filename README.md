# Authing Admin N8N 集成插件

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![N8N](https://img.shields.io/badge/platform-N8N-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.15-green.svg)

一个功能完整的 N8N 自定义节点，用于集成 Authing Admin API，支持用户管理、用户组管理、公共账号管理等核心功能。

## 🚀 特性

- ✅ **3个功能模块**，覆盖 Authing Admin 的主要API功能
- ✅ **18个操作**，支持完整的工作流自动化
- ✅ **安全认证**，自动管理API密钥和凭证刷新
- ✅ **统一参数**，采用一致性的参数设计
- ✅ **错误处理**，完善的异常处理和用户提示
- ✅ **TypeScript支持**，完整的类型定义和智能提示
- ✅ **自动发现**，基于文件系统的模块自动加载机制

## 📦 安装

### 方式一：NPM 安装 (推荐)

```bash
npm install @luka-cat-mimi/n8n-nodes-authing-admin
```

### 方式二：手动安装

1. 下载项目到本地
2. 编译项目

```bash
npm install
npm run build
```

3. 将编译后的文件复制到 N8N 的 `custom` 目录

## ⚙️ 配置

### 1. 创建凭据

在 N8N 中创建新的 "Authing Admin API" 凭据，填入以下信息：

| 字段 | 说明 | 示例 | 必填 |
|------|------|------|------|
| **Authing 基础地址** | Authing API 基础地址 | `https://console.authing.cn` | ✅ |
| **AccessKey ID** | 用户池 ID 或协作管理员的 AccessKey ID | `your-access-key-id` | ✅ |
| **AccessKey Secret** | 用户池密钥或协作管理员的 SK | `your-access-key-secret` | ✅ |

### 2. 获取凭据信息

#### Authing 基础地址

根据部署环境选择对应的地址：
- **公有云（默认）**：`https://console.authing.cn`
- **私有化部署**：根据实际部署地址填写

#### AccessKey ID 和 AccessKey Secret

根据使用场景选择：

**方式一：用户池全局 AK/SK**
1. 登录 Authing 控制台
2. 进入 **设置** > **基础设置** > **密钥管理**
3. 查看或创建用户池的 AccessKey ID 和 AccessKey Secret

**方式二：协作管理员的 AK/SK**
1. 登录 Authing 控制台
2. 进入 **协作管理** > **管理员**
3. 创建或查看协作管理员的 AccessKey ID 和 AccessKey Secret

> **注意**：AccessKey Secret 是敏感信息，请妥善保管，不要泄露给他人。

## 📊 功能模块

### 核心功能

| 模块 | 操作数 | 主要功能 |
|------|--------|----------|
| 👥 **Authing应用接口 - 用户管理** | 6 | 创建用户、获取用户、获取用户列表、更新用户、踢出用户、离职用户 |
| 🏢 **Authing应用接口 - 用户组管理** | 9 | 创建用户组、创建或更新用户组、更新用户组、获取用户组、获取用户组列表、批量删除用户组、添加组成员、移除组成员、获取组成员列表 |
| 🔐 **Authing应用接口 - 公共账号管理** | 3 | 获取公共账号列表、获取公共账号的用户列表、设置用户的公共账号 |

## 🛠️ 使用示例

### 基础用法

1. **添加 Authing 节点**到工作流
2. **选择资源类型**（如"Authing应用接口 - 用户管理"）
3. **选择具体操作**（如"创建用户"）
4. **配置参数**：
   - 根据操作类型填写相应的参数
   - 支持分页、筛选等高级选项

### 创建用户示例

在"创建用户"操作中，可以配置以下参数：

- **Name**: 用户真实姓名
- **Nickname**: 昵称
- **Photo**: 头像链接
- **External Id**: 第三方外部ID
- **Status**: 用户状态
- **Email**: 邮箱地址
- **Phone**: 手机号
- **Username**: 用户名
- **Password**: 密码
- 以及其他用户相关字段

### 获取用户列表示例

在"获取用户列表"操作中，可以配置：

- **Return All**: 是否返回所有结果（递归获取所有分页数据）
- **Limit**: 每页返回的记录数
- **Keywords**: 搜索关键词（支持搜索用户名、昵称、邮箱、手机号等）
- **Status**: 用户状态筛选
- **Department Ids**: 部门ID筛选
- **Group Ids**: 用户组ID筛选
- 以及其他筛选条件

### 用户组管理示例

在"创建用户组"操作中，可以配置：

- **Code**: 用户组唯一标识符
- **Name**: 用户组名称
- **Description**: 用户组描述
- **Type**: 用户组类型
- 以及其他用户组相关字段

## 🔧 开发

### 项目结构

```text
n8n-nodes-authing-admin/
├── credentials/                 # 凭据定义
│   ├── AuthingAdminApi.credentials.ts
│   └── icon.svg
├── nodes/                      # 节点定义
│   ├── help/                   # 工具类和类型定义
│   │   ├── builder/           # 资源构建器
│   │   ├── type/              # 类型定义
│   │   └── utils/             # 工具函数
│   └── AuthingAdmin/
│       ├── AuthingAdmin.node.ts
│       └── resource/           # 资源模块
│           ├── user/           # 用户管理
│           ├── group/          # 用户组管理
│           └── publicAccount/  # 公共账号管理
├── dist/                       # 编译输出
├── package.json
├── tsconfig.json
└── gulpfile.js
```

### 构建命令

```bash
# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 添加新功能

1. 在 `nodes/AuthingAdmin/resource/` 下创建新模块文件夹
2. 创建资源定义文件 `ModuleResource.ts`
3. 在模块文件夹下创建操作文件 `OperateFile.ts`
4. 使用统一的参数模式和错误处理

**示例：添加新资源**

```typescript
// NewResource.ts
import { ResourceOptions } from '../../help/type/IResource';

const NewResource: ResourceOptions = {
	name: '新资源',
	value: 'newResource',
};

export default NewResource;
```

**示例：添加新操作**

```typescript
// newResource/NewOperate.ts
import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const NewOperate: ResourceOperations = {
	name: '新操作',
	value: 'newOperation',
	action: '新操作',
	options: [
		{
			displayName: 'Parameter',
			name: 'parameter',
			type: 'string',
			required: true,
			default: '',
			description: '参数说明',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject | IDataObject[]> {
		const parameter = this.getNodeParameter('parameter', index) as string;

		const response = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/api/endpoint',
			body: {
				parameter,
			},
		});

		return response as IDataObject;
	},
};

export default NewOperate;
```

**就这样！** 无需修改其他任何代码，新功能会被自动发现和加载。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 许可证

本项目采用 MIT 许可证。详情请参见 [LICENSE.md](./LICENSE.md) 文件。

## 🆘 支持

- 📧 邮箱：**luka.cat.mimi@gmail.com**
- 🐛 问题反馈：[GitHub Issues](https://github.com/luka-n8n-nodes/n8n-nodes-authing-admin/issues)
- 📖 Authing Admin API文档：[官方文档](https://api-explorer.authing.cn/)

## ⭐ 致谢

感谢 [N8N](https://n8n.io/) 提供的强大自动化平台

---

如果这个项目对你有帮助，请给它一个 ⭐️！
