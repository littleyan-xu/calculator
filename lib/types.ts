// 城市社保标准表
export interface City {
  id?: number;
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
}

// Excel中的City数据 (注意：city_namte 是源文件中的拼写错误)
export interface CityFromExcel {
  id?: number;
  city_namte: string;  // 源文件列名拼写错误
  year: string;
  rate: number;
  base_min: number;
  base_max: number;
}

// 员工工资表
export interface Salary {
  id?: number;
  employee_id: string;
  employee_name: string;
  month: string;
  salary_amount: number;
  city_id: number;
}

// 计算结果表
export interface Result {
  id?: number;
  employee_name: string;
  city_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
}

// 员工工资汇总 (用于计算)
export interface SalarySummary {
  employee_name: string;
  city_id: number;
  total_salary: number;
  count: number;
}
