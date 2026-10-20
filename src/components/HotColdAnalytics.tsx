import React, { useState } from 'react';
import { LotteryDraw } from '../types';
import { calculateDigitStats } from '../utils/engine';
import { Flame, Snowflake, BarChart3 } from 'lucide-react';
import { playTerminalBeep } from '../utils/sound';

interface HotColdAnalyticsProps {
  draws: LotteryDraw[];
}

export const HotColdAnalytics: React.FC<HotColdAnalyticsProps> = ({ draws }) => {
  const [target, setTarget] = useState<'top3' | 'bot2'>('top3');
  const statsData = calculateDigitStats(draws, target);

  const totalOddEven = statsData.oddCount + statsData.evenCount;
  const oddPct = totalOddEven > 0 ? (statsData.oddCount / totalOddEven) * 100 : 50;
  const evenPct = 100 - oddPct;

  const totalHighLow = statsData.highCount + statsData.lowCount;
  const highPct = totalHighLow > 0 ? (statsData.highCount / totalHighLow) * 100 : 50;
  const lowPct = 100 - highPct;

  return (
    <div className="bg-[#14181f] border border-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Header */}
      <div className="px-3.5 py-2.5 bg-[#1a2028] border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <BarChart3 size={14} className="text-yellow-400" />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-gray-200">Volume Analysis (สถิติเลขเด่น)</h3>
        </div>
        <div className="flex bg-[#0e1217] p-0.5 rounded border border-gray-800 text-[10px]">
          <button
            onClick={() => {
              playTerminalBeep(700, 0.04);
              setTarget('top3');
            }}
            className={`px-2 py-0.5 rounded font-bold transition-colors ${
              target === 'top3' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            3 ตัวบน
          </button>
          <button
            onClick={() => {
              playTerminalBeep(700, 0.04);
              setTarget('bot2');
            }}
            className={`px-2 py-0.5 rounded font-bold transition-colors ${
              target === 'bot2' ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            2 ตัวล่าง
          </button>
        </div>
      </div>

      <div className="p-3.5 space-y-4">
        {/* Hot / Cold Pills */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0e1217] p-2.5 rounded-lg border border-emerald-500/20">
            <p className="text-[10px] text-emerald-400 font-bold mb-1.5 flex items-center gap-1">
              <Flame size={12} className="text-emerald-400" />
              HOT ZONE (ออกบ่อย)
            </p>
            <div className="flex gap-1.5">
              {statsData.hotZone.map(d => (
                <span
                  key={`hot-${d}`}
                  className="w-7 h-7 rounded bg-emerald-500/15 text-emerald-400 font-mono font-black text-sm flex items-center justify-center border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#0e1217] p-2.5 rounded-lg border border-blue-500/20">
            <p className="text-[10px] text-blue-400 font-bold mb-1.5 flex items-center gap-1">
              <Snowflake size={12} className="text-blue-400" />
              COLD ZONE (ออกน้อย)
            </p>
            <div className="flex gap-1.5">
              {statsData.coldZone.map(d => (
                <span
                  key={`cold-${d}`}
                  className="w-7 h-7 rounded bg-blue-500/15 text-blue-400 font-mono font-black text-sm flex items-center justify-center border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Micro Bar Chart */}
        <div>
          <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1.5">
            <span>การกระจายตัวของเลข 0 - 9</span>
            <span>ความถี่ (ครั้ง)</span>
          </div>
          <div className="space-y-1.5">
            {statsData.stats.map((item, idx) => {
              let barColor = 'bg-gray-600';
              let badgeColor = 'text-gray-300';
              if (idx < 3) {
                barColor = 'bg-gradient-to-r from-emerald-500 to-teal-400';
                badgeColor = 'text-emerald-400 font-bold';
              } else if (idx >= 7) {
                barColor = 'bg-gradient-to-r from-blue-500 to-indigo-400';
                badgeColor = 'text-blue-400';
              }

              return (
                <div key={item.digit} className="flex items-center gap-2 text-xs font-mono group">
                  <span className={`w-3 text-center font-bold ${badgeColor}`}>{item.digit}</span>
                  <div className="flex-1 h-2 bg-[#0b0e11] rounded-full overflow-hidden border border-gray-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${(item.count / statsData.maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-5 text-right text-gray-400 text-[10px] group-hover:text-white">
                    {item.count}
                  </span>
                  <span className="w-12 text-right text-[9px] text-gray-600">
                    {item.lastSeenDrawsAgo === 0 ? 'งวดล่าสุด' : `เว้น ${item.lastSeenDrawsAgo}งวด`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Odd vs Even & High vs Low Meters */}
        <div className="pt-2 border-t border-gray-800/80 grid grid-cols-2 gap-3 text-[10px]">
          <div>
            <div className="flex justify-between text-gray-400 mb-1">
              <span>คู่ (Even)</span>
              <span>คี่ (Odd)</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden flex">
              <div className="bg-purple-500 h-full" style={{ width: `${evenPct}%` }} />
              <div className="bg-amber-500 h-full" style={{ width: `${oddPct}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-0.5">
              <span>{evenPct.toFixed(0)}%</span>
              <span>{oddPct.toFixed(0)}%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-gray-400 mb-1">
              <span>ต่ำ (0-4)</span>
              <span>สูง (5-9)</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden flex">
              <div className="bg-cyan-500 h-full" style={{ width: `${lowPct}%` }} />
              <div className="bg-rose-500 h-full" style={{ width: `${highPct}%` }} />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-0.5">
              <span>{lowPct.toFixed(0)}%</span>
              <span>{highPct.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
