# Aohoyo Admin

<p align="center">
  <b>一个简洁、优雅的 Vue3 后台管理模板</b>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#项目结构">项目结构</a> •
  <a href="#许可证">许可证</a>
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
- ✅ 移动端适配全局样式
- ✅ 弹窗/表格/搜索区域移动端优化
- ✅ 分页组件移动端简化布局

### 🔧 工具库
- ✅ Axios 请求封装（拦截器、错误处理）
- ✅ API 模块化管理
- ✅ Mock 数据支持
- ✅ useTable Hook
- ✅ useForm Hook
- ✅ useLoading Hook
- ✅ useResponsive Hook
- ✅ 日期处理（dayjs）
- ✅ 本地存储封装
- ✅ 权限工具函数

---

## 快速开始

### 环境要求
- Node.js >= 20.0.0
- npm >= 10.0.0

### 安装依赖

```bash
cd aohoyo-admin
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:33520

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

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 | ^3.5 |
| 构建 | Vite | ^8.0 |
| 语言 | TypeScript | ~5.9 |
| UI 库 | Element Plus | ^2.13 |
| 状态 | Pinia | ^3.0 |
| 路由 | Vue Router | ^4.6 |
| 请求 | Axios | ^1.13 |
| 图表 | ECharts | ^6.0 |
| 日期 | Day.js | ^1.11 |
| Mock | vite-plugin-mock | ^3.0 |

---

## 项目结构

```
aohoyo-admin/
├── public/                 # 静态资源
│   └── logo.svg           # Logo
├── src/
│   ├── api/               # API 接口
│   │   ├── modules/       # 模块化 API
│   │   └── request.ts     # Axios 封装
│   ├── components/        # 公共组件
│   ├── composables/       # 组合式函数
│   ├── config/            # 配置文件
│   │   └── settings.ts    # 全局配置
│   ├── directives/        # 自定义指令
│   ├── layouts/           # 布局组件
│   │   └── default/       # 默认布局
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态
│   ├── styles/            # 全局样式
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── mock/                  # Mock 数据
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── package.json           # 依赖配置
├── tsconfig.json          # TS 配置
└── vite.config.ts         # Vite 配置
```

---

## 主题配置

```typescript
// src/config/settings.ts
{
  // 主题配置
  theme: {
    mode: 'light',              // light / dark / auto
    primaryColor: '#F37021',    // 爱马仕橙
    sidebarTheme: 'light',      // light / dark
    headerTheme: 'light',       // light / dark
    borderRadius: 4,
    fontSize: 14,
    animation: true
  }
}
```

---

## 主题预设

| 名称 | 色值 |
|------|------|
| 🧡 爱马仕橙 | #F37021 |
| 💙 科技蓝 | #1677ff |
| 💚 翡翠绿 | #00a870 |
| 💗 玫瑰金 | #c41d7f |
| 💜 星空紫 | #722ed1 |

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

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 许可证

[MIT](LICENSE) © 2026 Aohoyo

---

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 📧 Email: admin@aohoyo.com
- 💬 GitHub Issues: [提交问题](https://github.com/aohoyo/aohoyo-admin/issues)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/aohoyo">Aohoyo</a>
</p>