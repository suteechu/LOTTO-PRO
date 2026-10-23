import React from 'react';
import { BacktestRow } from '../types';
import { TrendingUp } from 'lucide-react';

interface PnLChartProps {
  rows: BacktestRow[];
}

export const PnLChart: React.FC<PnLChartProps> = ({ rows }) => {
  if (rows.length < 1) return null;

  // Chronological order for chart (oldest draw on the left -> newest draw on the right)
  const chronological = [...rows].reverse();

  // Include initial 0 baseline point before the 1st backtest draw
  const pnlPoints = [0, ...chronological.map(r => r.cumulativePnL)];

  const minPnL = Math.min(0, ...pnlPoints);
  const maxPnL = Math.max(100, ...pnlPoints);
  const range = maxPnL - minPnL || 1;

  const width = 600;
  const height = 140;
  const paddingX = 20;
  const paddingY = 20;

  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  // Generate SVG coordinates for [0, ...chronological]
  const coords = pnlPoints.map((val, idx) => {
    const x = paddingX + (idx / Math.max(1, pnlPoints.length - 1)) * innerW;
    const y = paddingY + innerH - ((val - minPnL) / range) * innerH;
    return { x, y, val, row: idx > 0 ? chronological[idx - 1] : null };
  });

  const pointsStr = coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`);
  const pathD = `M ${pointsStr.join(' L ')}`;

  // Zero line y coordinate
  const zeroY = paddingY + innerH - ((0 - minPnL) / range) * innerH;
  const baseLineY = Math.min(height - paddingY, Math.max(paddingY, zeroY));
  const areaD = `M ${paddingX},${baseLineY.toFixed(1)} L ${pointsStr.join(' L ')} L ${width - paddingX},${baseLineY.toFixed(1)} Z`;

  const lastVal = pnlPoints[pnlPoints.length - 1];
  const isProfitable = lastVal >= 0;

  return (
    <div className="bg-[#14181f] border border-gray-800 rounded-xl p-3 shadow-lg">
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
          <TrendingUp size={14} className={isProfitable ? 'text-emerald-400' : 'text-rose-400'} />
          <span>SIMULATED EQUITY CURVE (กราฟผลตอบแทนสะสม)</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-gray-500">กำไรสะสมสุทธิ:</span>
          <span className={`font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfitable ? '+' : ''}{lastVal.toLocaleString()} THB
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 sm:h-32 overflow-visible">
          <defs>
            <linearGradient id="pnlGradGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="pnlGradRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Zero baseline */}
          {zeroY >= paddingY && zeroY <= height - paddingY && (
            <line
              x1={paddingX}
              y1={zeroY}
              x2={width - paddingX}
              y2={zeroY}
              stroke="#374151"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          )}

          {/* Area fill */}
          <path
            d={areaD}
            fill={isProfitable ? 'url(#pnlGradGreen)' : 'url(#pnlGradRed)'}
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={isProfitable ? '#10b981' : '#f43f5e'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Highlight dots on winning draws */}
          {coords.map((pt, idx) => {
            if (!pt.row) return null;
            const r = pt.row;
            const isWin = r.is3Exact || r.is3Tod || r.is2TopExact || r.is2BotExact;
            if (!isWin) return null;

            return (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={r.is3Exact ? 4 : 3}
                fill={r.is3Exact ? '#facc15' : '#10b981'}
                stroke="#0b0e11"
                strokeWidth="1"
              >
                <title>
                  {`${r.date}: ${r.simulatedPnL >= 0 ? '+' : ''}${r.simulatedPnL.toLocaleString()}฿ (สะสม: ${pt.val >= 0 ? '+' : ''}${pt.val.toLocaleString()}฿)`}
                </title>
              </circle>
            );
          })}

          {/* Current end dot */}
          {coords.length > 0 && (
            <circle
              cx={coords[coords.length - 1].x}
              cy={coords[coords.length - 1].y}
              r="4.5"
              fill={isProfitable ? '#10b981' : '#f43f5e'}
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono px-1 mt-1">
        <span>เริ่มต้น: {chronological[0]?.date || ''} (0 ฿)</span>
        <span className="text-emerald-400/90 font-bold">สูงสุด (Peak): +{maxPnL.toLocaleString()} ฿</span>
        <span>ล่าสุด: {chronological[chronological.length - 1]?.date || ''} ({lastVal >= 0 ? '+' : ''}{lastVal.toLocaleString()} ฿)</span>
      </div>
    </div>
  );
};
