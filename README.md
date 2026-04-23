# aohoyo-admin

Vue 3 管理后台模板，基于 Vite + Pinia + Element Plus。

## 技术栈

- Vue 3 + Composition API + TypeScript
- Vite 6 (ESM)
- Pinia (状态管理)
- Element Plus (UI组件)
- Vue Router 4
- Axios (HTTP客户端)
- Vitest (单元测试)
- ESLint + commitlint

## 快速开始

```bash
npm install
npm run dev
npm run build
```

## 开发命令

| 命令                    | 说明                |
| ----------------------- | ------------------- |
| `npm run dev`           | 启动开发服务器      |
| `npm run build`         | 生产构建            |
| `npm run preview`       | 预览构建结果        |
| `npm run type-check`    | TypeScript 类型检查 |
| `npm run lint`          | ESLint 检查         |
| `npm run lint:fix`      | ESLint 自动修复     |
| `npm run test`          | 运行单元测试        |
| `npm run test:coverage` | 测试覆盖率报告      |

## 项目结构

```
src/
  api/           # Axios 封装 + API 模块
  assets/        # 静态资源
  components/    # 业务组件
  composables/   # 组合式函数
  layouts/       # 布局组件
  router/        # 路由配置
  stores/         # Pinia 状态库
  styles/        # 全局样式
  types/         # TypeScript 类型定义
  utils/         # 工具函数
  views/         # 页面视图
  App.vue
  main.ts
```

## GitHub Actions CI

push 到 main 或提 PR 时自动运行：

```
lint → type-check → test → build
```

任何一步失败都会阻止合并。

## License

MIT
