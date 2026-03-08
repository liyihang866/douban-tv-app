-- 豆瓣电视剧数据表
CREATE TABLE IF NOT EXISTS tv_shows (
  id SERIAL PRIMARY KEY,
  douban_id VARCHAR(50) UNIQUE,  -- 豆瓣ID
  title VARCHAR(500) NOT NULL,   -- 标题
  year INTEGER,                   -- 年份
  cover_image TEXT,               -- 封面图URL
  rating DECIMAL(3,1),            -- 评分
  rating_count INTEGER,           -- 评论数
  country VARCHAR(100),           -- 国家
  genres TEXT[],                  -- 类型数组
  director TEXT,                  -- 导演
  actors TEXT[],                  -- 主演数组
  url TEXT UNIQUE,                -- 详情页URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tv_shows_rating ON tv_shows(rating DESC);
CREATE INDEX IF NOT EXISTS idx_tv_shows_year ON tv_shows(year DESC);
CREATE INDEX IF NOT EXISTS idx_tv_shows_country ON tv_shows(country);
CREATE INDEX IF NOT EXISTS idx_tv_shows_rating_count ON tv_shows(rating_count DESC);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tv_shows_updated_at 
    BEFORE UPDATE ON tv_shows 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 查询视图：高分电视剧
CREATE OR REPLACE VIEW high_rated_tv_shows AS
SELECT * FROM tv_shows 
WHERE rating >= 7.0 
ORDER BY rating DESC, rating_count DESC;