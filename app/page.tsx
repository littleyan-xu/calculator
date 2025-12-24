import NavigationCard from '@/components/NavigationCard';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          五险一金计算器
        </h1>
        <p className="text-center text-gray-600 mb-12">
          根据员工工资数据和城市社保标准，快速计算公司应缴纳费用
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <NavigationCard
            title="数据上传"
            description="上传城市标准和员工工资数据，并触发计算"
            href="/upload"
          />
          <NavigationCard
            title="结果查询"
            description="查看五险一金计算结果和费用明细"
            href="/results"
          />
        </div>
      </div>
    </main>
  );
}
