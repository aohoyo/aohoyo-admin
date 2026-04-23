# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2026-04-24

### Perf
- **Dashboard chunk: 1.1MB → 4.26KB**（-99.6%）— 通过 `manualChunks` 将 echarts/element-plus/iconify 拆为独立 vendor chunk，dashboard 只保留业务代码
- **Dashboard gzip: 368KB → 1.97KB**

## [1.4.0] - 2026-04-24

### Added
- `src/types/index.ts` — 全局类型声明（ApiResponse、UserInfo、PageResult、RouteMeta 等）
- `vitest.config.ts` — Vitest 配置
- `.github/workflows/ci.yml` — GitHub Actions CI（lint → type-check → test → build）
- `rollup-plugin-visualizer` — 体积分析报告（dist/report.html）
- `tests/stores_app.spec.ts`、`tests/stores_user.spec.ts`、`tests/stores_tabs.spec.ts`、`tests/permission.spec.ts` — 单元测试（17 个测试用例）
- `commitlint.config.js` — Conventional Commits 配置
- `.husky/commit-msg` — Husky commit-msg hook
- `src/components.d.ts`、`src/auto-imports.d.ts` — unplugin-vue-components 自动生成类型声明
- `public/logo.webp`（16KB）、`public/logo-256.webp`（16KB）— WebP 格式 logo

### Changed
- `vite.config.ts` — Element Plus 按需引入（`ElementPlusResolver`）+ AutoImport 去掉 ElementPlus
- `vite.config.ts` — `manualChunks` 将 echarts/element-plus/iconify 拆分为独立 vendor chunk
- `src/main.ts` — 移除全量 `app.use(ElementPlus)`，保留 `import 'element-plus/dist/index.css'`
- `src/stores/app.ts` — `isDevice` → `device`，`isLoading` → `loading`，移除 `toggleDevice()`
- `src/layouts/default/Tabs.vue` — 修复初始化时序（`onMounted` + `immediately` 标志替代 `{ immediate: true }`），添加 `$tab` 方法
- `src/views/dashboard/index.vue` — ECharts 按需引入（LineChart + PieChart）
- `.eslintrc.js` — `varsIgnorePattern: '^_'` 替代 tsconfig `noUnusedLocals`
- `tsconfig.json` / `tsconfig.app.json` — `noUnusedLocals: false`，`noUnusedParameters: false`
- `package.json` — build 脚本去掉 vue-tsc（类型检查与 auto-import 冲突），新增 `type-check`、`test`、`serve` 脚本

### Removed
- `DEV_PLAN.md` — 已废弃
- `vite-plugin-compression` — 未安装且配置引用
