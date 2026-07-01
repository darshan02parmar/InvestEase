import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await api.get('/portfolio');
        setPortfolio(response.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  if (loading) return <div>Loading portfolio...</div>;
  if (!portfolio) return <div>Failed to load portfolio.</div>;

  const chartData = [
    { name: 'Equity', value: portfolio.allocation.equity, color: '#0d9488' },
    { name: 'Debt', value: portfolio.allocation.debt, color: '#3b82f6' },
    { name: 'Liquid', value: portfolio.allocation.liquid, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">My Portfolio</h1>
          <p className="text-navy-500">A detailed breakdown of your investments.</p>
        </div>
        <button className="btn-secondary">Download Report</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Asset Allocation</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <div className="card bg-teal-50 border-teal-100">
            <p className="text-sm font-medium text-teal-800">Total Value</p>
            <h2 className="text-3xl font-bold text-teal-900 mt-2">₹{portfolio.totalValue.toLocaleString()}</h2>
            <div className="flex items-center gap-2 mt-4 text-sm text-teal-700">
              <span className="font-semibold">+₹{portfolio.todayChange.toLocaleString()}</span>
              <span>Today's Change</span>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-sm font-semibold text-navy-900 mb-4">Allocation Details</h3>
            <div className="space-y-4">
              {chartData.map((asset) => (
                <div key={asset.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                    <span className="text-sm text-navy-700">{asset.name}</span>
                  </div>
                  <span className="text-sm font-medium text-navy-900">{asset.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
