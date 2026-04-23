# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2026-04-24

### Added
- `src/types/index.ts` — 全局类型声明（ApiResponse、UserInfo、PageResult、RouteMeta 等）
- `vitest.config.ts` + Vitest 测试框架（@vue/test-utils + happy-dom）
- `.commitlintrc.js` — Conventional Commits 配置，type-enum 支持 feat/fix/docs 等
- `.husky/commit-msg` — Husky commit-msg hook
- `public/logo.webp` (256px, 16KB) + `public/logo-128.webp` (128px, 6KB) — Logo WebP 版本

### Changed
- `vite.config.ts` — 添加 unplugin-vue-components + unplugin-auto-import，Element Plus 按需引入；移除不兼容的 manualChunks 配置
- `src/main.ts` — 移除全量 Element Plus 引入，保留 CSS 导入
- `src/views/dashboard/index.vue` — ECharts 改为 tree-shaking 按需引入（LineChart + GridComponent + TooltipComponent），bundle 1.1MB → 515KB
- `src/views/login/index.vue` — logo.png → logo.webp
- `src/config/settings.ts` — 默认 logo 改为 /logo.webp
- `package.json` — build 脚本移除 vue-tsc（与 auto-import 类型冲突），新增 `npm run type-check`；新增 commitlint、vitest 依赖
- `eslint.config.js` — `@typescript-eslint/no-unused-vars` 添加 `varsIgnorePattern: '^_'` 替代 tsconfig noUnusedLocals
- `tsconfig.json` / `tsconfig.app.json` — `noUnusedLocals: false`，`noUnusedParameters: false`
- `src/layouts/default/Tabs.vue` — 修复初始化时序：watch immediate 在 Pinia persisted state 恢复前触发的竞态问题

### Removed
- `DEV_PLAN.md` — 已完成，开发计划文档移除

### Performance
- Element Plus 主 bundle：300KB+ → 193KB
- Dashboard ECharts：1.1MB → 515KB（gzip: 368KB → 173KB）
- Logo 资源：407KB PNG → 16KB + 6KB WebP

---

## [1.3.0] - 2026-04-14

> 初始版本发布
