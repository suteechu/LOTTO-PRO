import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Plus, RefreshCw, Download, Sparkles, Terminal, RefreshCcw, ExternalLink } from 'lucide-react';
import { isSoundEnabled, toggleSound, playTerminalBeep } from '../utils/sound';

interface NavbarProps {
  onOpenAddModal: () => void;
  onResetData: () => void;
  onExportCSV: () => void;
  onOpenPresets: () => void;
  onAutoSync: () => void;
  drawCount: number;
  latestDate: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onResetData,
  onExportCSV,
  onOpenPresets,
  onAutoSync,
  drawCount,
  latestDate
}) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
    if (nextState) playTerminalBeep(900, 0.08);
  };

  return (
    <nav className="border-b border-gray-800 bg-[#12161c] px-3 sm:px-6 py-2.5 flex flex-wrap justify-between items-center sticky top-0 z-40 backdrop-blur-md bg-opacity-95 shadow-md">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center text-black font-black text-base shadow-[0_0_15px_rgba(240,185,11,0.45)]">
          L
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight uppercase text-white flex items-center gap-1.5">
              LOTTO-PRO <span className="text-yellow-400 text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/30">v3.5 PRO</span>
            </h1>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              AUTO-SYNC: {latestDate}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 hidden sm:block">Quantitative Thai Lottery Backtesting & Auto-Optimizer</p>
        </div>
      </div>

      {/* Center live metrics & Thairath Link */}
      <div className="hidden lg:flex items-center gap-3 bg-[#1a1f26] border border-gray-800 px-3 py-1 rounded-md text-xs font-mono">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Terminal size={12} className="text-yellow-400" />
          <span>DATASET: <strong className="text-white">{drawCount} งวด</strong></span>
        </div>
        <div className="h-3 w-px bg-gray-700" />
        <a
          href="https://www.thairath.co.th/lottery/archive"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-yellow-400 flex items-center gap-1 transition-colors text-[11px]"
          title="เปิดตรวจสอบสถิติหวยย้อนหลัง Thairath.co.th"
        >
          <span>อ้างอิง: ไทยรัฐ</span>
          <ExternalLink size={11} />
        </a>
        <div className="h-3 w-px bg-gray-700" />
        <div className="text-gray-400">
          BKK: <strong className="text-yellow-400">{time || '--:--:--'}</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Auto Sync Button */}
        <button
          onClick={() => {
            playTerminalBeep(900);
            onAutoSync();
          }}
          title="ซิงค์และตรวจงวดใหม่อัตโนมัติตามไทยรัฐ"
          className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded text-xs font-bold transition-all"
        >
          <RefreshCcw size={13} className="animate-spin-hover" />
          <span className="hidden sm:inline">Auto-Sync</span>
        </button>

        <button
          onClick={handleToggleSound}
          title={soundOn ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
          className="p-1.5 sm:p-2 rounded bg-[#1e2329] hover:bg-[#2b3139] border border-gray-700 text-gray-400 hover:text-yellow-400 transition-colors"
        >
          {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        <button
          onClick={() => {
            playTerminalBeep(700);
            onOpenPresets();
          }}
          className="flex items-center gap-1.5 bg-[#1e2329] hover:bg-[#2b3139] text-gray-300 hover:text-white px-2.5 py-1.5 rounded text-xs font-medium border border-gray-700 transition-colors"
        >
          <Sparkles size={13} className="text-yellow-400" />
          <span className="hidden sm:inline">สูตรเซียน</span>
        </button>

        <button
          onClick={() => {
            playTerminalBeep(750);
            onOpenAddModal();
          }}
          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-400 text-black px-2.5 py-1.5 rounded text-xs font-bold transition-all shadow-[0_0_12px_rgba(234,179,8,0.3)]"
        >
          <Plus size={14} strokeWidth={3} />
          <span>เพิ่มงวด</span>
        </button>

        <button
          onClick={() => {
            playTerminalBeep(600);
            onExportCSV();
          }}
          title="ดาวน์โหลด CSV สถิติ"
          className="p-1.5 sm:p-2 rounded bg-[#1e2329] hover:bg-[#2b3139] border border-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          <Download size={15} />
        </button>

        <button
          onClick={() => {
            if (window.confirm('คุณต้องการรีเซ็ตข้อมูลสถิติกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
              playTerminalBeep(400);
              onResetData();
            }
          }}
          title="รีเซ็ตฐานข้อมูลเดิม"
          className="p-1.5 sm:p-2 rounded bg-[#1e2329] hover:bg-[#2b3139] border border-gray-700 text-gray-400 hover:text-rose-400 transition-colors"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </nav>
  );
};
