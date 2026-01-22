# taihe_web

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Google OAuth 登录功能

项目已集成Google OAuth登录功能。详细设置指南请参考 [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)。

### 主要功能

1. **Google登录按钮** - 在登录页面添加Google登录选项
2. **双模式支持** - 支持后端验证和前端临时会话两种模式
3. **现有系统集成** - 与项目的Pinia认证系统无缝集成

### 快速开始

1. 按照 [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) 配置Google OAuth客户端ID
2. 启动开发服务器：`npm run dev`
3. 访问登录页面：`/users/login`
4. 点击Google按钮测试登录功能

## 用户信息获取优化

项目已实现统一的用户信息管理方案，特别优化了Google登录用户的体验。详细设计请参考 [USER_INFO_OPTIMIZATION.md](USER_INFO_OPTIMIZATION.md)。

### 主要特性

1. **即时信息显示** - 登录后立即显示用户基本信息
2. **智能数据合并** - 自动结合本地存储和后端API数据
3. **Google用户优化** - 特殊处理Google登录用户的临时会话
4. **统一错误处理** - 优雅降级，确保基本功能可用

### 使用方法

```javascript
// 在任何Vue组件中
import { useUserInfo } from '@/composables/useUserInfo'

const {
  isLoggedIn,
  isGoogleUser,
  displayName,
  fullUserInfo,
  loadFullUserInfo
} = useUserInfo()

// 获取即时可用的用户信息
const user = fullUserInfo.value // { id, email, name, avatar, loginType, ... }
```
