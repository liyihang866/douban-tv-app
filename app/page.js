'use client'

import { useState, useMemo, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [tvShows, setTvShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // 状态管理
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('全部')
  const [selectedGenre, setSelectedGenre] = useState('全部')
  const [sortBy, setSortBy] = useState('rating')
  const [sortOrder, setSortOrder] = useState('desc')
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  
  // 从 Supabase 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        console.log('正在从 Supabase 加载数据...')
        
        const { data, error } = await supabase
          .from('tv_shows')
          .select('*')
          .gte('rating', 7.0)
          .order('rating', { ascending: false })
        
        if (error) throw error
        
        console.log(`成功加载 ${data?.length || 0} 部电视剧`)
        setTvShows(data || [])
      } catch (err) {
        console.error('加载失败:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  // 获取所有国家（去重）
  const countries = useMemo(() => {
    const all = [...new Set(tvShows.map(show => show.country).filter(Boolean))]
    return ['全部', ...all.sort()]
  }, [tvShows])
  
  // 获取所有类型（去重）
  const genres = useMemo(() => {
    const all = new Set()
    tvShows.forEach(show => {
      if (show.genres && Array.isArray(show.genres)) {
        show.genres.forEach(genre => all.add(genre))
      }
    })
    return ['全部', ...Array.from(all).sort()]
  }, [tvShows])
  
  // 过滤和排序逻辑
  const filteredShows = useMemo(() => {
    let result = tvShows.filter(show => {
      // 搜索过滤
      const matchesSearch = show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (show.actors && show.actors.some(actor => actor.toLowerCase().includes(searchTerm.toLowerCase()))) ||
                           (show.director && show.director.toLowerCase().includes(searchTerm.toLowerCase()))
      
      // 国家过滤
      const matchesCountry = selectedCountry === '全部' || show.country === selectedCountry
      
      // 类型过滤
      const matchesGenre = selectedGenre === '全部' || (show.genres && show.genres.includes(selectedGenre))
      
      return matchesSearch && matchesCountry && matchesGenre
    })
    
    // 排序
    result.sort((a, b) => {
      let comparison = 0
      
      switch(sortBy) {
        case 'rating':
          comparison = (b.rating || 0) - (a.rating || 0)
          break
        case 'rating_count':
          comparison = (b.rating_count || 0) - (a.rating_count || 0)
          break
        case 'year':
          comparison = (b.year || 0) - (a.year || 0)
          break
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '', 'zh-CN')
          break
        default:
          comparison = 0
      }
      
      return sortOrder === 'desc' ? comparison : -comparison
    })
    
    return result
  }, [tvShows, searchTerm, selectedCountry, selectedGenre, sortBy, sortOrder])
  
  // 分页逻辑
  const totalPages = Math.ceil(filteredShows.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentShows = filteredShows.slice(startIndex, endIndex)
  
  // 重置页码当过滤条件改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCountry, selectedGenre, sortBy, sortOrder])
  
  // 切换排序
  const toggleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(type)
      setSortOrder('desc')
    }
  }
  
  // 加载状态
  if (loading) {
    return (
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h1>🎬 豆瓣高分电视剧</h1>
        <p style={{ marginTop: '50px', fontSize: '18px' }}>正在从数据库加载数据...</p>
      </main>
    )
  }
  
  // 错误状态
  if (error) {
    return (
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h1>🎬 豆瓣高分电视剧</h1>
        <p style={{ marginTop: '50px', fontSize: '18px', color: '#f44336' }}>
          加载失败: {error}
        </p>
        <p style={{ marginTop: '20px', color: '#666' }}>
          请检查 Supabase 连接配置
        </p>
      </main>
    )
  }
  
  return (
    <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '32px' }}>
        🎬 豆瓣高分电视剧
      </h1>
      
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '14px' }}>
        共 {tvShows.length} 部电视剧 | 评分筛选: ≥7.0 | 数据来源: Supabase 数据库
      </p>
      
      {/* 搜索和过滤区域 */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* 搜索框 */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="搜索电视剧标题、导演、主演..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px',
              fontSize: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
          />
        </div>
        
        {/* 过滤器行 */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* 国家过滤 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>国家:</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          
          {/* 类型过滤 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>类型:</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          {/* 排序按钮 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>排序:</label>
            <button
              onClick={() => toggleSort('rating')}
              style={{
                padding: '8px 14px',
                fontSize: '14px',
                border: sortBy === 'rating' ? '2px solid #1976d2' : '1px solid #d0d0d0',
                borderRadius: '4px',
                backgroundColor: sortBy === 'rating' ? '#e3f2fd' : '#fff',
                cursor: 'pointer',
                fontWeight: sortBy === 'rating' ? '600' : '400'
              }}
            >
              评分 {sortBy === 'rating' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => toggleSort('rating_count')}
              style={{
                padding: '8px 14px',
                fontSize: '14px',
                border: sortBy === 'rating_count' ? '2px solid #1976d2' : '1px solid #d0d0d0',
                borderRadius: '4px',
                backgroundColor: sortBy === 'rating_count' ? '#e3f2fd' : '#fff',
                cursor: 'pointer',
                fontWeight: sortBy === 'rating_count' ? '600' : '400'
              }}
            >
              评论数 {sortBy === 'rating_count' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => toggleSort('year')}
              style={{
                padding: '8px 14px',
                fontSize: '14px',
                border: sortBy === 'year' ? '2px solid #1976d2' : '1px solid #d0d0d0',
                borderRadius: '4px',
                backgroundColor: sortBy === 'year' ? '#e3f2fd' : '#fff',
                cursor: 'pointer',
                fontWeight: sortBy === 'year' ? '600' : '400'
              }}
            >
              年份 {sortBy === 'year' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => toggleSort('title')}
              style={{
                padding: '8px 14px',
                fontSize: '14px',
                border: sortBy === 'title' ? '2px solid #1976d2' : '1px solid #d0d0d0',
                borderRadius: '4px',
                backgroundColor: sortBy === 'title' ? '#e3f2fd' : '#fff',
                cursor: 'pointer',
                fontWeight: sortBy === 'title' ? '600' : '400'
              }}
            >
              标题 {sortBy === 'title' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
          
          {/* 清空过滤 */}
          {(searchTerm || selectedCountry !== '全部' || selectedGenre !== '全部') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCountry('全部')
                setSelectedGenre('全部')
              }}
              style={{
                padding: '8px 14px',
                fontSize: '14px',
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer'
              }}
            >
              清空过滤
            </button>
          )}
        </div>
        
        {/* 结果统计 */}
        <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
          找到 <strong style={{ color: '#1976d2' }}>{filteredShows.length}</strong> 部电视剧
          {filteredShows.length !== tvShows.length && ` (已过滤 ${tvShows.length - filteredShows.length} 部)`}
        </div>
      </div>
      
      {/* 电视剧列表 */}
      {filteredShows.length > 0 ? (
        <>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {currentShows.map((show, index) => (
            <div key={show.id || index} style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              display: 'flex',
              gap: '15px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
            }}
            >
              {/* 左侧内容 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600' }}>
                  {show.title}
                </h3>
              
              <div style={{ marginBottom: '10px' }}>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: show.rating >= 9 ? '#f44336' : 
                                 show.rating >= 8 ? '#ff9800' : '#ffc107',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  ⭐ {show.rating || '暂无'}
                </span>
                {show.rating_count && (
                  <span style={{ marginLeft: '10px', fontSize: '13px', color: '#999' }}>
                    {show.rating_count.toLocaleString()} 人评价
                  </span>
                )}
              </div>
              
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                📍 {show.country || '未知'} | {show.year || '未知'}
              </div>
              
              {show.genres && show.genres.length > 0 && (
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
                  🎭 {show.genres.join(' / ')}
                </div>
              )}
              
              {show.director && (
                <div style={{ fontSize: '13px', color: '#999', marginBottom: '5px' }}>
                  导演: {show.director}
                </div>
              )}
              
              {show.actors && show.actors.length > 0 && (
                <div style={{ fontSize: '13px', color: '#999' }}>
                  主演: {show.actors.join(' / ')}
                </div>
              )}
              
              {show.url && (
                <a href={show.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   style={{
                     display: 'inline-block',
                     marginTop: '10px',
                     color: '#1976d2',
                     textDecoration: 'none',
                     fontSize: '14px',
                     fontWeight: '500'
                   }}
                   onClick={(e) => e.stopPropagation()}
                >
                  查看详情 →
                </a>
              )}
              </div>
              
              {/* 右侧封面图 */}
              <div style={{ 
                flexShrink: 0,
                width: '120px',
                height: '160px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '10px'
              }}>
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎬</div>
                  <div>{show.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 分页组件 */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30px',
            gap: '10px'
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff',
                color: currentPage === 1 ? '#999' : '#333',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              上一页
            </button>
            
            <div style={{ display: 'flex', gap: '5px' }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      width: '40px',
                      height: '40px',
                      fontSize: '14px',
                      border: currentPage === pageNum ? '2px solid #1976d2' : '1px solid #d0d0d0',
                      borderRadius: '4px',
                      backgroundColor: currentPage === pageNum ? '#e3f2fd' : '#fff',
                      color: currentPage === pageNum ? '#1976d2' : '#333',
                      cursor: 'pointer',
                      fontWeight: currentPage === pageNum ? '600' : '400'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff',
                color: currentPage === totalPages ? '#999' : '#333',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              下一页
            </button>
            
            <span style={{ marginLeft: '10px', color: '#666', fontSize: '14px' }}>
              第 {currentPage} / {totalPages} 页
            </span>
          </div>
        )}
        </>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999',
          fontSize: '16px'
        }}>
          <p style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</p>
          <p>没有找到符合条件的电视剧</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCountry('全部')
              setSelectedGenre('全部')
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '14px',
              border: '1px solid #d0d0d0',
              borderRadius: '4px',
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
            清空过滤条件
          </button>
        </div>
      )}
      
      <footer style={{ 
        textAlign: 'center', 
        marginTop: '50px', 
        padding: '20px',
        color: '#999',
        borderTop: '1px solid #e0e0e0'
      }}>
        <p>数据来源: 豆瓣电影 | Supabase 数据库</p>
        <p>评分筛选: ≥7.0</p>
      </footer>
    </main>
  )
}