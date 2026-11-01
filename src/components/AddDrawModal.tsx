import React, { useState } from 'react';
import { X, Plus, AlertCircle, Globe, ClipboardPaste, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { LotteryDraw } from '../types';
import { playTerminalBeep, playSuccessChime } from '../utils/sound';
import { fetchOnlineLatestDraw, parseLottoText, formatThaiDateShort } from '../utils/onlineLottoSync';

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
  const [full6, setFull6] = useState('');
  const [pasteInput, setPasteInput] = useState('');
  const [isFetchingWeb, setIsFetchingWeb] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // ฟังก์ชันดึงผลจากเว็บออนไลน์
  const handleFetchOnline = async () => {
    setIsFetchingWeb(true);
    setStatusMsg({ type: 'info', text: 'กำลังเชื่อมต่อดึงผลสลากล่าสุดจากเว็บ (Sanook / Open API)...' });
    playTerminalBeep(850, 0.08);

    try {
      const result = await fetchOnlineLatestDraw();
      if (result) {
        setDate(result.date);
        setTop3(result.top3);
        setBot2(result.bot2);
        if (result.full6) setFull6(result.full6);
        setStatusMsg({
          type: 'success',
          text: `ดึงสำเร็จ! งวดวันที่ ${result.date} (รางวัลที่ 1: ${result.full6 || result.top3} | 2 ตัวล่าง: ${result.bot2})`
        });
        playSuccessChime();
      } else {
        setStatusMsg({
          type: 'error',
          text: 'ไม่สามารถดึงจากเว็บได้ในขณะนี้ กรุณาคัดลอกข้อความผลหวยมาวางในช่องด้านล่างได้ทันที'
        });
      }
    } catch {
      setStatusMsg({
        type: 'error',
        text: 'เกิดข้อผิดพลาดในการเชื่อมต่อเว็บภายนอก'
      });
    } finally {
      setIsFetchingWeb(false);
    }
  };

  // ฟังก์ชันแยกเลขอัตโนมัติจากข้อความที่วาง (Smart Paste & Parser)
  const handlePasteChange = (text: string) => {
    setPasteInput(text);
    if (!text.trim()) return;

    const parsed = parseLottoText(text);
    if (parsed) {
      if (parsed.date) setDate(parsed.date);
      if (parsed.top3) setTop3(parsed.top3);
      if (parsed.bot2) setBot2(parsed.bot2);
      if (parsed.full6) setFull6(parsed.full6);

      setStatusMsg({
        type: 'success',
        text: `ตรวจพบข้อมูล! งวด ${parsed.date || 'ล่าสุด'} | รางวัลที่ 1: ${parsed.full6 || parsed.top3} | 2 ตัวล่าง: ${parsed.bot2}`
      });
      playTerminalBeep(1100, 0.06);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normDate = formatThaiDateShort(date);
    if (!normDate) {
      setError('กรุณาระบุวันที่มีการออกรางวัล เช่น 1 พ.ย. 69');
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

    const noteText = full6 && full6.length === 6
      ? `รางวัลที่ 1: ${full6} | 2 ตัวท้าย: ${bot2}`
      : undefined;

    const newDraw: LotteryDraw = {
      id: Date.now(),
      drawNo: lastDrawNo + 1,
      date: normDate,
      top3: top3.trim(),
      bot2: bot2.trim(),
      full6: full6.trim() || undefined,
      note: noteText
    };

    onAddDraw(newDraw);
    playSuccessChime();
    setDate('');
    setTop3('');
    setBot2('');
    setFull6('');
    setPasteInput('');
    setStatusMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#181d24] border border-gray-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative text-white">
        {/* Header */}
        <div className="px-5 py-4 bg-[#1e2329] border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">เพิ่มข้อมูลงวดใหม่</h2>
              <p className="text-[10px] text-gray-400">ดึงสดจากเว็บ หรือวางข้อความผลหวยได้ทันที</p>
            </div>
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

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick Auto-Fetch from Web button */}
          <div className="bg-[#12161c] border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                <Globe size={13} />
                <span>ดึงจากเว็บออนไลน์อัตโนมัติ</span>
              </span>
              <button
                type="button"
                onClick={handleFetchOnline}
                disabled={isFetchingWeb}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black px-2.5 py-1 rounded text-xs font-black flex items-center gap-1 transition-all shadow-sm"
              >
                <RefreshCw size={12} className={isFetchingWeb ? 'animate-spin' : ''} />
                <span>{isFetchingWeb ? 'กำลังดึง...' : 'ดึงจากเว็บทันที'}</span>
              </button>
            </div>
            <p className="text-[10px] text-gray-400">
              ระบบจะเชื่อมต่อไปยัง Sanook / Public Lottery API เพื่อกรอกผลให้อัตโนมัติ
            </p>
          </div>

          {/* Smart Paste Input */}
          <div>
            <label className="text-[11px] font-bold text-yellow-400 flex items-center gap-1 mb-1">
              <ClipboardPaste size={12} />
              <span>หรือวางข้อความผลหวย (Smart Auto-Extract)</span>
            </label>
            <input
              type="text"
              placeholder="วางข้อความ เช่น '1 พ.ย. 69 รางวัลที่ 1 : 423224 เลขท้าย 2 ตัว : 85'"
              className="w-full bg-[#0e1217] border border-gray-700 focus:border-yellow-500 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none transition-colors"
              value={pasteInput}
              onChange={(e) => handlePasteChange(e.target.value)}
            />
          </div>

          {/* Status / feedback message */}
          {statusMsg && (
            <div
              className={`text-xs p-2.5 rounded-lg flex items-center gap-2 border ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : statusMsg.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 size={14} className="shrink-0" />
              ) : (
                <AlertCircle size={14} className="shrink-0" />
              )}
              <span className="text-[11px] leading-tight">{statusMsg.text}</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-2.5 flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Manual Input Fields (Pre-filled automatically) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">
                วันที่ออกรางวัล
              </label>
              <input
                type="text"
                placeholder="1 พ.ย. 69"
                className="w-full bg-[#0e1217] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-yellow-500 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">
                รางวัลที่ 1 (6 หลัก) <span className="text-[9px] text-gray-500 font-normal">ถ้ามี</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="423224"
                className="w-full bg-[#0e1217] border border-gray-700 rounded-lg px-3 py-2 text-xs text-center font-mono text-gray-300 placeholder-gray-600 focus:border-yellow-500 outline-none"
                value={full6}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFull6(val);
                  if (val.length === 6 && !top3) {
                    setTop3(val.slice(-3));
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-yellow-400 block mb-1">
                3 ตัวบน (3 หลัก)
              </label>
              <input
                type="text"
                maxLength={3}
                placeholder="224"
                className="w-full bg-[#0e1217] border border-yellow-500/40 rounded-lg px-3 py-2 text-center text-xl font-mono font-black text-yellow-400 placeholder-gray-700 focus:border-yellow-400 outline-none"
                value={top3}
                onChange={(e) => setTop3(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                2 ตัวล่าง (2 หลัก)
              </label>
              <input
                type="text"
                maxLength={2}
                placeholder="85"
                className="w-full bg-[#0e1217] border border-emerald-500/40 rounded-lg px-3 py-2 text-center text-xl font-mono font-black text-emerald-400 placeholder-gray-700 focus:border-emerald-400 outline-none"
                value={bot2}
                onChange={(e) => setBot2(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-xs font-bold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-2.5 rounded-lg text-xs font-black uppercase transition-all shadow-[0_0_12px_rgba(240,185,11,0.3)] flex items-center justify-center gap-1.5"
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
