import data from '../data.json'

export default function Home() {
  const tvShows = data.data
  
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🎬 豆瓣2025年高分电视剧 (评分7分以上)
      </h1>
      
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        共 {tvShows.length} 部电视剧 | 数据抓取时间: {data.fetch_date}
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {tvShows.map((show, index) => (
          <div key={index} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
              {show.title}
            </h3>
            
            <div style={{ marginBottom: '10px' }}>
              <span style={{
                display: 'inline-block',
                backgroundColor: '#ff9800',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                ⭐ {show.rating}
              </span>
            </div>
            
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              📍 {show.country} | {show.year}
            </div>
            
            <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
              🎭 {show.genres.join(' / ')}
            </div>
            
            <div style={{ fontSize: '13px', color: '#999', marginBottom: '5px' }}>
              导演: {show.director}
            </div>
            
            {show.actors.length > 0 && (
              <div style={{ fontSize: '13px', color: '#999' }}>
                主演: {show.actors.join(' / ')}
              </div>
            )}
            
            <a href={show.url} 
               target="_blank" 
               rel="noopener noreferrer"
               style={{
                 display: 'inline-block',
                 marginTop: '10px',
                 color: '#1976d2',
                 textDecoration: 'none',
                 fontSize: '14px'
               }}>
              查看详情 →
            </a>
          </div>
        ))}
      </div>
      
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '50px', 
        padding: '20px',
        color: '#999',
        borderTop: '1px solid #e0e0e0'
      }}>
        <p>数据来源: 豆瓣电影</p>
        <p>抓取时间: {data.fetch_date} | 评分筛选: ≥7.0</p>
      </footer>
    </main>
  )
}