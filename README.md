# Product Info

Next.js 静态站点示例（App Router）。

## 已完成配置

- 使用 App Router 文件路由
- 首页路由：`/`（`app/page.tsx`）
- About 路由：`/about`（`app/about/page.tsx`）
- 静态导出：`next.config.ts` 中启用 `output: "export"`

## 本地开发

```bash
npm run dev
```

## 构建静态产物

```bash
npm run build
```

构建后会生成 `out/` 目录。

## 预览静态产物

```bash
npm run start
```

默认使用 `serve` 在 `http://localhost:3000` 预览 `out/`。
