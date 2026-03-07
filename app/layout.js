export const metadata = {
  title: '豆瓣2025年高分电视剧',
  description: '豆瓣2025年评分7分以上的电视剧推荐',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: 0,
        backgroundColor: '#f5f5f5'
      }}>
        {children}
      </body>
    </html>
  )
}