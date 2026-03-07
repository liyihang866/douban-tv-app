# 豆瓣2025年高分电视剧展示

这是一个展示豆瓣2025年评分7分以上电视剧的Web应用。

## 功能特点

- 展示20部高分电视剧
- 显示评分、国家、类型、导演、主演等信息
- 响应式设计，支持移动端
- 快速加载，静态导出

## 本地运行

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署到Vercel

### 方式一：通过GitHub（推荐）

1. 在GitHub上创建新仓库
2. 推送代码到GitHub
3. 访问 [vercel.com](https://vercel.com)
4. 点击"New Project"
5. 导入你的GitHub仓库
6. 点击"Deploy"
7. 完成！你会获得一个免费的 `xxx.vercel.app` 域名

### 方式二：直接部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录并部署
vercel

# 生产部署
vercel --prod
```

## 技术栈

- **框架**: Next.js 14
- **部署**: Vercel
- **数据**: 豆瓣电影

## 数据说明

- 数据抓取时间: 2026-03-07
- 评分筛选: 7分以上
- 数据来源: 豆瓣电影

## License

MIT