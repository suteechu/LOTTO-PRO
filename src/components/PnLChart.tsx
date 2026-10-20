import React from 'react';
import { BacktestRow } from '../types';
import { TrendingUp, DollarSign } from 'lucide-react';

interface PnLChartProps {
  rows: BacktestRow[];
}

export const PnLChart: React.FC<PnLChartProps> = ({ rows }) => {
  if (rows.length < 2) return null;

  // Chronological order for chart (oldest to newest)
  const chronological = [...rows].reverse();
  const pnlPoints = chronological.map(r => r.cumulativePnL);

  const minPnL = Math.min(0, ...pnlPoints);
  const maxPnL = Math.max(100, ...pnlPoints);
  const range = maxPnL - minPnL || 1;

  const width = 600;
  const height = 140;
  const paddingX = 20;
  const paddingY = 20;

  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;

  // Generate SVG points
  const points = pnlPoints.map((val, idx) => {
    const x = paddingX + (idx / (pnlPoints.length - 1)) * innerW;
    const y = paddingY + innerH - ((val - minPnL) / range) * innerH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${paddingX},${height - paddingY} L ${points.join(' L ')} L ${width - paddingX},${height - paddingY} Z`;

  // Zero line y coordinate
  const zeroY = paddingY + innerH - ((0 - minPnL) / range) * innerH;

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
          <span className="text-gray-500">สุทธิ:</span>
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

          {/* Current end dot */}
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].split(',')[0]}
              cy={points[points.length - 1].split(',')[1]}
              r="4"
              fill={isProfitable ? '#10b981' : '#f43f5e'}
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono px-1 mt-1">
        <span>เริ่มต้น: {chronological[0]?.date || ''}</span>
        <span>สูงสุด: +{maxPnL.toLocaleString()} ฿</span>
        <span>ล่าสุด: {chronological[chronological.length - 1]?.date || ''}</span>
      </div>
    </div>
  );
};
