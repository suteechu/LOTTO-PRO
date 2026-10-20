import React from 'react';
import { LotteryDraw, StrategyMetrics } from '../types';
import { TrendingUp, Flame, Snowflake, Award, Calendar } from 'lucide-react';
import { playTerminalBeep } from '../utils/sound';

interface TickerBarProps {
  latestDraw: LotteryDraw;
  metrics: StrategyMetrics;
  hotZone: number[];
  coldZone: number[];
  selectedYear: string;
  onSelectYear: (year: string) => void;
  yearCounts: { id: string; label: string; count: number }[];
}

export const TickerBar: React.FC<TickerBarProps> = ({
  latestDraw,
  metrics,
  hotZone,
  coldZone,
  selectedYear,
  onSelectYear,
  yearCounts
}) => {
  return (
    <div className="bg-[#0e1217] border-b border-gray-800/80 px-3 py-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none flex items-center gap-4 sm:gap-6 whitespace-nowrap">
      {/* Year Filter Pills */}
      <div className="flex items-center gap-1 bg-[#161a22] p-0.5 rounded-lg border border-gray-800 shrink-0">
        <span className="text-gray-400 font-bold px-1.5 flex items-center gap-1 text-[10px]">
          <Calendar size={11} className="text-yellow-400" />
          <span>ปีสถิติ:</span>
        </span>
        {yearCounts.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              playTerminalBeep(700, 0.04);
              onSelectYear(item.id);
            }}
            className={`px-2 py-0.5 rounded-md font-bold transition-all text-[10px] ${
              selectedYear === item.id
                ? 'bg-yellow-500 text-black shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      <div className="h-3 w-px bg-gray-800 shrink-0" />

      {/* Latest Result */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-gray-500 font-bold uppercase">งวดล่าสุด ({latestDraw.date}):</span>
        <span className="text-white font-bold bg-[#1e2329] px-1.5 py-0.5 rounded border border-gray-700">
          บน: <strong className="text-yellow-400">{latestDraw.top3}</strong>
        </span>
        <span className="text-white font-bold bg-[#1e2329] px-1.5 py-0.5 rounded border border-gray-700">
          ล่าง: <strong className="text-emerald-400">{latestDraw.bot2}</strong>
        </span>
      </div>

      <div className="h-3 w-px bg-gray-800 shrink-0" />

      {/* Win Rate */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Award size={13} className="text-yellow-400" />
        <span className="text-gray-400">WIN RATE:</span>
        <span className="font-bold text-yellow-400">{metrics.winRate.toFixed(1)}%</span>
      </div>

      <div className="h-3 w-px bg-gray-800 shrink-0" />

      {/* Hit 1D+ Strike */}
      <div className="flex items-center gap-1.5 shrink-0">
        <TrendingUp size={13} className="text-emerald-400" />
        <span className="text-gray-400">STRIKE 1D+:</span>
        <span className="font-bold text-emerald-400">{metrics.hit1PlusTopRate.toFixed(1)}%</span>
      </div>

      <div className="h-3 w-px bg-gray-800 shrink-0" />

      {/* Hot Digits */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Flame size={13} className="text-amber-500" />
        <span className="text-gray-400">HOT NUMS:</span>
        <div className="flex gap-1">
          {hotZone.map(d => (
            <span key={d} className="px-1 bg-amber-500/10 text-amber-400 font-bold rounded border border-amber-500/20">{d}</span>
          ))}
        </div>
      </div>

      <div className="h-3 w-px bg-gray-800 shrink-0" />

      {/* Cold Digits */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Snowflake size={13} className="text-blue-400" />
        <span className="text-gray-400">COLD NUMS:</span>
        <div className="flex gap-1">
          {coldZone.map(d => (
            <span key={d} className="px-1 bg-blue-500/10 text-blue-400 font-bold rounded border border-blue-500/20">{d}</span>
          ))}
        </div>
      </div>

      <div className="h-3 w-px bg-gray-800 shrink-0" />

      {/* Cumulative Return */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-gray-400">SIMULATED P&L:</span>
        <span className={`font-bold ${metrics.totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {metrics.totalProfit >= 0 ? '+' : ''}{metrics.totalProfit.toLocaleString()} THB ({metrics.roi >= 0 ? '+' : ''}{metrics.roi.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
};
