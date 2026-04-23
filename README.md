# Aohoyo Admin

<p align="center">
  <b>一个简洁、优雅的 Vue3 后台管理模板</b>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#二次开发">二次开发</a> •
  <a href="#目录结构">目录结构</a> •
  <a href="#主题配置">主题配置</a> •
  <a href="#环境变量">环境变量</a>
</p>

---

## 功能特性

### 🎨 主题系统
- ✅ 暗黑模式切换
- ✅ 主题色自定义（5 种预设 + 自定义颜色选择器）
- ✅ 侧边栏/头部独立主题设置
- ✅ 圆角大小调节
- ✅ 灰色模式 / 色弱模式

### 🔐 权限管理
- ✅ 用户管理（增删改查、状态切换）
- ✅ 角色管理（权限分配）
- ✅ 菜单管理（树形结构、图标选择器）
- ✅ 权限指令 `v-permission`
- ✅ 角色指令 `v-role`

### 📄 页面组件
- ✅ 登录页面
- ✅ Dashboard 仪表盘
- ✅ 个人中心（修改密码、个人信息）
- ✅ 表格示例
- ✅ 表单示例
- ✅ 404 页面

### 🧩 公共组件
- ✅ Layout 布局
- ✅ Sidebar 侧边栏（可折叠）
- ✅ Header 头部
- ✅ Tabs 标签栏（右键菜单、缓存）
- ✅ ThemeSetting 主题设置面板
- ✅ GlobalLoading 全局加载
- ✅ ResponsiveDialog 响应式弹窗
- ✅ ResponsiveSearch 响应式搜索
- ✅ ResponsiveTable 响应式表格
- ✅ LockScreen 锁屏组件

### 📱 移动端适配
- ✅ 响应式布局（自动检测设备类型）
- ✅ useResponsive 组合式函数
- ✅ 移动端侧边栏抽屉模式
- ✅ 弹窗/表格/搜索区域移动端优化

### 🔧 工具库
- ✅ Axios 请求封装（拦截器、错误处理）
- ✅ API 模块化管理
- ✅ Mock 数据支持
- ✅ useTable / useForm / useLoading / useResponsive Hook
- ✅ Day.js 日期处理
- ✅ 本地存储封装
- ✅ 权限工具函数

---

## 快速开始

### 环境要求
- Node.js >= 20.0.0
- npm >= 10.0.0

### 安装
```bash
git clone https://github.com/aohoyo/aohoyo-admin.git
cd aohoyo-admin
npm install
```

### 开发
```bash
npm run dev
# 访问 http://localhost:33520
```

### 生产构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

### 默认账号
| 账号 | 密码 |
|------|------|
| admin | admin123 |

---

## 二次开发

### 如何基于这个模板启动新项目

#### 第一步：改项目名称

修改 3 个地方：

**① 环境变量**（`.env.development` / `.env.production`）
```env
VITE_APP_TITLE=我的新后台
```

**② HTML 标题**（`index.html`）
```html
<title>我的新后台</title>
```

**③ 路由标题**（`src/config/settings.ts`，后续 P0-2 会改用环境变量）
```ts
export default {
  title: '我的新后台',   // 改这里
  ...
}
```

#### 第二步：替换 Logo

```
public/logo.png   →  替换成你的 SVG/PNG（保持文件名一致）
```

或在 `src/config/settings.ts` 中单独配置：
```ts
logo: '/my-logo.png',  // 自定义路径
```

#### 第三步：接入真实 API

**① 修改 API 基础地址**（`.env.development`）
```env
VITE_APP_BASE_API=https://your-api.com/api
```

**② 替换 Mock 数据**

Mock 数据在 `mock/` 目录下，接口对应关系：
```
src/api/modules/   →   mock/
```

删除或修改 `mock/` 中的 `.ts` 文件，编写你的真实接口（参考 `src/api/modules/user.ts`）。

**③ 移除 Mock 插件**（`vite.config.ts`）
```ts
// 注释掉或删除这一行：
import { viteMockServe } from 'vite-plugin-mock'
```

**④ 修改 Axios 封装**（`src/api/request.ts`）

根据真实后端调整：
- 认证方式（Token / JWT / Cookie）
- 响应数据格式（当前假设 `{ code, data, message }`）
- 错误码处理

#### 第四步：配置路由权限

路由定义在 `src/router/routes.ts`：

```ts
{
  path: '/admin',
  component: Layout,
  meta: {
    title: 'nav.admin',
    icon: 'Setting',
    permission: 'admin'      // 所需权限标识
  },
  children: [...]
}
```

在需要权限的页面组件上使用指令：
```vue
<el-button v-permission="'admin'">仅管理员可见</el-button>
<el-button v-role="['editor', 'admin']">编辑者和管理员可见</el-button>
```

#### 第五步：添加新页面

```
src/views/          →  页面组件
src/api/modules/   →  接口定义
src/stores/        →  状态管理（如需）
```

示例：`src/views/order/list/index.vue`

然后在 `src/router/routes.ts` 的对应 `children` 数组中添加路由记录。

---

## 目录结构

