import React from 'react';
import { StrategyMetrics } from '../types';
import { Bot, Sliders, Ticket, Zap, Calendar, Sparkles } from 'lucide-react';
import { playTerminalBeep } from '../utils/sound';

interface PredictionHeroProps {
  prediction: {
    top3: string;
    top2: string;
    bot2: string;
    digits: number[];
    botDigits: number[];
  };
  metrics: StrategyMetrics;
  isOptimizing: boolean;
  onAutoTune: () => void;
  showParams: boolean;
  onToggleParams: () => void;
  onOpenTicket: () => void;
  latestDate: string;
  activePresetName?: string;
}

export function getNextDrawSchedule(latestDate: string) {
  const match = latestDate.match(/(\d+)\s+([^\s]+)\s+(\d+)/);
  if (!match) return { thai: '1 พ.ย. 69', eng: '1 NOV' };

  const day = parseInt(match[1], 10);
  const thaiMonth = match[2];
  const year = parseInt(match[3], 10);

  const months = [
    { th: 'ม.ค.', en: 'JAN' },
    { th: 'ก.พ.', en: 'FEB' },
    { th: 'มี.ค.', en: 'MAR' },
    { th: 'เม.ย.', en: 'APR' },
    { th: 'พ.ค.', en: 'MAY' },
    { th: 'มิ.ย.', en: 'JUN' },
    { th: 'ก.ค.', en: 'JUL' },
    { th: 'ส.ค.', en: 'AUG' },
    { th: 'ก.ย.', en: 'SEP' },
    { th: 'ต.ค.', en: 'OCT' },
    { th: 'พ.ย.', en: 'NOV' },
    { th: 'ธ.ค.', en: 'DEC' },
  ];

  const idx = months.findIndex(m => m.th === thaiMonth);
  if (idx === -1) return { thai: '1 พ.ย. 69', eng: '1 NOV' };

  if (day <= 1) {
    return {
      thai: `16 ${thaiMonth} ${year}`,
      eng: `16 ${months[idx].en}`
    };
  } else {
    const nextIdx = (idx + 1) % 12;
    const nextYear = idx === 11 ? year + 1 : year;
    return {
      thai: `1 ${months[nextIdx].th} ${nextYear}`,
      eng: `1 ${months[nextIdx].en}`
    };
  }
}

