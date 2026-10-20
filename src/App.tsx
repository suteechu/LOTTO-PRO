import React, { useState, useMemo, useCallback } from 'react';
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
import {
  getStoredLotteryData,
  saveStoredLotteryData,
  resetStoredLotteryData,
  INITIAL_LOTTERY_DATA
} from './data/lotteryData';
import {
  DEFAULT_FORMULA,
  predictDigits,
  runBacktest,
  autoOptimizeFullFormula,
  calculateDigitStats
} from './utils/engine';
import { LotteryDraw, FormulaState } from './types';
import { playSuccessChime, playTerminalBeep } from './utils/sound';

export default function App() {
  const [draws, setDraws] = useState<LotteryDraw[]>(() => getStoredLotteryData());
  const [formula, setFormula] = useState<FormulaState>(DEFAULT_FORMULA);
  const [showParams, setShowParams] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Modals
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // Latest draw is index 0
  const latestDraw = draws[0] || INITIAL_LOTTERY_DATA[0];

  // Prediction for next draw
  const prediction = useMemo(() => {
    return predictDigits(formula, latestDraw);
  }, [formula, latestDraw]);

  // Backtest across all draws
  const { rows, metrics } = useMemo(() => {
    return runBacktest(draws, formula);
  }, [draws, formula]);

  // Volume hot / cold stats
  const volumeStats = useMemo(() => {
    return calculateDigitStats(draws, 'top3');
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
      const optimized = autoOptimizeFullFormula(draws);
      setFormula(optimized);
      setIsOptimizing(false);
      setShowParams(true);
      playSuccessChime();
    }, 700);
  }, [draws]);

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
        drawCount={draws.length}
      />

      {/* Ticker strip */}
      <TickerBar
        latestDraw={latestDraw}
        metrics={metrics}
        hotZone={volumeStats.hotZone}
        coldZone={volumeStats.coldZone}
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
            onOpenTicket={() => setIsTicketOpen(true)}
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
          <HotColdAnalytics draws={draws} />
        </div>

        {/* Right Column (Backtesting & Charts) */}
        <div className="lg:col-span-8 flex flex-col space-y-3 sm:space-y-4 min-h-[600px]">
          {/* Cumulative Equity Curve Chart */}
          <PnLChart rows={rows} />

          {/* Backtest Order History Table */}
          <div className="flex-1">
            <BacktestTable rows={rows} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-[#0e1217] py-3 px-4 text-center text-xs text-gray-500 font-mono">
        <div className="flex flex-wrap justify-between items-center max-w-[1600px] mx-auto gap-2">
          <span>LOTTO-PRO QUANT ALGORITHM TERMINAL © 2026 | Built for Analytical & Backtesting Purposes</span>
          <span className="text-gray-400">
            Powered by Quant Engine • Developed by Sutee
          </span>
        </div>
      </footer>

      {/* Modals */}
      <TicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        prediction={prediction}
        latestDate={latestDraw.date}
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
      />
    </div>
  );
}
