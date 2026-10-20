import React from 'react';
import { LotteryDraw, StrategyMetrics } from '../types';
import { TrendingUp, Flame, Snowflake, Award } from 'lucide-react';

interface TickerBarProps {
  latestDraw: LotteryDraw;
  metrics: StrategyMetrics;
  hotZone: number[];
  coldZone: number[];
}

export const TickerBar: React.FC<TickerBarProps> = ({
  latestDraw,
  metrics,
  hotZone,
  coldZone
}) => {
  return (
    <div className="bg-[#0e1217] border-b border-gray-800/80 px-3 py-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none flex items-center gap-6 whitespace-nowrap">
      {/* Latest Result */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 font-bold uppercase">งวดล่าสุด ({latestDraw.date}):</span>
        <span className="text-white font-bold bg-[#1e2329] px-1.5 py-0.5 rounded border border-gray-700">
          บน: <strong className="text-yellow-400">{latestDraw.top3}</strong>
        </span>
        <span className="text-white font-bold bg-[#1e2329] px-1.5 py-0.5 rounded border border-gray-700">
          ล่าง: <strong className="text-emerald-400">{latestDraw.bot2}</strong>
        </span>
      </div>

      <div className="h-3 w-px bg-gray-800" />

      {/* Win Rate */}
      <div className="flex items-center gap-1.5">
        <Award size={13} className="text-yellow-400" />
        <span className="text-gray-400">WIN RATE:</span>
        <span className="font-bold text-yellow-400">{metrics.winRate.toFixed(1)}%</span>
      </div>

      <div className="h-3 w-px bg-gray-800" />

      {/* Hit 1D+ Strike */}
      <div className="flex items-center gap-1.5">
        <TrendingUp size={13} className="text-emerald-400" />
        <span className="text-gray-400">STRIKE 1D+:</span>
        <span className="font-bold text-emerald-400">{metrics.hit1PlusTopRate.toFixed(1)}%</span>
      </div>

      <div className="h-3 w-px bg-gray-800" />

      {/* Hot Digits */}
      <div className="flex items-center gap-1.5">
        <Flame size={13} className="text-amber-500" />
        <span className="text-gray-400">HOT NUMS:</span>
        <div className="flex gap-1">
          {hotZone.map(d => (
            <span key={d} className="px-1 bg-amber-500/10 text-amber-400 font-bold rounded border border-amber-500/20">{d}</span>
          ))}
        </div>
      </div>

      <div className="h-3 w-px bg-gray-800" />

      {/* Cold Digits */}
      <div className="flex items-center gap-1.5">
        <Snowflake size={13} className="text-blue-400" />
        <span className="text-gray-400">COLD NUMS:</span>
        <div className="flex gap-1">
          {coldZone.map(d => (
            <span key={d} className="px-1 bg-blue-500/10 text-blue-400 font-bold rounded border border-blue-500/20">{d}</span>
          ))}
        </div>
      </div>

      <div className="h-3 w-px bg-gray-800" />

      {/* Cumulative Return */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-400">SIMULATED P&L:</span>
        <span className={`font-bold ${metrics.totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {metrics.totalProfit >= 0 ? '+' : ''}{metrics.totalProfit.toLocaleString()} THB ({metrics.roi >= 0 ? '+' : ''}{metrics.roi.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
};
