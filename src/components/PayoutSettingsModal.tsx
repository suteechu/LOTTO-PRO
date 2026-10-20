import React, { useState } from 'react';
import { X, DollarSign, Check, RotateCcw } from 'lucide-react';
import { PayoutConfig, DEFAULT_PAYOUT_CONFIG } from '../types';
import { playTerminalBeep, playSuccessChime } from '../utils/sound';

interface PayoutSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payoutConfig: PayoutConfig;
  onSavePayoutConfig: (cfg: PayoutConfig) => void;
}

export const PayoutSettingsModal: React.FC<PayoutSettingsModalProps> = ({
  isOpen,
  onClose,
  payoutConfig,
  onSavePayoutConfig
}) => {
  const [localCfg, setLocalCfg] = useState<PayoutConfig>(payoutConfig);

  if (!isOpen) return null;

  const totalBet = localCfg.betDirect3D + localCfg.betTod3D + localCfg.betTop2D + localCfg.betBot2D;

  const handleSave = () => {
    onSavePayoutConfig(localCfg);
    playSuccessChime();
    onClose();
  };

  const handleReset = () => {
    setLocalCfg(DEFAULT_PAYOUT_CONFIG);
    playTerminalBeep(500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#181d24] border border-gray-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative text-white">
        {/* Header */}
        <div className="px-5 py-4 bg-[#1e2329] border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-yellow-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              ตั้งค่าอัตราจ่าย & เงินเดิมพันจำลอง
            </h2>
          </div>
          <button
            onClick={() => {
              playTerminalBeep(500);
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              อัตราจ่ายเงินรางวัล (บาทละ)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#0e1217] p-2.5 rounded-lg border border-yellow-500/30">
                <label className="text-[10px] text-gray-400 block mb-1">3 ตัวตรง</label>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-xs text-gray-500 font-bold">฿</span>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-transparent text-sm font-black text-yellow-400 outline-none"
                    value={localCfg.direct3D}
                    onChange={(e) => setLocalCfg({ ...localCfg, direct3D: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="bg-[#0e1217] p-2.5 rounded-lg border border-yellow-500/20">
                <label className="text-[10px] text-gray-400 block mb-1">3 ตัวโต๊ด</label>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-xs text-gray-500 font-bold">฿</span>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-transparent text-sm font-black text-yellow-300 outline-none"
                    value={localCfg.tod3D}
                    onChange={(e) => setLocalCfg({ ...localCfg, tod3D: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="bg-[#0e1217] p-2.5 rounded-lg border border-emerald-500/30">
                <label className="text-[10px] text-gray-400 block mb-1">2 ตัว (บน/ล่าง)</label>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-xs text-gray-500 font-bold">฿</span>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-transparent text-sm font-black text-emerald-400 outline-none"
                    value={localCfg.direct2D}
                    onChange={(e) => setLocalCfg({ ...localCfg, direct2D: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                สัดส่วนจำลองเดิมพันต่องวด
              </span>
              <span className="text-xs font-mono font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                รวมงวดละ: {totalBet} บาท
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-[#0e1217] p-2 rounded-lg border border-gray-800">
                <span className="text-[10px] text-gray-400 block mb-1">แทง 3 ตรง</span>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-[#161a22] border border-gray-700 rounded px-1.5 py-1 text-center font-bold text-white outline-none focus:border-yellow-400"
                  value={localCfg.betDirect3D}
                  onChange={(e) => setLocalCfg({ ...localCfg, betDirect3D: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="bg-[#0e1217] p-2 rounded-lg border border-gray-800">
                <span className="text-[10px] text-gray-400 block mb-1">แทง โต๊ด</span>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-[#161a22] border border-gray-700 rounded px-1.5 py-1 text-center font-bold text-white outline-none focus:border-yellow-400"
                  value={localCfg.betTod3D}
                  onChange={(e) => setLocalCfg({ ...localCfg, betTod3D: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="bg-[#0e1217] p-2 rounded-lg border border-gray-800">
                <span className="text-[10px] text-gray-400 block mb-1">แทง 2 บน</span>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-[#161a22] border border-gray-700 rounded px-1.5 py-1 text-center font-bold text-white outline-none focus:border-yellow-400"
                  value={localCfg.betTop2D}
                  onChange={(e) => setLocalCfg({ ...localCfg, betTop2D: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="bg-[#0e1217] p-2 rounded-lg border border-gray-800">
                <span className="text-[10px] text-gray-400 block mb-1">แทง 2 ล่าง</span>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-[#161a22] border border-gray-700 rounded px-1.5 py-1 text-center font-bold text-white outline-none focus:border-yellow-400"
                  value={localCfg.betBot2D}
                  onChange={(e) => setLocalCfg({ ...localCfg, betBot2D: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#12161c] border-t border-gray-800 flex justify-between gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded bg-gray-800/80 hover:bg-gray-800 transition-colors"
          >
            <RotateCcw size={12} />
            <span>รีเซ็ตมาตรฐาน (500/100/70)</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all shadow-[0_0_12px_rgba(240,185,11,0.3)]"
          >
            <Check size={14} strokeWidth={3} />
            <span>บันทึกอัตราจ่าย</span>
          </button>
        </div>
      </div>
    </div>
  );
};
