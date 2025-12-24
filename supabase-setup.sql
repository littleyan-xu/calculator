-- ==========================================
-- 五险一金计算器 - Supabase 数据库设置
-- ==========================================
-- 请在 Supabase 的 SQL Editor 中执行以下脚本
-- ==========================================

-- 创建 cities 表 (城市社保标准表)
CREATE TABLE IF NOT EXISTS cities (
  id INTEGER PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate NUMERIC NOT NULL
);

-- 创建 salaries 表 (员工工资表)
CREATE TABLE IF NOT EXISTS salaries (
  id INTEGER PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL,
  city_id INTEGER NOT NULL REFERENCES cities(id)
);

-- 创建 results 表 (计算结果表)
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  avg_salary NUMERIC NOT NULL,
  contribution_base NUMERIC NOT NULL,
  company_fee NUMERIC NOT NULL
);

-- 启用 Row Level Security (RLS)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 为开发便利，暂时允许所有操作 (生产环境应配置更严格的策略)
DROP POLICY IF EXISTS "Enable all access for cities" ON cities;
CREATE POLICY "Enable all access for cities" ON cities
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for salaries" ON salaries;
CREATE POLICY "Enable all access for salaries" ON salaries
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for results" ON results;
CREATE POLICY "Enable all access for results" ON results
  FOR ALL USING (true) WITH CHECK (true);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_salaries_employee_name ON salaries(employee_name);
CREATE INDEX IF NOT EXISTS idx_salaries_city_id ON salaries(city_id);
CREATE INDEX IF NOT EXISTS idx_cities_year ON cities(year);
