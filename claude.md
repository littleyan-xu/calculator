# 五险一金计算器项目 - 开发计划

## 项目概述

构建一个迷你"五险一金"计算器Web应用，根据预设的员工工资数据和城市社保标准，计算公司为每位员工应缴纳的社保公积金费用。

## 技术栈

- **前端框架**: Next.js (App Router)
- **UI/样式**: Tailwind CSS
- **数据库/后端**: Supabase
- **Excel处理**: xlsx 库

---

## 数据库设计 (Supabase)

### 1. cities (城市标准表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| city_name | text | 城市名 |
| year | text | 年份 (当前固定2024) |
| base_min | int | 社保基数下限 |
| base_max | int | 社保基数上限 |
| rate | float | 综合缴纳比例 (如 0.15) |

**注意**: Excel源文件中列名为 `city_namte` (拼写错误)，上传时需映射为 `city_name`

### 2. salaries (员工工资表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| employee_id | text | 员工工号 |
| employee_name | text | 员工姓名 |
| month | text | 年份月份 (YYYYMM格式) |
| salary_amount | int | 该月工资金额 |
| city_id | int | 关联cities表的ID |

### 3. results (计算结果表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| employee_name | text | 员工姓名 |
| city_name | text | 城市名 (新增) |
| avg_salary | float | 年度月平均工资 |
| contribution_base | float | 最终缴费基数 |
| company_fee | float | 公司缴纳金额 |

**注意**: 新增 `city_name` 字段以展示计算所用的城市标准

---

## 核心业务逻辑

### 计算函数执行步骤

1. **清空历史数据**: 清空 `results` 表中所有记录
2. **读取工资数据**: 从 `salaries` 表中读取所有数据
3. **按员工分组计算**:
   - 按 `employee_name` 和 `city_id` 分组
   - 计算每位员工在每个城市的"年度月平均工资"
4. **获取城市标准**: 从 `cities` 表中获取各城市的 `base_min`, `base_max`, `rate` (year = '2024')
5. **确定缴费基数**:
   - 若 平均工资 < base_min，则使用 base_min
   - 若 平均工资 > base_max，则使用 base_max
   - 否则使用平均工资本身
6. **计算公司应缴金额**: `company_fee = contribution_base × rate`
7. **存储结果**: 将计算结果存入 `results` 表

---

## 页面设计

### 1. 主页 (/)

**定位**: 应用入口和导航中枢

**布局**:
- 两个并排或垂直排列的功能卡片
- 卡片样式: 阴影、圆角、hover效果

**功能卡片**:
| 卡片 | 标题 | 说明 | 链接 |
|------|------|------|------|
| 卡片一 | 数据上传 | 上传Excel数据并执行计算 | /upload |
| 卡片二 | 结果查询 | 查看五险一金计算结果 | /results |

### 2. 数据上传页 (/upload)

**定位**: 后台操作控制面板

**功能**:
- **按钮一**: "上传城市数据 (cities.xlsx)"
  - 点击后选择本地 cities.xlsx 文件
  - 解析Excel并插入/更新 `cities` 表 (存在则覆盖)
- **按钮二**: "上传工资数据 (salaries.xlsx)"
  - 点击后选择本地 salaries.xlsx 文件
  - 解析Excel并插入/更新 `salaries` 表 (存在则覆盖)
- **按钮三**: "执行计算并存储结果"
  - 触发核心计算逻辑
  - 显示计算进度/结果提示

**反馈**: 每个操作后显示成功/失败提示

### 3. 结果展示页 (/results)

**定位**: 计算成果最终展示页面

**功能**:
- 页面加载时自动从 `results` 表获取所有数据
- 使用 Tailwind CSS 表格展示所有结果

**表格列**:
| 员工姓名 | 城市 | 平均工资 | 缴费基数 | 公司应缴 |
|----------|------|----------|----------|----------|

---

## 开发任务清单 (TodoList)

### Phase 1: 环境搭建

