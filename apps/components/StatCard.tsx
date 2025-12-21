
import React from 'react';
import { DashboardStat } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard: React.FC<{ stat: DashboardStat }> = ({ stat }) => {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5 hover:border-indigo-500/50 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          stat.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
        }`}>
          {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {stat.change}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors">
          {stat.value}
        </h3>
      </div>
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 rounded-full" 
          style={{ width: stat.isPositive ? '70%' : '40%' }}
        />
      </div>
    </div>
  );
};

export default StatCard;
