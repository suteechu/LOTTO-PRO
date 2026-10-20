import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Trophy, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { playTerminalBeep, playSuccessChime } from '../utils/sound';
import { BacktestRow } from '../types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  // If historical draw is clicked:
  historicalRow?: BacktestRow | null;
  // If next upcoming draw:
  nextPrediction?: {
    top3: string;
    top2: string;
    bot2: string;
    digits: number[];
    botDigits: number[];
  };
  latestDate: string;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  historicalRow,
  nextPrediction,
  latestDate
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isHistorical = !!historicalRow;

  // Extract digits
  let top3 = '000';
  let bot2 = '00';
  let top2 = '00';
  let dateTitle = latestDate;
  let drawNoStr = '';

  if (isHistorical && historicalRow) {
    top3 = historicalRow.predTop3;
    bot2 = historicalRow.predBot2;
    top2 = historicalRow.predTop3.slice(1);
    dateTitle = historicalRow.date;
    drawNoStr = `งวดที่ #${historicalRow.drawNo}`;
  } else if (nextPrediction) {
    top3 = nextPrediction.top3;
    bot2 = nextPrediction.bot2;
    top2 = nextPrediction.top2;
    dateTitle = `งวดถัดไป (อิงงวด ${latestDate})`;
  }

  const d = top3.split('').map(c => parseInt(c, 10) || 0);
  const bd = bot2.split('').map(c => parseInt(c, 10) || 0);

  // Generate 6 permutations of 3 digits for Tod
  const todPermutations = Array.from(new Set([
    `${d[0]}${d[1]}${d[2]}`,
    `${d[0]}${d[2]}${d[1]}`,
    `${d[1]}${d[0]}${d[2]}`,
    `${d[1]}${d[2]}${d[0]}`,
    `${d[2]}${d[0]}${d[1]}`,
    `${d[2]}${d[1]}${d[0]}`,
  ]));

  const shareText = isHistorical && historicalRow ?
