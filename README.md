# 豆瓣电视剧展示应用

基于 Next.js 和 Supabase 的豆瓣高分电视剧展示应用。

## 功能特点

- ✅ 展示豆瓣高分电视剧（评分7分以上）
- ✅ 搜索功能（标题、导演、主演）
- ✅ 过滤功能（国家、类型）
- ✅ 排序功能（评分、年份、标题）
- ✅ 响应式设计
- ✅ Supabase 数据库存储

## 技术栈

- **前端**: Next.js 14 + React
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel

## 环境变量

需要设置以下环境变量：

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key
\`\`\`

## 本地运行

\`\`\`bash
npm install
npm run dev
\`\`\`

访问 http://localhost:3000

## 部署

自动部署到 Vercel，推送到 GitHub 后自动触发部署。

## License

MIT