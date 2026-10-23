import React, { useState } from 'react';
import { BacktestRow } from '../types';
import { Search, Filter, Trophy, Ticket, ExternalLink } from 'lucide-react';
import { playTerminalBeep } from '../utils/sound';

interface BacktestTableProps {
  rows: BacktestRow[];
  onSelectRowTicket: (row: BacktestRow) => void;
}

type FilterType = 'all' | 'exact3' | 'tod3' | 'hit2' | 'hit1' | 'miss';

export const BacktestTable: React.FC<BacktestTableProps> = ({ rows, onSelectRowTicket }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredRows = rows.filter(row => {
    // Search match
    if (search.trim()) {
      const q = search.trim();
      const match =
        row.date.includes(q) ||
        row.actualTop3.includes(q) ||
        row.actualBot2.includes(q) ||
        row.predTop3.includes(q) ||
        row.predBot2.includes(q);
      if (!match) return false;
    }

    // Filter type match
    if (filter === 'exact3') return row.is3Exact;
    if (filter === 'tod3') return row.is3Tod;
    if (filter === 'hit2') return row.is2TopExact || row.is2TopRev || row.is2BotExact || row.is2BotRev;
    if (filter === 'hit1') return row.matchedTopCount >= 1 || row.matchedBotCount >= 1;
    if (filter === 'miss') return !row.is3Exact && !row.is3Tod && !row.is2TopExact && !row.is2TopRev && !row.is2BotExact && !row.is2BotRev && row.matchedTopCount === 0;

    return true;
  });

  return (
    <div className="bg-[#14181f] border border-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      {/* Header & Controls */}
      <div className="px-4 py-3 bg-[#1a2028] border-b border-gray-800 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-yellow-400" />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-gray-200">
            Backtest Execution Log (บันทึกผลย้อนหลัง)
          </h3>
          <span className="text-[10px] text-gray-400 font-mono bg-black/40 px-2 py-0.5 rounded border border-gray-800">
            {filteredRows.length} / {rows.length} รายการ
          </span>
        </div>

        {/* Search & Notice */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[10px] text-yellow-400/80 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
            💡 คลิกที่วันที่ เพื่อเปิดใบแนวทาง
          </span>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="ค้นหาวันที่, ตัวเลข..."
              className="bg-[#0e1217] border border-gray-700 rounded-lg pl-7 pr-2.5 py-1 text-xs text-white placeholder-gray-500 focus:border-yellow-500 outline-none w-36 sm:w-44"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-1.5 bg-[#0e1217] border-b border-gray-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
        <span className="text-gray-500 flex items-center gap-1 font-bold text-[10px] mr-1">
          <Filter size={11} /> ฟิลเตอร์:
        </span>
        {[
          { id: 'all' as FilterType, label: 'ทั้งหมด' },
          { id: 'exact3' as FilterType, label: '🎯 3 ตัวตรง' },
          { id: 'tod3' as FilterType, label: '🔄 3 ตัวโต๊ด' },
          { id: 'hit2' as FilterType, label: '⭐ 2 ตัวบน/ล่าง' },
          { id: 'hit1' as FilterType, label: '✨ วิ่ง 1D+' },
          { id: 'miss' as FilterType, label: '❌ หลุด' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              playTerminalBeep(750, 0.03);
              setFilter(tab.id);
            }}
            className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition-colors ${
              filter === tab.id
                ? 'bg-[#2b3139] text-yellow-400 border border-yellow-500/40'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1 max-h-[560px] scrollbar-thin">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead className="text-[10px] text-gray-400 uppercase font-black border-b border-gray-800 sticky top-0 bg-[#12161c] z-10">
            <tr>
              <th className="px-4 py-2.5">
                <span className="flex items-center gap-1">
                  งวดที่ / วันที่ <Ticket size={11} className="text-yellow-400" />
                </span>
              </th>
              <th className="px-4 py-2.5">ผลจริง (บน / ล่าง)</th>
              <th className="px-4 py-2.5">คำนวณทำนาย (Pred)</th>
              <th className="px-4 py-2.5">สถานะรางวัล</th>
              <th className="px-4 py-2.5 text-right">กำไรจำลอง (P&L)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40 font-mono">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500 font-sans text-xs">
                  ไม่พบข้อมูลตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              filteredRows.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#1a2028]/60 transition-colors group">
                  {/* Interactive Date & Draw Clickable */}
                  <td
                    className="px-4 py-2 whitespace-nowrap cursor-pointer select-none"
                    onClick={() => {
                      playTerminalBeep(850, 0.06);
                      onSelectRowTicket(item);
                    }}
                    title="คลิกเพื่อเปิดใบแนวทาง (Prediction Ticket) ประจำงวดนี้"
                  >
                    <div className="flex items-center gap-1.5 group-hover:text-yellow-400 transition-colors">
                      <span className="font-bold text-gray-200 group-hover:text-yellow-400 font-sans text-xs group-hover:underline decoration-yellow-400/50 underline-offset-4 flex items-center gap-1">
                        <Ticket size={12} className="text-gray-500 group-hover:text-yellow-400 shrink-0" />
                        {item.date}
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono bg-black/40 px-1 py-0.5 rounded border border-gray-800 group-hover:border-yellow-500/30">
                        #{item.drawNo}
                      </span>
                    </div>
                  </td>

                  {/* Actual */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-yellow-300 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
                        {item.actualTop3}
                      </span>
                      <span className="font-bold text-xs text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {item.actualBot2}
                      </span>
                    </div>
                  </td>

                  {/* Prediction with highlighted digits */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm tracking-wider">
                      {/* Top 3 Pred */}
                      <span className="bg-[#0e1217] px-2 py-0.5 rounded border border-gray-800 flex gap-0.5">
                        {item.predTop3.split('').map((char, i) => {
                          const isMatch = char === item.actualTop3[i];
                          return (
                            <span
                              key={i}
                              className={`font-black ${
                                isMatch ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'text-gray-600'
                              }`}
                            >
                              {char}
                            </span>
                          );
                        })}
                      </span>

                      {/* Bot 2 Pred */}
                      <span className="bg-[#0e1217] px-2 py-0.5 rounded border border-gray-800 flex gap-0.5 text-xs">
                        {item.predBot2.split('').map((char, i) => {
                          const isMatch = char === item.actualBot2[i];
                          return (
                            <span
                              key={i}
                              className={`font-black ${
                                isMatch ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'text-gray-600'
                              }`}
                            >
                              {char}
                            </span>
                          );
                        })}
                      </span>
                    </div>
                  </td>

                  {/* Performance Badges */}
                  <td className="px-4 py-2 whitespace-nowrap font-sans">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.is3Exact && (
                        <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                          🎯 JACKPOT 3D
                        </span>
                      )}
                      {item.is3Tod && (
                        <span className="text-[10px] font-black text-yellow-400 bg-yellow-500/15 px-2 py-0.5 rounded-full border border-yellow-500/30">
                          🔄 โต๊ด 3D
                        </span>
                      )}
                      {item.is2TopExact && (
                        <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-500/30">
                          ⭐ 2 ตัวบนตรง
                        </span>
                      )}
                      {item.is2TopRev && (
                        <span className="text-[10px] font-black text-sky-300 bg-sky-500/15 px-2 py-0.5 rounded-full border border-sky-500/30">
                          🔁 2 บนกลับ
                        </span>
                      )}
                      {item.is2BotExact && (
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          ⭐ 2 ตัวล่างตรง
                        </span>
                      )}
                      {item.is2BotRev && (
                        <span className="text-[10px] font-black text-teal-300 bg-teal-500/15 px-2 py-0.5 rounded-full border border-teal-500/30">
                          🔁 2 ล่างกลับ
                        </span>
                      )}
                      {!item.is3Exact && !item.is3Tod && !item.is2TopExact && !item.is2TopRev && !item.is2BotExact && !item.is2BotRev && item.matchedTopCount > 0 && (
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          เข้า {item.matchedTopCount} ตัวบน
                        </span>
                      )}
                      {!item.is3Exact && !item.is3Tod && !item.is2TopExact && !item.is2TopRev && !item.is2BotExact && !item.is2BotRev && item.matchedBotCount > 0 && (
                        <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          เข้า {item.matchedBotCount} ตัวล่าง
                        </span>
                      )}
                      {!item.is3Exact && !item.is3Tod && !item.is2TopExact && !item.is2TopRev && !item.is2BotExact && !item.is2BotRev && item.matchedTopCount === 0 && item.matchedBotCount === 0 && (
                        <span className="text-gray-500 text-[10px] font-medium bg-gray-900/60 px-2 py-0.5 rounded border border-gray-800">
                          หลุดเป้า
                        </span>
                      )}
                    </div>
                  </td>

                  {/* P&L */}
                  <td className="px-4 py-2 whitespace-nowrap text-right font-mono">
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-bold ${item.simulatedPnL > 0 ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {item.simulatedPnL > 0 ? `+${item.simulatedPnL.toLocaleString()}` : `${item.simulatedPnL}`} ฿
                      </span>
                      <span className="text-[9px] text-gray-500">
                        สะสม: {item.cumulativePnL.toLocaleString()} ฿
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