```
aohoyo-admin/
├── public/
│   └── logo.png              # 网站 Logo
├── mock/                      # Mock 数据（开发阶段模拟接口）
│   └── *.ts
├── src/
│   ├── api/                   # 接口层
│   │   ├── modules/           # 模块化接口（user.ts / menu.ts 等）
│   │   └── request.ts         # Axios 封装（拦截器、错误处理）
│   ├── components/            # 公共组件
│   │   ├── GlobalLoading/     # 全局加载
│   │   ├── LockScreen/        # 锁屏
│   │   ├── ResponsiveDialog/  # 响应式弹窗
│   │   ├── ResponsiveSearch/  # 响应式搜索
│   │   ├── ResponsiveTable/   # 响应式表格
│   │   ├── SvgIcon/           # SVG 图标
│   │   └── ThemeSetting/      # 主题设置面板
│   ├── composables/           # 组合式函数
│   │   ├── useForm.ts         # 表单逻辑封装
│   │   ├── useLoading.ts      # 加载状态封装
│   │   ├── useResponsive.ts   # 响应式断点检测
│   │   └── useTable.ts        # 表格逻辑封装
│   ├── config/
│   │   └── settings.ts        # 全局配置（标题/Logo/主题默认值）
│   ├── directives/
│   │   └── permission.ts      # v-permission / v-role 指令
│   ├── layouts/               # 布局组件
│   │   └── default/           # 默认后台布局
│   ├── locales/               # 国际化语言包
│   ├── router/
│   │   ├── index.ts           # 路由实例
│   │   ├── routes.ts          # 路由定义
│   │   └── guards.ts          # 路由守卫（登录/权限拦截）
│   ├── stores/                 # Pinia 状态管理
│   │   ├── app.ts             # 应用状态（侧边栏折叠等）
│   │   ├── tabs.ts            # 标签页状态
│   │   ├── theme.ts           # 主题状态
│   │   └── user.ts            # 用户状态（Token / 用户信息）
│   ├── styles/
│   │   └── index.css          # 全局样式
│   ├── utils/                 # 工具函数
│   │   ├── crypto.ts          # AES-GCM 加密（锁屏密码）
│   │   └── permission.ts      # 权限判断工具
│   ├── views/                 # 页面视图
│   │   ├── dashboard/          # 仪表盘
│   │   ├── error/             # 错误页（404）
│   │   ├── example/           # 示例（表格/表单）
│   │   ├── login/             # 登录
│   │   ├── profile/           # 个人中心
│   │   └── system/            # 系统管理（用户/角色/菜单）
│   ├── App.vue                # 根组件
│   └── main.ts                # 入口文件
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── index.html
├── package.json
├── vite.config.ts             # Vite 配置
└── tsconfig.json              # TypeScript 配置
```

---

## 主题配置

所有主题配置集中在 `src/config/settings.ts`。

### 主题色

```ts
theme: {
  mode: 'light',           // 'light' | 'dark'
  primaryColor: '#F37021', // 主色调（爱马仕橙）
  ...
  presets: [               // 预设主题色
    { name: '爱马仕橙', primary: '#F37021' },
    { name: '科技蓝', primary: '#1677ff' },
    { name: '翡翠绿', primary: '#00a870' },
    { name: '星空紫', primary: '#722ed1' }
  ]
}
```

### 布局配置

```ts
layout: {
  sidebarWidth: 220,           // 侧边栏宽度
  sidebarCollapsedWidth: 64,  // 折叠后宽度
  fixedHeader: true,          // 固定头部
  fixedSidebar: true,         // 固定侧边栏
  showBreadcrumb: true,       // 显示面包屑
  showFooter: false           // 显示底部
}
```

### 功能开关

```ts
features: {
  fullscreen: true,    // 全屏按钮
  lockScreen: true,    // 锁屏功能
  notification: true,  // 通知功能
  refresh: true,       // 刷新按钮
  language: true       // 语言切换
}
```

---

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_APP_TITLE` | 项目标题（显示在浏览器标签和登录页） | `Aohoyo Admin` |
| `VITE_APP_BASE_API` | API 基础地址 | `/api` |
| `VITE_APP_ENV` | 环境标识 | `development` / `production` |

### 开发环境变量文件：`.env.development`
### 生产环境变量文件：`.env.production`

---

## 浏览器支持

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 最新 2 版本 |
| Firefox | 最新 2 版本 |
| Safari | 最新 2 版本 |
| Edge | 最新 2 版本 |

---

## 更新日志

### v1.3.1 (2026-04-24)
- 📖 完善 README，补充二次开发指引
- 🔧 P0 开发阶段：模板变量化整理

### v1.3.0 (2026-04-11)
- 📱 移动端适配 - 响应式布局/通用组件/全局样式优化
- ✅ 新增 ResponsiveDialog / ResponsiveSearch / ResponsiveTable 组件
- ✅ 新增 useResponsive 组合式函数
- ✅ 布局组件移动端适配
- ✅ 全局响应式样式优化

### v1.0.0 (2026-03-27)
- 🎉 初始版本发布
- ✅ 完整的主题系统
- ✅ 用户/角色/菜单管理
- ✅ 标签页缓存与右键菜单
- ✅ 权限指令与路由守卫
- ✅ Mock 数据支持

---

## 许可证

[MIT](LICENSE) © 2026 Aohoyo
