import React from 'react';
import { StrategyMetrics } from '../types';
import { CalendarRange } from 'lucide-react';
import { playTerminalBeep } from '../utils/sound';

export interface YearlyRRItem {
  year: string;
  drawCount: number;
  metrics: StrategyMetrics;
}

interface YearlyRRBreakdownProps {
  items: YearlyRRItem[];
  allMetrics: StrategyMetrics;
  selectedYear: string;
  onSelectYear: (year: string) => void;
}

export const YearlyRRBreakdown: React.FC<YearlyRRBreakdownProps> = ({
  items,
  allMetrics,
  selectedYear,
  onSelectYear
}) => {
  if (items.length === 0) return null;

  const validItems = items.filter(i => i.metrics.totalDraws > 0);
  const avgYearlyRR =
    validItems.length > 0
      ? validItems.reduce((sum, i) => sum + i.metrics.riskRewardRatio, 0) / validItems.length
      : 0;
  const maxRR = Math.max(...items.map(i => i.metrics.riskRewardRatio), 1);

  return (
    <div className="bg-[#14181f] border border-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-[#1a2028] border-b border-gray-800 flex justify-between items-center gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <CalendarRange size={14} className="text-yellow-400 shrink-0" />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-gray-200 truncate">
            Yearly Risk:Reward (สรุป RR รายปี)
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            playTerminalBeep(700, 0.04);
            onSelectYear('all');
          }}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors shrink-0 border ${
            selectedYear === 'all'
              ? 'bg-yellow-500 text-black border-yellow-400'
              : 'bg-[#0e1217] text-gray-300 border-gray-700 hover:text-white hover:border-gray-600'
          }`}
          title="ดูรวมทุกปี"
        >
          รวมทุกปี 1:{allMetrics.riskRewardRatio.toFixed(1)}
        </button>
      </div>

      <div className="p-3.5 space-y-3">
        {/* Top Summary Strip */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#0e1217] px-3 py-2 rounded-lg border border-amber-500/20 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold">RR เฉลี่ย/ปี</span>
            <span className="text-sm font-mono font-black text-amber-400">
              1:{avgYearlyRR.toFixed(1)}
            </span>
          </div>
          <div className="bg-[#0e1217] px-3 py-2 rounded-lg border border-gray-800 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold">RR รวม ({validItems.length} ปี)</span>
            <span className="text-sm font-mono font-black text-gray-200">
              1:{allMetrics.riskRewardRatio.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Per-year list */}
        <div className="space-y-2">
          {items.map((item) => {
            const isSelected = selectedYear === item.year;
            const rr = item.metrics.riskRewardRatio;
            const isProfit = item.metrics.totalProfit >= 0;
            const barWidth = rr > 0 ? Math.max(4, Math.min(100, (rr / maxRR) * 100)) : 0;

            return (
              <button
                key={item.year}
                type="button"
                onClick={() => {
                  playTerminalBeep(700, 0.04);
                  onSelectYear(item.year);
                }}
                className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_12px_rgba(240,185,11,0.12)]'
                    : 'bg-[#0e1217] border-gray-800/80 hover:border-gray-700 hover:bg-[#161b23]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-xs font-bold ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                      ปี {item.year}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      ({item.metrics.totalDraws} งวด)
                    </span>
                    {item.metrics.exact3Hits > 0 && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        🎯 3ตรง×{item.metrics.exact3Hits}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-xs font-mono font-black ${
                      rr >= 1 ? 'text-amber-400' : 'text-gray-400'
                    }`}
                  >
                    RR 1:{rr.toFixed(1)}
                  </span>
                </div>

                {/* Bar */}
                <div className="h-1.5 bg-[#0b0e11] rounded-full overflow-hidden border border-gray-800/80 mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isProfit
                        ? 'bg-gradient-to-r from-amber-500 to-emerald-400'
                        : 'bg-gradient-to-r from-gray-600 to-rose-500/70'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span>
                    Win <strong className="text-blue-400">{item.metrics.winRate.toFixed(1)}%</strong> • ROI{' '}
                    <strong className={item.metrics.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {item.metrics.roi >= 0 ? '+' : ''}
                      {item.metrics.roi.toFixed(0)}%
                    </strong>
                  </span>
                  <span className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}
                    {item.metrics.totalProfit.toLocaleString()}฿
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
