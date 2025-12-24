import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Result, SalarySummary } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // 1. 清空历史数据
    await supabase.from('results').delete().neq('id', 0);

    // 2. 读取所有工资数据
    const { data: salaries, error: salariesError } = await supabase
      .from('salaries')
      .select('*');

    if (salariesError) {
      return NextResponse.json({ error: '读取工资数据失败: ' + salariesError.message }, { status: 500 });
    }

    if (!salaries || salaries.length === 0) {
      return NextResponse.json({ error: '没有工资数据，请先上传 salaries.xlsx' }, { status: 400 });
    }

    // 3. 按员工和城市分组计算平均工资
    const summaryMap = new Map<string, SalarySummary>();

    for (const salary of salaries) {
      const key = `${salary.employee_name}_${salary.city_id}`;
      const existing = summaryMap.get(key);

      if (existing) {
        existing.total_salary += salary.salary_amount;
        existing.count += 1;
      } else {
        summaryMap.set(key, {
          employee_name: salary.employee_name,
          city_id: salary.city_id,
          total_salary: salary.salary_amount,
          count: 1,
        });
      }
    }

    // 4. 获取所有城市标准 (2024年)
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .eq('year', '2024');

    if (citiesError) {
      return NextResponse.json({ error: '读取城市标准失败: ' + citiesError.message }, { status: 500 });
    }

    if (!cities || cities.length === 0) {
      return NextResponse.json({ error: '没有城市标准数据，请先上传 cities.xlsx' }, { status: 400 });
    }

    // 创建城市ID到城市数据的映射
    const cityMap = new Map(cities.map(c => [c.id!, c]));

    // 5-7. 计算缴费基数和公司应缴金额，并存储
    const results: Result[] = [];
    let resultId = 1;

    for (const summary of summaryMap.values()) {
      const city = cityMap.get(summary.city_id);
      if (!city) {
        console.warn(`未找到城市ID ${summary.city_id} 的标准数据，跳过员工 ${summary.employee_name}`);
        continue;
      }

      const avgSalary = summary.total_salary / summary.count;

      // 确定缴费基数
      let contributionBase: number;
      if (avgSalary < city.base_min) {
        contributionBase = city.base_min;
      } else if (avgSalary > city.base_max) {
        contributionBase = city.base_max;
      } else {
        contributionBase = avgSalary;
      }

      // 计算公司应缴金额
      const companyFee = contributionBase * city.rate;

      results.push({
        id: resultId++,
        employee_name: summary.employee_name,
        city_name: city.city_name,
        avg_salary: Number(avgSalary.toFixed(2)),
        contribution_base: Number(contributionBase.toFixed(2)),
        company_fee: Number(companyFee.toFixed(2)),
      });
    }

    // 存储结果到数据库
    const { error: insertError } = await supabase.from('results').insert(results);

    if (insertError) {
      return NextResponse.json({ error: '存储计算结果失败: ' + insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `计算完成，共处理 ${results.length} 条记录`,
      count: results.length,
    });

  } catch (error) {
    return NextResponse.json({
      error: '计算过程中发生错误: ' + (error instanceof Error ? error.message : '未知错误')
    }, { status: 500 });
  }
}
