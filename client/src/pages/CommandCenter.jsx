import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  TrendingUp, Calendar, ShieldCheck, Clock, FileText, Zap, 
  AlertTriangle, Bell, CheckCircle, ChevronRight, Download, 
  LifeBuoy, UserPlus, ArrowUpRight, ArrowDownRight, UserCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CommandCenter = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
      </div>
    </div>
  );
  
  if (!data) return <div>Failed to load data.</div>;

  const chartData = [
    { name: 'Equity', value: data.portfolio.allocation.equity, color: '#0F766E' }, // Teal
    { name: 'Debt', value: data.portfolio.allocation.debt, color: '#6366F1' }, // Indigo
    { name: 'Liquid', value: data.portfolio.allocation.liquid, color: '#F59E0B' } // Amber
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Hero Section */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 tracking-tight mb-2">
              Good Morning, {user?.name.split(' ')[0]} 👋
            </h1>
            <p className="text-navy-500 font-medium mb-6">Here's your wealth overview for today.</p>
            
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${data.healthScore.score > 80 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                {data.healthScore.label} Portfolio
              </span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${data.kycStatus === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                KYC {data.kycStatus}
              </span>
            </div>
          </div>
          
          <div className="text-left md:text-right">
            <p className="text-sm font-semibold text-navy-500 mb-1 uppercase tracking-wider">Total Assets</p>
            <h2 className="text-4xl font-extrabold text-navy-900 tracking-tight">₹{data.portfolio.totalValue.toLocaleString()}</h2>
            <div className="flex items-center md:justify-end gap-1 mt-2 font-medium">
              {data.portfolio.todayChange >= 0 ? (
                <span className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" /> +₹{data.portfolio.todayChange.toLocaleString()} Today
                </span>
              ) : (
                <span className="flex items-center text-red-600 bg-red-50 px-2 py-0.5 rounded text-sm">
                  <ArrowDownRight className="w-4 h-4 mr-1" /> -₹{Math.abs(data.portfolio.todayChange).toLocaleString()} Today
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Compact Premium KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card hover:border-teal-300 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-0.5">Gain/Loss</p>
              <h3 className="text-xl font-bold text-navy-900">+2.5%</h3>
            </div>
          </div>
        </div>

        <div className="card hover:border-blue-300 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-0.5">Next SIP</p>
              <h3 className="text-xl font-bold text-navy-900">
                {data.nextSip ? `₹${data.nextSip.amount.toLocaleString()}` : 'None'}
              </h3>
            </div>
          </div>
        </div>

        <div className="card hover:border-green-300 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-0.5">KYC Status</p>
              <h3 className="text-xl font-bold text-navy-900">{data.kycStatus}</h3>
            </div>
          </div>
        </div>
        
        <div className="card hover:border-amber-300 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <UserCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-0.5">Nominees</p>
              <h3 className="text-xl font-bold text-navy-900">Configured</h3>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Smart Insights (Centerpiece) */}
      {data.insights && data.insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-navy-900 flex items-center gap-2 px-1">
            <Zap className="w-5 h-5 text-yellow-500" /> Smart Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.insights.map((insight, index) => {
              const styleMap = {
                warning: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', icon: 'text-orange-500' },
                error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', icon: 'text-red-500' },
                info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: 'text-blue-500' },
                success: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', icon: 'text-teal-600' }
              };
              const s = styleMap[insight.type];
              
              return (
                <div key={index} className={`rounded-2xl p-5 border ${s.bg} ${s.border} flex flex-col justify-between hover:shadow-md transition-shadow`}>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {insight.type === 'warning' || insight.type === 'error' ? <AlertTriangle className={`w-5 h-5 shrink-0 ${s.icon}`} /> : 
                       insight.type === 'info' ? <Bell className={`w-5 h-5 shrink-0 ${s.icon}`} /> : 
                       <FileText className={`w-5 h-5 shrink-0 ${s.icon}`} />}
                      <h4 className={`font-bold text-sm ${s.text}`}>{insight.title}</h4>
                    </div>
                    <p className={`text-xs mb-5 font-medium opacity-80 ${s.text}`}>{insight.message}</p>
                  </div>
                  <Link to={insight.link} className={`inline-flex items-center justify-between w-full px-3 py-2 rounded-lg bg-white/60 hover:bg-white text-xs font-bold transition-colors ${s.text}`}>
                    Take Action <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Split Layout: Health & Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compact Health Score */}
        <div className="card flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-6 w-full text-left">Health Score</h3>
          <div className="relative mb-4">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="48" fill="none" stroke="#F1F5F9" strokeWidth="12" />
              <circle 
                cx="56" cy="56" r="48" fill="none" stroke="#0F766E" strokeWidth="12" 
                strokeDasharray="301.59" 
                strokeDashoffset={301.59 - (301.59 * data.healthScore.score) / 100} 
                className="transition-all duration-1000 ease-in-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-black text-navy-900 tracking-tight">{data.healthScore.score}</span>
            </div>
          </div>
          <h4 className="font-bold text-navy-900 text-lg">{data.healthScore.label}</h4>
          <div className="flex gap-1 mt-2 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < data.healthScore.stars ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Premium Portfolio Allocation */}
        <div className="card lg:col-span-2 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 h-56 relative">
            <h3 className="absolute top-0 left-0 text-sm font-bold text-navy-900 uppercase tracking-wider z-10">Asset Allocation</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="55%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
            {chartData.map((asset) => (
              <div key={asset.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                  <span className="font-semibold text-navy-700">{asset.name}</span>
                </div>
                <span className="font-bold text-navy-900">{asset.value}%</span>
              </div>
            ))}
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-navy-500 uppercase mb-1">Top Performing Fund</p>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-bold text-navy-900">Axis Bluechip Equity</span>
                <span className="text-sm font-semibold text-teal-600">₹1,50,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Split Layout: Timeline & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline Activity */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-6">Recent Activity</h3>
          <div className="pl-2">
            {data.recentActivity.map((activity, index) => (
              <div key={activity._id} className="timeline-item timeline-line flex gap-4 pb-6 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 ring-4 ring-white ${
                  activity.type === 'Alert' || activity.type === 'Action' ? 'bg-red-100 text-red-600' : 
                  activity.type === 'Success' ? 'bg-green-100 text-green-600' : 'bg-teal-100 text-teal-600'
                }`}>
                  {activity.type === 'Alert' || activity.type === 'Action' ? <AlertTriangle className="w-4 h-4" /> : 
                   activity.type === 'Success' ? <CheckCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </div>
                <div className="pt-2">
                  <h4 className="text-sm font-bold text-navy-900">{activity.title}</h4>
                  <p className="text-xs font-medium text-navy-500 mt-1">{new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
                </div>
              </div>
            ))}
            {data.recentActivity.length === 0 && (
              <p className="text-sm text-navy-500 text-center py-4">No recent activity.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link to="/statements" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors group">
              <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-teal-100 text-navy-600 group-hover:text-teal-600 transition-colors">
                <Download className="w-5 h-5" />
              </div>
              <span className="font-semibold text-navy-800 text-sm">Download Statement</span>
            </Link>
            
            <Link to="/support" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors group">
              <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-teal-100 text-navy-600 group-hover:text-teal-600 transition-colors">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <span className="font-semibold text-navy-800 text-sm">Raise Ticket</span>
            </Link>
            
            <Link to="/kyc" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors group">
              <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-teal-100 text-navy-600 group-hover:text-teal-600 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-semibold text-navy-800 text-sm">Update KYC</span>
            </Link>
            
            <Link to="/nominee" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors group">
              <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-teal-100 text-navy-600 group-hover:text-teal-600 transition-colors">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="font-semibold text-navy-800 text-sm">Add Nominee</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommandCenter;