`🎫 บันทึกใบแนวทางย้อนหลัง LOTTO-PRO TERMINAL
━━━━━━━━━━━━━━━━━━
📅 งวดประจำวันที่: ${historicalRow.date} (#${historicalRow.drawNo})

🎯 ผลคำนวณทำนาย:
🏆 3 ตัวบนตรง: ${historicalRow.predTop3}
🔄 ชุดโต๊ด: ${todPermutations.join(', ')}
⭐ 2 ตัวบน: ${top2} | 🌟 2 ตัวล่าง: ${bot2}
⚡ เลขวิ่ง: บน (${d[1]}, ${d[2]}) | ล่าง (${bd[0]}, ${bd[1]})

📌 ผลการออกรางวัลจริง:
• รางวัลที่ 1 (3 ตัวบน): ${historicalRow.actualTop3}
• เลขท้าย 2 ตัวล่าง: ${historicalRow.actualBot2}
• สถานะ: ${historicalRow.is3Exact ? '🎯 ถูก 3 ตัวตรง JACKPOT!' : historicalRow.is3Tod ? '🔄 ถูก 3 ตัวโต๊ด!' : historicalRow.is2TopExact ? '⭐ ถูก 2 ตัวบน!' : historicalRow.is2BotExact ? '⭐ ถูก 2 ตัวล่าง!' : historicalRow.matchedTopCount > 0 ? `✨ เข้าเลขวิ่ง ${historicalRow.matchedTopCount} ตัว` : 'หลุดเป้า'}
━━━━━━━━━━━━━━━━━━
🤖 บันทึกจาก LOTTO-PRO Quantitative Engine`
:
`🎯 แนวทางสลากกินแบ่งรัฐบาล LOTTO-PRO TERMINAL
━━━━━━━━━━━━━━━━━━
✨ ประจำงวดถัดไป (${dateTitle})

🏆 3 ตัวบนตรง: ${top3}
🔄 ชุดโต๊ด: ${todPermutations.join(', ')}

⭐ 2 ตัวบน: ${top2}
🌟 2 ตัวล่าง: ${bot2}
🔁 กลับล่าง: ${bd.slice().reverse().join('')}

⚡ เลขวิ่งบน: ${d[1]}, ${d[2]}
⚡ เลขวิ่งล่าง: ${bd[0]}, ${bd[1]}
━━━━━━━━━━━━━━━━━━
🤖 วิเคราะห์เชิงสถิติด้วย LOTTO-PRO Quant AI Engine`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    playSuccessChime();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#181d24] border border-yellow-500/30 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative text-white max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            playTerminalBeep(500);
            onClose();
          }}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-gray-400 hover:text-white flex items-center justify-center transition-colors z-10"
        >
          <X size={16} />
        </button>

        {/* Ticket Header Graphic */}
        <div className={`px-6 py-4 text-black ${
          isHistorical
            ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600'
            : 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase bg-black/10 px-2 py-0.5 rounded">
                {isHistorical ? 'HISTORICAL BACKTEST TICKET' : 'OFFICIAL PREDICTION SLIP'}
              </span>
              <h2 className="text-xl font-black tracking-tight mt-0.5">
                LOTTO-PRO TICKET
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-bold block opacity-80">
                {isHistorical ? drawNoStr : 'ALGO ENGINE v3.5'}
              </span>
              <span className="text-xs font-black font-mono">
                {isHistorical ? 'VERIFIED LOG' : 'CONFIDENTIAL'}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated separator */}
        <div className="relative border-b-2 border-dashed border-gray-700 bg-[#12161c] px-4 py-1.5 flex justify-between text-[11px] font-mono text-gray-400">
          <span className="flex items-center gap-1 font-bold text-gray-300">
            <Calendar size={12} className="text-yellow-400" /> {dateTitle}
          </span>
          <span className="text-yellow-400 font-bold">
            {isHistorical ? 'BACKTEST RECORD' : 'STATUS: LIVE'}
          </span>
        </div>

        {/* Ticket Scrollable Body */}
        <div className="p-5 space-y-3.5 overflow-y-auto flex-1 scrollbar-thin">
          {/* If Historical: Actual vs Pred Comparison Banner */}
          {isHistorical && historicalRow && (
            <div className="bg-[#0e1217] border border-gray-800 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-800">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  ตรวจผลสลากจริงประจำงวดนี้
                </span>
                <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-full ${
                  historicalRow.simulatedPnL > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'
                }`}>
                  P&L: {historicalRow.simulatedPnL > 0 ? `+${historicalRow.simulatedPnL.toLocaleString()}` : `${historicalRow.simulatedPnL}`} ฿
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-[#14181f] p-2 rounded-lg border border-gray-800">
                  <span className="text-[10px] text-gray-400 block mb-0.5">ผลสลากจริง</span>
                  <div className="flex justify-center items-center gap-1.5 font-mono">
                    <span className="font-bold text-sm text-yellow-300 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                      บน: {historicalRow.actualTop3}
                    </span>
                    <span className="font-bold text-xs text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      ล่าง: {historicalRow.actualBot2}
                    </span>
                  </div>
                </div>

                <div className="bg-[#14181f] p-2 rounded-lg border border-gray-800">
                  <span className="text-[10px] text-gray-400 block mb-0.5">สูตรคำนวณไว้</span>
                  <div className="flex justify-center items-center gap-1.5 font-mono">
                    <span className="font-bold text-sm text-white bg-black/40 px-1.5 py-0.5 rounded">
                      {historicalRow.predTop3}
                    </span>
                    <span className="font-bold text-xs text-white bg-black/40 px-1.5 py-0.5 rounded">
                      {historicalRow.predBot2}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Outcome */}
              <div className="mt-2.5 pt-2 border-t border-gray-800 flex justify-center">
                {historicalRow.is3Exact ? (
                  <span className="text-xs font-black text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.4)] flex items-center gap-1.5">
                    <Trophy size={14} /> 🎯 JACKPOT 3 ตัวตรง! (+9,000 บาท)
                  </span>
                ) : historicalRow.is3Tod ? (
                  <span className="text-xs font-black text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1">
                    🔄 ถูก 3 ตัวโต๊ด (+3,000 บาท)
                  </span>
                ) : historicalRow.is2TopExact ? (
                  <span className="text-xs font-black text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1">
                    ⭐ ถูก 2 ตัวบนตรง (+3,150 บาท)
                  </span>
                ) : historicalRow.is2BotExact ? (
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    ⭐ ถูก 2 ตัวล่างตรง (+3,150 บาท)
                  </span>
                ) : historicalRow.matchedTopCount > 0 ? (
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    ✨ เข้าเลขวิ่งบน {historicalRow.matchedTopCount} ตัว
                  </span>
                ) : (
                  <span className="text-xs font-medium text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                    หลุดเป้าในงวดนี้
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Main 3D Box */}
          <div className="text-center bg-[#0d1014] border border-yellow-500/30 rounded-xl p-3.5 shadow-inner">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              3 ตัวบน ตรง-เต็ง
            </span>
            <div className="text-5xl font-mono font-black text-yellow-400 tracking-wider my-2 drop-shadow-[0_0_15px_rgba(240,185,11,0.35)]">
              {top3}
            </div>
            <div className="flex justify-center gap-1.5 flex-wrap text-xs font-mono text-gray-300">
              <span className="text-gray-500">ชุดโต๊ด:</span>
              {todPermutations.map(item => (
                <span key={item} className="bg-[#1e2329] px-1.5 py-0.5 rounded border border-gray-800 text-yellow-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 2D Pairs Box */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0d1014] border border-gray-800 rounded-xl p-2.5 text-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase">2 ตัวบน</span>
              <div className="text-2xl font-mono font-black text-cyan-400 my-0.5">
                {top2}
              </div>
              <span className="text-[10px] text-gray-500 font-mono">กลับ: {top2.split('').reverse().join('')}</span>
            </div>

            <div className="bg-[#0d1014] border border-gray-800 rounded-xl p-2.5 text-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase">2 ตัวล่าง</span>
              <div className="text-2xl font-mono font-black text-emerald-400 my-0.5">
                {bot2}
              </div>
              <span className="text-[10px] text-gray-500 font-mono">กลับ: {bd.slice().reverse().join('')}</span>
            </div>
          </div>

          {/* Running digits */}
          <div className="bg-[#14181f] p-2.5 rounded-xl border border-gray-800 flex justify-between items-center text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">เลขวิ่งบน</span>
              <span className="font-mono font-bold text-yellow-400 text-sm">
                {d[1]}, {d[2]}
              </span>
            </div>
            <div className="h-5 w-px bg-gray-800" />
            <div className="text-right">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">เลขวิ่งล่าง</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {bd[0]}, {bd[1]}
              </span>
            </div>
          </div>

          {/* Barcode Mock */}
          <div className="pt-1 text-center">
            <div className="font-mono tracking-[0.35em] text-[10px] text-gray-500 uppercase overflow-hidden whitespace-nowrap">
              ||| | ||||| || |||||| | ||| || |||| ||| |||||
            </div>
            <p className="text-[9px] text-gray-600 mt-1">LOTTO-PRO QUANT ALGORITHM • BACKTEST TICKET</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#12161c] px-5 py-3 border-t border-gray-800 flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs transition-all shadow-md ${
              copied
                ? 'bg-emerald-500 text-black'
                : 'bg-yellow-500 hover:bg-yellow-400 text-black'
            }`}
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>คัดลอกข้อความสำเร็จ!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>คัดลอกส่งไลน์ / Facebook</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
