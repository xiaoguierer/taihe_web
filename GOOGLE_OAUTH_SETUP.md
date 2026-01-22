# Google OAuth 登录功能设置指南

本文档介绍如何在taihe_web项目中设置和使用Google OAuth登录功能。

## 功能概述

已实现的Google OAuth功能包括：
1. 在登录页面添加Google登录按钮
2. 使用Google Identity Services进行认证
3. 支持前端临时会话和后端验证两种模式
4. 与现有认证系统集成

## 设置步骤

### 1. 创建Google Cloud项目并启用OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 "Google Identity Services" API
4. 配置OAuth同意屏幕：
   - 选择用户类型（通常选择"外部"）
   - 填写应用名称、用户支持邮箱等基本信息
   - 添加`/auth/userinfo.email`和`/auth/userinfo.profile`范围
   - 添加测试用户（如果需要）

### 2. 创建OAuth 2.0客户端ID

1. 在API和服务 → 凭据页面
2. 点击"创建凭据" → "OAuth 2.0客户端ID"
3. 应用类型选择"Web应用"
4. 配置授权重定向URI：
   - 开发环境：`http://localhost:3000`
   - 生产环境：根据实际域名配置
5. 创建后，复制"客户端ID"

### 3. 配置环境变量

将复制的客户端ID添加到环境变量中：

#### 开发环境 (.env.development)
```env
VITE_APP_GOOGLE_OAUTH_CLIENT_ID=你的客户端ID.apps.googleusercontent.com
```

#### 生产环境 (.env.production)
```env
VITE_APP_GOOGLE_OAUTH_CLIENT_ID=你的生产环境客户端ID.apps.googleusercontent.com
```

**注意**：环境文件中已包含占位符配置：
- 开发环境 (.env.development)：包含测试用的客户端ID，建议替换为自己的开发环境客户端ID
- 生产环境 (.env.production)：已添加占位符，必须替换为真实的生产环境客户端ID

### 4. 后端API集成（可选但推荐）

为实现完整的Google登录功能，建议后端实现以下端点：

```javascript
// POST /api/auth/google
// 请求体：{ idToken: "Google ID令牌" }
// 响应：{ token: "JWT令牌", user: {用户信息} }
```

后端需要：
1. 使用Google的库验证ID令牌
2. 检查用户是否已存在（根据邮箱）
3. 创建新用户或返回现有用户
4. 生成JWT令牌返回给前端

如果后端未实现此端点，前端将使用临时会话模式。

## 使用说明

### 前端临时会话模式

当后端API端点不可用时，系统会自动切换到前端临时会话模式：
- 使用Google ID令牌解析用户信息
- 生成临时token存储在前端
- 用户信息保存在localStorage
- 可用于基本的登录状态管理

### 后端验证模式（推荐）

配置后端API后，系统将：
1. 发送Google ID令牌到后端验证
2. 后端返回统一的JWT令牌
3. 使用现有认证系统存储token和用户信息
4. 实现完整的会话管理

## 文件结构

```
src/
├── utils/
│   ├── googleAuth.js      # Google OAuth工具函数
│   └── index.js           # 重新导出工具函数
├── views/user/
│   └── UserLogin.vue      # 更新后的登录页面
└── styles/user/
    ├── userlogin.css      # 原有登录样式
    └── google-auth.css    # Google按钮样式
```

## 测试指南

### 本地测试
1. 使用测试用的客户端ID启动开发服务器
2. 访问登录页面 (`/users/login`)
3. 点击Google登录按钮
4. 使用测试Google账号登录

### 生产测试
1. 配置真实的生产环境客户端ID
2. 确保重定向URI正确配置
3. 测试完整的登录流程

## 故障排除

### 常见问题

1. **Google按钮不显示**
   - 检查Google Identity Services脚本是否加载成功
   - 检查客户端ID是否已正确配置
   - 查看浏览器控制台错误信息

2. **登录后无法跳转**
   - 检查后端API端点是否可用
   - 检查网络请求是否被拦截
   - 查看浏览器控制台网络请求

3. **权限错误**
   - 确保OAuth同意屏幕已配置正确范围
   - 检查测试用户是否已添加（如使用外部用户类型）

### 调试技巧

1. 打开浏览器开发者工具
2. 查看Console标签页中的日志
3. 查看Network标签页中的网络请求
4. 检查Application标签页中的localStorage

## 安全注意事项

1. **客户端ID安全**
   - 不要在公开仓库中暴露真实的客户端ID
   - 为开发和生产环境使用不同的客户端ID
   - 定期轮换客户端ID

2. **令牌验证**
   - 后端必须验证Google ID令牌
   - 检查令牌的颁发者、受众和过期时间
   - 使用Google官方库进行验证

3. **用户数据**
   - 仅请求必要的用户信息范围
   - 妥善存储用户数据
   - 遵守隐私政策

## 后续扩展

1. **多语言支持**
   - 根据用户区域设置调整Google按钮语言

2. **其他社交登录**
   - 可类似地添加Facebook、GitHub等登录方式

3. **登录统计**
   - 记录用户使用的登录方式
   - 分析用户行为

## 联系支持

如有问题，请参考：
- [Google Identity Services文档](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0指南](https://developers.google.com/identity/protocols/oauth2)