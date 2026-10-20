import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles } from 'lucide-react';
import { playTerminalBeep, playSuccessChime } from '../utils/sound';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: {
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
  prediction,
  latestDate
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate 6 permutations of 3 digits for Tod
  const d = prediction.digits;
  const todPermutations = Array.from(new Set([
    `${d[0]}${d[1]}${d[2]}`,
    `${d[0]}${d[2]}${d[1]}`,
    `${d[1]}${d[0]}${d[2]}`,
    `${d[1]}${d[2]}${d[0]}`,
    `${d[2]}${d[0]}${d[1]}`,
    `${d[2]}${d[1]}${d[0]}`,
  ]));

  const shareText = `🎯 แนวทางสลากกินแบ่งรัฐบาล LOTTO-PRO TERMINAL
━━━━━━━━━━━━━━━━━━
✨ ประจำงวดถัดไป (อิงงวดล่าสุด ${latestDate})

🏆 3 ตัวบนตรง: ${prediction.top3}
🔄 ชุดโต๊ด: ${todPermutations.join(', ')}

⭐ 2 ตัวบน: ${prediction.top2}
🌟 2 ตัวล่าง: ${prediction.bot2}
🔁 กลับล่าง: ${prediction.botDigits.slice().reverse().join('')}

⚡ เลขวิ่งบน: ${prediction.digits.slice(1).join(', ')}
⚡ เลขวิ่งล่าง: ${prediction.botDigits.join(', ')}
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
      <div className="bg-[#181d24] border border-yellow-500/30 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative text-white">
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
        <div className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-black px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase bg-black/10 px-2 py-0.5 rounded">
                Official Prediction Slip
              </span>
              <h2 className="text-xl font-black tracking-tight mt-0.5">LOTTO-PRO TICKET</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-bold block opacity-80">ALGO ENGINE v3.5</span>
              <span className="text-xs font-black font-mono">CONFIDENTIAL</span>
            </div>
          </div>
        </div>

        {/* Perforated separator */}
        <div className="relative border-b-2 border-dashed border-gray-700 bg-[#12161c] px-4 py-1.5 flex justify-between text-[10px] font-mono text-gray-400">
          <span>อิงข้อมูลงวด: {latestDate}</span>
          <span className="text-yellow-400 font-bold">STATUS: VERIFIED</span>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-4">
          {/* Main 3D Box */}
          <div className="text-center bg-[#0d1014] border border-yellow-500/30 rounded-xl p-4 shadow-inner">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              3 ตัวบน ตรง-เต็ง
            </span>
            <div className="text-6xl font-mono font-black text-yellow-400 tracking-wider my-2 drop-shadow-[0_0_15px_rgba(240,185,11,0.35)]">
              {prediction.top3}
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
            <div className="bg-[#0d1014] border border-gray-800 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase">2 ตัวบน</span>
              <div className="text-3xl font-mono font-black text-cyan-400 my-1">
                {prediction.top2}
              </div>
              <span className="text-[10px] text-gray-500 font-mono">กลับ: {prediction.top2.split('').reverse().join('')}</span>
            </div>

            <div className="bg-[#0d1014] border border-gray-800 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase">2 ตัวล่าง</span>
              <div className="text-3xl font-mono font-black text-emerald-400 my-1">
                {prediction.bot2}
              </div>
              <span className="text-[10px] text-gray-500 font-mono">กลับ: {prediction.botDigits.slice().reverse().join('')}</span>
            </div>
          </div>

          {/* Running digits */}
          <div className="bg-[#14181f] p-3 rounded-xl border border-gray-800 flex justify-between items-center text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">เลขวิ่งบน</span>
              <span className="font-mono font-bold text-yellow-400 text-base">
                {prediction.digits[1]}, {prediction.digits[2]}
              </span>
            </div>
            <div className="h-6 w-px bg-gray-800" />
            <div className="text-right">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">เลขวิ่งล่าง</span>
              <span className="font-mono font-bold text-emerald-400 text-base">
                {prediction.botDigits[0]}, {prediction.botDigits[1]}
              </span>
            </div>
          </div>

          {/* Barcode Mock */}
          <div className="pt-2 text-center">
            <div className="font-mono tracking-[0.35em] text-[10px] text-gray-500 uppercase overflow-hidden whitespace-nowrap">
              ||| | ||||| || |||||| | ||| || |||| ||| |||||
            </div>
            <p className="text-[9px] text-gray-600 mt-1">LOTTO-PRO QUANT ALGORITHM • USE AT OWN DISCRETION</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#12161c] px-6 py-3.5 border-t border-gray-800 flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
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
