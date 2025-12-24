'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Result } from '@/lib/types';

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('id');

    if (error) {
      setError(error.message);
    } else {
      setResults(data || []);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">五险一金计算结果</h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">加载中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchResults}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">暂无计算结果，请先上传数据并执行计算</p>
              <a
                href="/upload"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                前往上传
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                      序号
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                      员工姓名
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                      城市
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                      平均工资
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                      缴费基数
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                      公司应缴
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 border-b border-gray-100">
                        {result.employee_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 border-b border-gray-100">
                        {result.city_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-right border-b border-gray-100">
                        {result.avg_salary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-right border-b border-gray-100">
                        {result.contribution_base.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600 text-right border-b border-gray-100">
                        {result.company_fee.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50">
                    <td colSpan={5} className="px-6 py-4 text-sm font-semibold text-gray-700 text-right border-t-2 border-gray-200">
                      合计:
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-700 text-right border-t-2 border-gray-200">
                      {results.reduce((sum, r) => sum + r.company_fee, 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={fetchResults}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              刷新数据
            </button>
            <a href="/" className="text-blue-600 hover:text-blue-700 underline">
              返回主页
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
