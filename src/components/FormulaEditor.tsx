import React from 'react';
import { FormulaState, VariableId } from '../types';
import { VARIABLES } from '../data/lotteryData';
import { RotateCcw, HelpCircle } from 'lucide-react';
import { playTerminalBeep } from '../utils/sound';

interface FormulaEditorProps {
  formula: FormulaState;
  onChangeFormula: (updater: (prev: FormulaState) => FormulaState) => void;
  onResetFormula: () => void;
}

export const FormulaEditor: React.FC<FormulaEditorProps> = ({
  formula,
  onChangeFormula,
  onResetFormula
}) => {
  const digitConfigs = [
    { key: 'digit1' as const, label: 'D-1 หลักร้อยบน', badge: 'H-TOP', color: 'text-yellow-400' },
    { key: 'digit2' as const, label: 'D-2 หลักสิบบน', badge: 'T-TOP', color: 'text-yellow-400' },
    { key: 'digit3' as const, label: 'D-3 หลักหน่วยบน', badge: 'U-TOP', color: 'text-yellow-400' },
    { key: 'bot1' as const, label: 'B-1 หลักสิบล่าง', badge: 'T-BOT', color: 'text-emerald-400' },
    { key: 'bot2' as const, label: 'B-2 หลักหน่วยล่าง', badge: 'U-BOT', color: 'text-emerald-400' },
  ];

  const handleUpdate = (
    key: keyof FormulaState,
    field: 'v1' | 'v2' | 'c',
    val: VariableId | number
  ) => {
    playTerminalBeep(850, 0.04);
    onChangeFormula(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: val
      }
    }));
  };

  return (
    <div className="bg-[#14181f] border border-gray-800 rounded-xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-top-2">
      <div className="px-3.5 py-2.5 bg-[#1a2028] border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider">Strategy Parameters (สูตรคำนวณ)</span>
        </div>
        <button
          onClick={() => {
            playTerminalBeep(500);
            onResetFormula();
          }}
          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white px-2 py-0.5 rounded bg-gray-800/60 hover:bg-gray-800 transition-colors"
        >
          <RotateCcw size={10} />
          <span>รีเซ็ตสูตร</span>
        </button>
      </div>

      <div className="p-3 space-y-2.5">
        <div className="text-[10px] text-gray-400 flex items-center gap-1">
          <HelpCircle size={12} className="text-yellow-400 shrink-0" />
          <span>สูตรคำนวณโมดูลาร์: <code>(ตัวแปร 1 + ตัวแปร 2 + ค่าคงที่ C) mod 10</code></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
          {digitConfigs.map(({ key, label, badge, color }) => {
            const conf = formula[key];
            const v1Def = VARIABLES.find(v => v.id === conf.v1);
            const v2Def = VARIABLES.find(v => v.id === conf.v2);

            return (
              <div key={key} className="bg-[#0e1217] p-2.5 rounded-lg border border-gray-800/80">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-gray-300">{label}</span>
                  <span className={`text-[9px] font-mono font-bold ${color} bg-[#1a2028] px-1.5 py-0.5 rounded border border-gray-800`}>
                    ({v1Def?.short || '0'} + {v2Def?.short || '0'} + {conf.c}) % 10
                  </span>
                </div>

                <div className="flex gap-1.5 items-center">
                  <select
                    className="flex-1 bg-[#161a22] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:border-yellow-500 outline-none"
                    value={conf.v1}
                    onChange={(e) => handleUpdate(key, 'v1', e.target.value as VariableId)}
                  >
                    {VARIABLES.map(v => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </select>

                  <span className="text-gray-500 text-xs font-bold">+</span>

                  <select
                    className="flex-1 bg-[#161a22] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:border-yellow-500 outline-none"
                    value={conf.v2}
                    onChange={(e) => handleUpdate(key, 'v2', e.target.value as VariableId)}
                  >
                    {VARIABLES.map(v => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </select>

                  <span className="text-gray-500 text-xs font-bold">+</span>

                  <input
                    type="number"
                    min="0"
                    max="9"
                    className="w-10 bg-[#161a22] border border-gray-700 rounded py-1 text-xs text-center text-yellow-400 font-mono font-bold focus:border-yellow-500 outline-none"
                    value={conf.c}
                    onChange={(e) => handleUpdate(key, 'c', (parseInt(e.target.value, 10) || 0) % 10)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
