import React from 'react';
import { X, Sparkles, Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PRESET_FORMULAS, matchCurrentPreset } from '../data/presets';
import { FormulaState } from '../types';
import { playTerminalBeep, playSuccessChime } from '../utils/sound';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (formula: FormulaState) => void;
  currentFormula: FormulaState;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  currentFormula
}) => {
  if (!isOpen) return null;

  const activePreset = matchCurrentPreset(currentFormula);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#181d24] border border-gray-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative text-white">
        {/* Header */}
        <div className="px-5 py-4 bg-[#1e2329] border-b border-gray-800 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                คลังสูตรเซียน (Battle-Tested Presets)
              </h2>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              สูตรที่ใช้อยู่ขณะนี้: <strong className="text-yellow-400 font-bold">{activePreset ? activePreset.name : '🛠️ สูตรปรับแต่งเอง (Custom)'}</strong>
            </p>
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

        {/* Presets List */}
        <div className="p-5 space-y-3 max-h-[460px] overflow-y-auto">
          {PRESET_FORMULAS.map((preset) => {
            const isActive = activePreset?.id === preset.id;

            return (
              <div
                key={preset.id}
                onClick={() => {
                  playSuccessChime();
                  onSelectPreset(preset.formula);
                  onClose();
                }}
                className={`border rounded-xl p-3.5 transition-all cursor-pointer group flex justify-between items-center gap-4 ${
                  isActive
                    ? 'bg-yellow-500/10 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)] ring-1 ring-yellow-500/50'
                    : 'bg-[#0e1217] hover:bg-[#1f2631] border-gray-800 hover:border-yellow-500/40'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={`font-bold text-xs transition-colors ${
                      isActive ? 'text-yellow-400' : 'text-white group-hover:text-yellow-400'
                    }`}>
                      {preset.name}
                    </h3>
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      {preset.winRateTag}
                    </span>
                    {isActive && (
                      <span className="text-[9px] font-black font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 animate-pulse">
                        <CheckCircle2 size={10} /> ใช้งานอยู่ (ACTIVE)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                  isActive
                    ? 'bg-yellow-500 text-black shadow-md'
                    : 'bg-gray-800/80 group-hover:bg-yellow-500 group-hover:text-black text-gray-400'
                }`}>
                  {isActive ? <Check size={16} strokeWidth={3} /> : <ArrowRight size={15} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
