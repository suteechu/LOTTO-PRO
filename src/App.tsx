import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TickerBar } from './components/TickerBar';
import { PredictionHero } from './components/PredictionHero';
import { FormulaEditor } from './components/FormulaEditor';
import { HotColdAnalytics } from './components/HotColdAnalytics';
import { BacktestTable } from './components/BacktestTable';
import { PnLChart } from './components/PnLChart';
import { TicketModal } from './components/TicketModal';
import { AddDrawModal } from './components/AddDrawModal';
import { PresetsModal } from './components/PresetsModal';
import { PayoutSettingsModal } from './components/PayoutSettingsModal';
import { matchCurrentPreset } from './data/presets';
import {
  getStoredLotteryData,
  saveStoredLotteryData,
  resetStoredLotteryData,
  syncLatestDraws,
  INITIAL_LOTTERY_DATA
} from './data/lotteryData';
import {
  DEFAULT_FORMULA,
  predictDigits,
  runBacktest,
  autoOptimizeFullFormula,
  calculateDigitStats
} from './utils/engine';
import { LotteryDraw, FormulaState, BacktestRow, PayoutConfig, DEFAULT_PAYOUT_CONFIG } from '../src/types';
import { playSuccessChime, playTerminalBeep } from './utils/sound';
import { CheckCircle2 } from 'lucide-react';

const PAYOUT_STORAGE_KEY = 'lotto_pro_payout_config_v2';

