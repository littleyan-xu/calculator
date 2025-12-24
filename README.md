# 五险一金计算器

一个基于 Next.js + Supabase 的迷你"五险一金"计算器 Web 应用，根据员工工资数据和城市社保标准，计算公司应缴纳的社保公积金费用。

## 功能特性

- 支持多城市社保标准管理
- Excel 文件批量上传数据
- 自动计算缴费基数和公司应缴金额
- 清晰的结果展示表格

## 技术栈

- **前端框架**: Next.js (App Router)
- **UI 样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **Excel 处理**: xlsx

## 项目结构

```
calculator/
├── app/
│   ├── page.tsx              # 主页
│   ├── upload/page.tsx       # 数据上传页
│   ├── results/page.tsx      # 结果展示页
│   └── api/calculate/route.ts # 计算API
├── components/
│   ├── NavigationCard.tsx    # 导航卡片组件
│   └── FileUploadButton.tsx  # 文件上传组件
├── lib/
│   ├── supabase.ts           # Supabase 客户端
│   └── types.ts              # TypeScript 类型定义
└── supabase-setup.sql        # 数据库初始化脚本
```

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/littleyan-xu/calculator.git
cd calculator
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 初始化数据库

在 Supabase 的 SQL Editor 中执行 `supabase-setup.sql` 脚本。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 使用说明

### 数据准备

准备两个 Excel 文件：

**cities.xlsx** - 城市社保标准
| id | city_name | year | base_min | base_max | rate |
|----|-----------|------|----------|----------|------|
| 1  | 佛山      | 2024 | 5500     | 27501    | 0.15 |
| 2  | 广州      | 2024 | 4546     | 26421    | 0.14 |

**salaries.xlsx** - 员工工资数据
| id | employee_id | employee_name | month   | salary_amount | city_id |
|----|-------------|---------------|---------|---------------|---------|
| 1  | 1           | 张三          | 202401  | 30000         | 1       |

### 操作流程

1. 访问主页，点击"数据上传"
2. 上传 `cities.xlsx` 城市标准数据
3. 上传 `salaries.xlsx` 员工工资数据
4. 点击"执行计算并存储结果"
5. 查看"结果查询"页面获取计算结果

### 计算逻辑

1. 按员工和城市分组计算年度月平均工资
2. 根据城市标准确定缴费基数：
   - 平均工资 < 基数下限 → 使用基数下限
   - 平均工资 > 基数上限 → 使用基数上限
   - 否则使用平均工资本身
3. 计算公司应缴金额 = 缴费基数 × 缴纳比例

## 构建部署

```bash
npm run build
npm start
```

## 许可证

ISC