- [ ] 创建 Next.js 项目 (使用 App Router)
- [ ] 安装依赖: Tailwind CSS, Supabase Client, xlsx
- [ ] 配置 Tailwind CSS
- [ ] 在 Supabase 创建项目并获取 API 密钥

### Phase 2: 数据库设置

- [ ] 在 Supabase SQL Editor 中创建 `cities` 表
- [ ] 在 Supabase SQL Editor 中创建 `salaries` 表
- [ ] 在 Supabase SQL Editor 中创建 `results` 表
- [ ] 配置 Row Level Security (RLS) 策略
- [ ] 测试数据库连接

### Phase 3: 项目基础配置

- [ ] 创建 `.env.local` 文件配置 Supabase 环境变量
- [ ] 创建 Supabase 客户端工具函数 (`lib/supabase.ts`)
- [ ] 配置项目目录结构 (app/, components/, lib/)

### Phase 4: 主页开发

- [ ] 创建 `app/page.tsx` 主页
- [ ] 设计并实现导航卡片组件
- [ ] 添加卡片样式和hover效果
- [ ] 测试页面跳转功能

### Phase 5: 数据上传页开发

- [ ] 创建 `app/upload/page.tsx` 上传页
- [ ] 创建 Excel 文件上传组件
- [ ] 实现 cities 数据解析和上传逻辑 (处理 city_namte -> city_name)
- [ ] 实现 salaries 数据解析和上传逻辑
- [ ] 实现数据覆盖/更新逻辑
- [ ] 添加操作成功/失败提示

### Phase 6: 核心计算逻辑

- [ ] 创建 API Route (`app/api/calculate/route.ts`)
- [ ] 实现清空 results 表逻辑
- [ ] 实现按员工分组计算平均工资
- [ ] 实现获取城市标准逻辑
- [ ] 实现缴费基数确定逻辑
- [ ] 实现公司应缴金额计算
- [ ] 实现结果存储逻辑
- [ ] 添加错误处理和响应

### Phase 7: 结果展示页开发

- [ ] 创建 `app/results/page.tsx` 结果页
- [ ] 实现从 results 表获取数据
- [ ] 设计并实现数据表格组件
- [ ] 添加表格样式 (Tailwind)
- [ ] 处理空数据状态

### Phase 8: 集成与测试

- [ ] 连接上传页的"执行计算"按钮到 API
- [ ] 端到端测试完整流程
- [ ] 使用提供的 Excel 文件进行测试
- [ ] 验证计算结果准确性
- [ ] 修复发现的 Bug

### Phase 9: 优化与部署

- [ ] 优化页面加载性能
- [ ] 添加加载状态指示
- [ ] 改进错误提示信息
- [ ] 响应式设计优化
- [ ] 部署到 Vercel

---

## 项目文件结构

```
calculator/
├── app/
│   ├── page.tsx              # 主页
│   ├── upload/
│   │   └── page.tsx          # 上传页
│   ├── results/
│   │   └── page.tsx          # 结果页
│   └── api/
│       └── calculate/
│           └── route.ts      # 计算API
├── components/
│   ├── NavigationCard.tsx    # 导航卡片组件
│   ├── FileUploadButton.tsx  # 文件上传按钮组件
│   └── ResultsTable.tsx      # 结果表格组件
├── lib/
│   ├── supabase.ts           # Supabase客户端
│   └── types.ts              # TypeScript类型定义
├── public/                   # 静态资源
├── .env.local               # 环境变量
├── tailwind.config.ts       # Tailwind配置
├── next.config.js           # Next.js配置
├── package.json
└── tsconfig.json
```

---

## 重要注意事项

1. **Excel列名问题**: cities.xlsx 源文件中列名为 `city_namte`，需映射为 `city_name`
2. **年份固定**: 第一版固定使用 2024 年标准
3. **数据覆盖**: 上传时存在则覆盖，不存在则插入
4. **结果清空**: 每次计算前先清空 results 表
5. **多城市支持**: 同一员工可能在多个城市有工资记录，按 city_id 分组计算
6. **手动计算**: 必须点击"执行计算"按钮才触发计算
7. **简单展示**: results 页面仅做全量表格展示，无需分页/搜索