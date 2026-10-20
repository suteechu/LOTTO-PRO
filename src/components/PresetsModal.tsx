import React from 'react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { PRESET_FORMULAS } from '../data/presets';
import { FormulaState } from '../types';
import { playTerminalBeep, playSuccessChime } from '../utils/sound';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (formula: FormulaState) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#181d24] border border-gray-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative text-white">
        {/* Header */}
        <div className="px-5 py-4 bg-[#1e2329] border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">คลังสูตรเซียน (Battle-Tested Presets)</h2>
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
          {PRESET_FORMULAS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                playSuccessChime();
                onSelectPreset(preset.formula);
                onClose();
              }}
              className="bg-[#0e1217] hover:bg-[#1f2631] border border-gray-800 hover:border-yellow-500/50 rounded-xl p-3.5 transition-all cursor-pointer group flex justify-between items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-xs text-white group-hover:text-yellow-400 transition-colors">
                    {preset.name}
                  </h3>
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    {preset.winRateTag}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="w-8 h-8 rounded-lg bg-gray-800/80 group-hover:bg-yellow-500 group-hover:text-black flex items-center justify-center text-gray-400 transition-colors shrink-0">
                <ArrowRight size={15} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
