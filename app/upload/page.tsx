'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';
import { CityFromExcel, Salary, City } from '@/lib/types';
import FileUploadButton from '@/components/FileUploadButton';

export default function UploadPage() {
  const [calculating, setCalculating] = useState(false);
  const [calcMessage, setCalcMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 上传城市数据
  const uploadCities = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    console.log('Excel 原始数据:', jsonData);

    // 映射 city_namte -> city_name，处理可能的列名变体
    const cities: City[] = jsonData.map((row) => {
      // 尝试多种可能的列名（处理空格、拼写错误等）
      const cityName = row.city_name || row.city_namte || row['city_namte '] || row['city_name '] || '';

      console.log('处理行:', row, 'cityName:', cityName);

      return {
        id: row.id,
        city_name: String(cityName).trim(),
        year: String(row.year),
        base_min: Number(row.base_min),
        base_max: Number(row.base_max),
        rate: Number(row.rate),
      };
    });

    console.log('转换后的数据:', cities);

    // 先删除已存在的数据（按ID）
    for (const city of cities) {
      if (city.id !== undefined) {
        await supabase.from('cities').delete().eq('id', city.id);
      }
    }

    // 插入新数据
    const { error } = await supabase.from('cities').insert(cities);
    if (error) throw error;
  };

  // 上传工资数据
  const uploadSalaries = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: Salary[] = XLSX.utils.sheet_to_json(worksheet);

    // 先删除已存在的数据（按ID）
    for (const salary of jsonData) {
      if (salary.id !== undefined) {
        await supabase.from('salaries').delete().eq('id', salary.id);
      }
    }

    // 插入新数据
    const { error } = await supabase.from('salaries').insert(jsonData);
    if (error) throw error;
  };

  // 执行计算
  const executeCalculation = async () => {
    setCalculating(true);
    setCalcMessage(null);

    try {
      const response = await fetch('/api/calculate', { method: 'POST' });
      const result = await response.json();

      if (response.ok) {
        setCalcMessage({ type: 'success', text: result.message || '计算完成！' });
      } else {
        setCalcMessage({ type: 'error', text: result.error || '计算失败' });
      }
    } catch (error) {
      setCalcMessage({ type: 'error', text: `计算失败: ${error instanceof Error ? error.message : '未知错误'}` });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">数据上传与操作</h1>

          <div className="space-y-8">
            {/* 上传城市数据 */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">1. 上传城市标准数据</h2>
              <FileUploadButton
                onUpload={uploadCities}
                fileName="cities.xlsx"
                accept=".xlsx,.xls"
              />
            </div>

            {/* 上传工资数据 */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">2. 上传员工工资数据</h2>
              <FileUploadButton
                onUpload={uploadSalaries}
                fileName="salaries.xlsx"
                accept=".xlsx,.xls"
              />
            </div>

            {/* 执行计算 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">3. 执行计算</h2>
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={executeCalculation}
                  disabled={calculating}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                    calculating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {calculating ? '计算中...' : '执行计算并存储结果'}
                </button>
                {calcMessage && (
                  <p className={`text-sm ${calcMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {calcMessage.text}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-700 underline">
              返回主页
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
