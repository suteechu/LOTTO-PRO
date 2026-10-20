import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { LotteryDraw } from '../types';
import { playTerminalBeep, playSuccessChime } from '../utils/sound';

interface AddDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDraw: (newDraw: LotteryDraw) => void;
  lastDrawNo: number;
}

export const AddDrawModal: React.FC<AddDrawModalProps> = ({
  isOpen,
  onClose,
  onAddDraw,
  lastDrawNo
}) => {
  const [date, setDate] = useState('');
  const [top3, setTop3] = useState('');
  const [bot2, setBot2] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!date.trim()) {
      setError('กรุณาระบุวันที่มีการออกรางวัล เช่น 1 ก.ย. 69');
      return;
    }

    if (!/^\d{3}$/.test(top3)) {
      setError('กรุณากรอกเลข 3 ตัวบน ให้ครบ 3 หลัก (000-999)');
      return;
    }

    if (!/^\d{2}$/.test(bot2)) {
      setError('กรุณากรอกเลข 2 ตัวล่าง ให้ครบ 2 หลัก (00-99)');
      return;
    }

    const newDraw: LotteryDraw = {
      id: Date.now(),
      drawNo: lastDrawNo + 1,
      date: date.trim(),
      top3: top3.trim(),
      bot2: bot2.trim()
    };

    onAddDraw(newDraw);
    playSuccessChime();
    setDate('');
    setTop3('');
    setBot2('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#181d24] border border-gray-700 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden relative text-white">
        {/* Header */}
        <div className="px-5 py-4 bg-[#1e2329] border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
              +
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">เพิ่มข้อมูลงวดใหม่</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-2.5 flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1">
              วันที่ออกรางวัล (เช่น 1 ก.ย. 69, 16 ก.ย. 69)
            </label>
            <input
              type="text"
              placeholder="1 ก.ย. 69"
              className="w-full bg-[#0e1217] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-yellow-500 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-yellow-400 block mb-1">
                เลข 3 ตัวบน (3 หลัก)
              </label>
              <input
                type="text"
                maxLength={3}
                placeholder="530"
                className="w-full bg-[#0e1217] border border-yellow-500/40 rounded-lg px-3 py-2 text-center text-xl font-mono font-black text-yellow-400 placeholder-gray-700 focus:border-yellow-400 outline-none"
                value={top3}
                onChange={(e) => setTop3(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                เลข 2 ตัวล่าง (2 หลัก)
              </label>
              <input
                type="text"
                maxLength={2}
                placeholder="42"
                className="w-full bg-[#0e1217] border border-emerald-500/40 rounded-lg px-3 py-2 text-center text-xl font-mono font-black text-emerald-400 placeholder-gray-700 focus:border-emerald-400 outline-none"
                value={bot2}
                onChange={(e) => setBot2(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-lg text-xs font-black uppercase transition-all shadow-[0_0_12px_rgba(240,185,11,0.3)] flex items-center justify-center gap-1.5"
            >
              <Plus size={14} strokeWidth={3} />
              <span>บันทึกงวดใหม่</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