export default function App() {
  const [draws, setDraws] = useState<LotteryDraw[]>(() => getStoredLotteryData());
  const [formula, setFormula] = useState<FormulaState>(DEFAULT_FORMULA);
  const [showParams, setShowParams] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Custom Payout Rates: 3ตรง 500, โต๊ด 100, 2ตัว 70 | รวมงวดละ 200 บาท
  const [payoutConfig, setPayoutConfig] = useState<PayoutConfig>(() => {
    try {
      localStorage.removeItem('lotto_pro_payout_config_v1');
      const raw = localStorage.getItem(PAYOUT_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return DEFAULT_PAYOUT_CONFIG;
  });

  // Current active preset detector
  const activePreset = useMemo(() => matchCurrentPreset(formula), [formula]);
  const activePresetName = activePreset ? activePreset.name : '🛠️ ปรับแต่งเอง (Custom)';

  // Modals
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [selectedHistoricalRow, setSelectedHistoricalRow] = useState<BacktestRow | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Save payout config
  const handleSavePayoutConfig = useCallback((newCfg: PayoutConfig) => {
    setPayoutConfig(newCfg);
    try {
      localStorage.setItem(PAYOUT_STORAGE_KEY, JSON.stringify(newCfg));
    } catch {}
    setSyncToast(`💰 อัปเดตอัตราจ่าย: 3ตรง ${newCfg.direct3D}฿ | โต๊ด ${newCfg.tod3D}฿ | 2ตัว ${newCfg.direct2D}฿ เรียบร้อย!`);
    setTimeout(() => setSyncToast(null), 4000);
  }, []);

  // Auto-sync on startup
  useEffect(() => {
    const { updatedDraws, newCount } = syncLatestDraws(draws);
    if (newCount > 0) {
      setDraws(updatedDraws);
      setSyncToast(`⚡ ระบบ Auto-Update ดึงข้อมูลงวดใหม่เพิ่ม ${newCount} งวด (ล่าสุด ${updatedDraws[0].date}) เรียบร้อยแล้ว!`);
      playSuccessChime();
      setTimeout(() => setSyncToast(null), 5000);
    }
  }, []);

  // Selected Year Filter ('all' | '2569' | '2568')
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Year counts
  const yearCounts = useMemo(() => {
    let count69 = 0;
    let count68 = 0;
    draws.forEach(d => {
      if (d.date.includes(' 69') || d.date.endsWith('69')) count69++;
      else if (d.date.includes(' 68') || d.date.endsWith('68')) count68++;
    });
    return [
      { id: 'all', label: 'ทั้งหมด', count: draws.length },
      { id: '2569', label: 'ปี 2569', count: count69 },
      { id: '2568', label: 'ปี 2568', count: count68 }
    ];
  }, [draws]);

  // Active draws filtered by selected year (plus 1 previous draw as input)
  const activeDraws = useMemo(() => {
    if (selectedYear === 'all') return draws;
    const shortYear = selectedYear.slice(-2); // '69' or '68'
    const yearIndices = draws
      .map((d, idx) => (d.date.includes(` ${shortYear}`) || d.date.endsWith(shortYear) ? idx : -1))
      .filter(idx => idx !== -1);

    if (yearIndices.length === 0) return draws;

    const minIdx = yearIndices[0];
    const maxIdx = yearIndices[yearIndices.length - 1];
    // Include 1 draw right after maxIdx for previous draw reference
    const endIdx = maxIdx + 1 < draws.length ? maxIdx + 2 : draws.length;
    return draws.slice(minIdx, endIdx);
  }, [draws, selectedYear]);

  // Latest draw is index 0
  const latestDraw = draws[0] || INITIAL_LOTTERY_DATA[0];

  // Prediction for next draw (always forecasts from the true latest draw)
  const prediction = useMemo(() => {
    return predictDigits(formula, latestDraw);
  }, [formula, latestDraw]);

  // Backtest across active draws with user's customized payout rates
  const { rows, metrics } = useMemo(() => {
    return runBacktest(activeDraws, formula, payoutConfig);
  }, [activeDraws, formula, payoutConfig]);

  // Volume hot / cold stats for active draws
  const volumeStats = useMemo(() => {
    return calculateDigitStats(activeDraws, 'top3');
  }, [activeDraws]);

  // Manual Trigger Auto Sync
  const handleAutoSync = useCallback(() => {
    playTerminalBeep(900, 0.08);
    const { updatedDraws, newCount } = syncLatestDraws(draws);
    if (newCount > 0) {
      setDraws(updatedDraws);
      setSyncToast(`🔄 ซิงค์สำเร็จ! เพิ่มข้อมูลงวดใหม่ ${newCount} งวด (ล่าสุด ${updatedDraws[0].date})`);
      playSuccessChime();
    } else {
      setSyncToast(`✅ ฐานข้อมูลเป็นงวดล่าสุดเรียบร้อยแล้ว (${draws[0]?.date || '16 ต.ค. 69'})`);
    }
    setTimeout(() => setSyncToast(null), 4000);
  }, [draws]);

  // Add Draw
  const handleAddDraw = useCallback((newDraw: LotteryDraw) => {
    setDraws(prev => {
      const updated = [newDraw, ...prev];
      saveStoredLotteryData(updated);
      return updated;
    });
  }, []);

  // Reset Data
  const handleResetData = useCallback(() => {
    const fresh = resetStoredLotteryData();
    setDraws(fresh);
    setFormula(DEFAULT_FORMULA);
    playSuccessChime();
    setSyncToast('🔄 รีเซ็ตฐานข้อมูลสถิติกลับเป็นค่ามาตรฐานเรียบร้อยแล้ว');
    setTimeout(() => setSyncToast(null), 3000);
  }, []);

  // Reset Formula
  const handleResetFormula = useCallback(() => {
    setFormula(DEFAULT_FORMULA);
  }, []);

  // AI Auto-Tune
  const handleAutoTune = useCallback(() => {
    setIsOptimizing(true);
    playTerminalBeep(900, 0.1);

    setTimeout(() => {
      const optimized = autoOptimizeFullFormula(activeDraws, payoutConfig);
      setFormula(optimized);
      setIsOptimizing(false);
      setShowParams(true);
      playSuccessChime();
      const yearLabel = selectedYear === 'all' ? 'ทุกงวด' : `ปี ${selectedYear}`;
      setSyncToast(`🤖 AI Auto-Tune สำเร็จ! ค้นพบสูตรที่เข้าเป้าสูงสุดสำหรับ ${yearLabel} เรียบร้อยแล้ว`);
      setTimeout(() => setSyncToast(null), 4000);
    }, 700);
  }, [activeDraws, payoutConfig, selectedYear]);

  // Click to open Ticket from Historical row
  const handleOpenHistoricalTicket = useCallback((row: BacktestRow) => {
    setSelectedHistoricalRow(row);
    setIsTicketOpen(true);
  }, []);

  // Click to open Ticket from Next Prediction Hero
  const handleOpenNextTicket = useCallback(() => {
    setSelectedHistoricalRow(null);
    setIsTicketOpen(true);
  }, []);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    if (rows.length === 0) return;

    const headers = ['งวดที่', 'วันที่', 'ผลจริงบน', 'ผลจริงล่าง', 'ผลทำนายบน', 'ผลทำนายล่าง', 'ถูก3ตรง', 'ถูก3โต๊ด', 'ถูก2บน', 'ถูก2ล่าง', 'กำไรจำลอง', 'กำไรสะสม'];
    const csvRows = rows.map(r => [
      r.drawNo,
      `"${r.date}"`,
      `"${r.actualTop3}"`,
      `"${r.actualBot2}"`,
      `"${r.predTop3}"`,
      `"${r.predBot2}"`,
      r.is3Exact ? 'YES' : 'NO',
      r.is3Tod ? 'YES' : 'NO',
      r.is2TopExact ? 'YES' : 'NO',
      r.is2BotExact ? 'YES' : 'NO',
      r.simulatedPnL,
      r.cumulativePnL
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...csvRows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LOTTO-PRO-Backtest-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playSuccessChime();
  }, [rows]);

  return (
    <div className="min-h-screen bg-[#0b0e11] text-[#eaecef] font-sans text-sm selection:bg-yellow-500/30 selection:text-yellow-200 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetData={handleResetData}
        onExportCSV={handleExportCSV}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenPayoutSettings={() => setIsPayoutModalOpen(true)}
        onAutoSync={handleAutoSync}
        drawCount={draws.length}
        latestDate={latestDraw.date}
        payoutConfig={payoutConfig}
        activePresetName={activePresetName}
      />

      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 max-w-[1600px] mx-auto w-full">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{syncToast}</span>
          </div>
          <button onClick={() => setSyncToast(null)} className="text-white/80 hover:text-white ml-2 text-xs">✕</button>
        </div>
      )}

      {/* Ticker strip with Year Filter */}
      <TickerBar
        latestDraw={latestDraw}
        metrics={metrics}
        hotZone={volumeStats.hotZone}
        coldZone={volumeStats.coldZone}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        yearCounts={yearCounts}
      />

      {/* Main Terminal Dashboard */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Left Column (Forecast & Controls) */}
        <div className="lg:col-span-4 space-y-3 sm:space-y-4 flex flex-col">
          {/* Next Signal Card */}
          <PredictionHero
            prediction={prediction}
            metrics={metrics}
            isOptimizing={isOptimizing}
            onAutoTune={handleAutoTune}
            showParams={showParams}
            onToggleParams={() => setShowParams(prev => !prev)}
            onOpenTicket={handleOpenNextTicket}
            latestDate={latestDraw.date}
            activePresetName={activePresetName}
          />

          {/* Formula Parameters Drawer */}
          {showParams && (
            <FormulaEditor
              formula={formula}
              onChangeFormula={setFormula}
              onResetFormula={handleResetFormula}
            />
          )}

          {/* Hot / Cold Volume */}
          <HotColdAnalytics draws={activeDraws} />
        </div>

        {/* Right Column (Backtesting & Charts) */}
        <div className="lg:col-span-8 flex flex-col space-y-3 sm:space-y-4 min-h-[600px]">
          {/* Cumulative Equity Curve Chart */}
          <PnLChart rows={rows} />

          {/* Backtest Order History Table */}
          <div className="flex-1">
            <BacktestTable
              rows={rows}
              onSelectRowTicket={handleOpenHistoricalTicket}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-[#0e1217] py-3 px-4 text-center text-xs text-gray-500 font-mono">
        <div className="flex flex-wrap justify-between items-center max-w-[1600px] mx-auto gap-2">
          <span>LOTTO-PRO QUANT ALGORITHM TERMINAL © 2026 | Built for Analytical & Backtesting Purposes</span>
          <span className="text-gray-400">
            อัตราจ่าย: 3ตรง {payoutConfig.direct3D}฿ • โต๊ด {payoutConfig.tod3D}฿ • 2ตัว {payoutConfig.direct2D}฿
          </span>
        </div>
      </footer>

      {/* Modals */}
      <TicketModal
        isOpen={isTicketOpen}
        onClose={() => {
          setIsTicketOpen(false);
          setSelectedHistoricalRow(null);
        }}
        historicalRow={selectedHistoricalRow}
        nextPrediction={prediction}
        latestDate={latestDraw.date}
        payoutConfig={payoutConfig}
      />

      <AddDrawModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDraw={handleAddDraw}
        lastDrawNo={latestDraw.drawNo}
      />

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={(newFormula) => {
          setFormula(newFormula);
          setShowParams(true);
        }}
        currentFormula={formula}
      />

      <PayoutSettingsModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        payoutConfig={payoutConfig}
        onSavePayoutConfig={handleSavePayoutConfig}
      />
    </div>
  );
}