export const PredictionHero: React.FC<PredictionHeroProps> = ({
  prediction,
  metrics,
  isOptimizing,
  onAutoTune,
  showParams,
  onToggleParams,
  onOpenTicket,
  latestDate,
  activePresetName
}) => {
  const nextSchedule = getNextDrawSchedule(latestDate);

  return (
    <div className="bg-gradient-to-b from-[#1a2028] to-[#14181f] border border-gray-800 rounded-xl p-4 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Optimizing Overlay */}
      {isOptimizing && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-yellow-500/20 border-t-yellow-400 rounded-full animate-spin" />
            <Bot size={20} className="text-yellow-400 absolute inset-0 m-auto" />
          </div>
          <span className="text-yellow-400 text-xs font-mono font-bold mt-3 tracking-widest uppercase animate-pulse">
            AI Quant Auto-Tuning Engine...
          </span>
          <span className="text-[10px] text-gray-400 font-mono mt-1">Brute-forcing 1,800+ digit combinations</span>
        </div>
      )}

      {/* Top Header - Strictly Single Row with No Wrapping */}
      <div className="flex justify-between items-center gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0 shrink-0">
          <Zap size={14} className="text-yellow-400 shrink-0" />
          <p className="text-gray-400 text-[11px] font-black uppercase tracking-wider whitespace-nowrap">
            Next Draw Forecast
          </p>
        </div>

        {/* Status badges guaranteed in a single row */}
        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 whitespace-nowrap shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="whitespace-nowrap">LIVE SIGNAL</span>
          </span>
          <span className="text-yellow-400 text-[10px] font-mono font-bold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20 flex items-center gap-1 whitespace-nowrap shrink-0">
            <Calendar size={11} className="shrink-0" />
            <span className="whitespace-nowrap">{nextSchedule.thai}</span>
          </span>
        </div>
      </div>

      {/* Active Strategy Pill Row */}
      <div className="bg-[#0e1217] border border-gray-800/80 rounded-lg px-2.5 py-1 mb-3.5 flex items-center justify-between text-[10px]">
        <span className="text-gray-500 flex items-center gap-1 font-bold uppercase tracking-wider shrink-0">
          <Sparkles size={11} className="text-yellow-400" />
          สูตรที่ใช้:
        </span>
        <span className="font-bold text-yellow-300 truncate max-w-[220px] text-right" title={activePresetName}>
          {activePresetName || 'สูตรเซียน'}
        </span>
      </div>

      {/* Prediction Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Top 3 Direct */}
        <div className="bg-[#0e1217] border border-gray-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">3 ตัวบน (Top 3)</span>
            <div className="flex items-center gap-1">
              <span className="text-emerald-400 text-[9px] font-bold font-mono">BUY</span>
              <span className="text-yellow-400 text-[9px] font-bold font-mono bg-yellow-500/10 px-1 rounded">{nextSchedule.eng}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <div className="flex gap-1.5">
              {prediction.digits.map((digit, idx) => (
                <span
                  key={idx}
                  className="w-10 h-12 bg-gradient-to-b from-[#252c37] to-[#181d24] border border-yellow-500/40 rounded flex items-center justify-center text-3xl font-mono font-black text-yellow-400 shadow-[0_0_12px_rgba(240,185,11,0.15)]"
                >
                  {digit}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 ml-1.5">ตรง</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-500 flex justify-between">
            <span>2 ตัวบน: <strong className="text-white font-mono">{prediction.top2}</strong></span>
            <span>โต๊ด: <strong className="text-gray-300 font-mono">{prediction.top3.split('').sort().join('')}</strong></span>
          </div>
        </div>

        {/* Bottom 2 */}
        <div className="bg-[#0e1217] border border-gray-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">2 ตัวล่าง (Bot 2)</span>
            <span className="text-[9px] text-emerald-400 font-mono font-bold">2 DIGITS</span>
          </div>
          <div className="flex items-baseline gap-1">
            <div className="flex gap-1.5">
              {prediction.botDigits.map((digit, idx) => (
                <span
                  key={idx}
                  className="w-10 h-12 bg-gradient-to-b from-[#252c37] to-[#181d24] border border-emerald-500/40 rounded flex items-center justify-center text-3xl font-mono font-black text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                >
                  {digit}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 ml-1.5">ตรง</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-500 flex justify-between">
            <span>กลับ: <strong className="text-white font-mono">{prediction.botDigits.slice().reverse().join('')}</strong></span>
            <span>รูด/วิ่ง: <strong className="text-gray-300 font-mono">{prediction.botDigits[0]}, {prediction.botDigits[1]}</strong></span>
          </div>
        </div>
      </div>

      {/* Statistics Performance */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#0d1014] rounded-lg border border-gray-800/80 mb-4 text-center">
        <div>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">3D Win Rate</p>
          <p className="text-sm font-mono font-black text-yellow-400">{metrics.exact3Rate.toFixed(1)}%</p>
          <span className="text-[9px] text-gray-500">{metrics.exact3Hits} จาก {metrics.totalDraws} งวด</span>
        </div>
        <div className="border-x border-gray-800">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Strike 1D+</p>
          <p className="text-sm font-mono font-black text-emerald-400">{metrics.hit1PlusTopRate.toFixed(1)}%</p>
          <span className="text-[9px] text-gray-500">{metrics.hit1PlusTop} จาก {metrics.totalDraws} งวด</span>
        </div>
        <div>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Overall Win</p>
          <p className="text-sm font-mono font-black text-blue-400">{metrics.winRate.toFixed(1)}%</p>
          <span className="text-[9px] text-gray-500">ตรง/โต๊ด/2 ตัว</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            playTerminalBeep(950, 0.08);
            onAutoTune();
          }}
          disabled={isOptimizing}
          className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wide transition-all shadow-[0_0_15px_rgba(240,185,11,0.25)] hover:shadow-[0_0_20px_rgba(240,185,11,0.4)] disabled:opacity-50"
        >
          <Bot size={15} />
          <span>🤖 AI Auto-Tune</span>
        </button>

        <button
          onClick={() => {
            playTerminalBeep(650);
            onOpenTicket();
          }}
          title="พิมพ์ / แชร์ใบแนวทาง"
          className="flex items-center justify-center gap-1 bg-[#1e2329] hover:bg-[#282e37] text-gray-200 hover:text-white px-3 py-2 rounded-lg text-xs font-bold border border-gray-700 transition-colors"
        >
          <Ticket size={14} className="text-yellow-400" />
          <span className="hidden sm:inline">ใบแนวทาง</span>
        </button>

        <button
          onClick={() => {
            playTerminalBeep(600);
            onToggleParams();
          }}
          title="ปรับแต่งตัวแปรสูตร"
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
            showParams
              ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(240,185,11,0.3)]'
              : 'bg-[#1e2329] hover:bg-[#282e37] text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          <Sliders size={16} />
        </button>
      </div>
    </div>
  );
};
