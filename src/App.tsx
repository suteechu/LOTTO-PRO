import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { TickerBar } from './components/TickerBar';
import { PredictionHero } from './components/PredictionHero';
import { FormulaEditor } from './components/FormulaEditor';
import { YearlyRRBreakdown, YearlyRRItem } from './components/YearlyRRBreakdown';
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
  mergeOnlineDraws,
  sortAndRenumberDraws,
  INITIAL_LOTTERY_DATA
} from './data/lotteryData';
import {
  DEFAULT_FORMULA,
  predictDigits,
  runBacktest,
  autoOptimizeFullFormula
} from './utils/engine';
import { LotteryDraw, FormulaState, BacktestRow, PayoutConfig, DEFAULT_PAYOUT_CONFIG } from '../src/types';
import { playSuccessChime, playTerminalBeep } from './utils/sound';
import {
  fetchOnlineDrawsFromThaiORC,
  extractThaiYearBE,
  formatThaiDateShort
} from './utils/onlineLottoSync';
import { CheckCircle2 } from 'lucide-react';

const PAYOUT_STORAGE_KEY = 'lotto_pro_payout_config_v4';

function getLatestYearBE(items: LotteryDraw[]): string {
  let maxYear = 0;
  for (const d of items) {
    const y = parseInt(extractThaiYearBE(d.date), 10);
    if (!isNaN(y) && y > maxYear) maxYear = y;
  }
  return maxYear > 0 ? String(maxYear) : 'all';
}

function getDrawsSliceForYear(items: LotteryDraw[], year: string): LotteryDraw[] {
  if (year === 'all') return items;
  const yearIndices = items
    .map((d, idx) => (extractThaiYearBE(d.date) === year ? idx : -1))
    .filter(idx => idx !== -1);

  if (yearIndices.length === 0) return items;

  const minIdx = yearIndices[0];
  const maxIdx = yearIndices[yearIndices.length - 1];
  // Include 1 draw right after maxIdx for previous draw reference
  const endIdx = maxIdx + 1 < items.length ? maxIdx + 2 : items.length;
  return items.slice(minIdx, endIdx);
}

export default function App() {
  const [draws, setDraws] = useState<LotteryDraw[]>(() => getStoredLotteryData());
  const [formula, setFormula] = useState<FormulaState>(DEFAULT_FORMULA);
  const [showParams, setShowParams] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const drawsRef = useRef(draws);
  drawsRef.current = draws;
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, durationMs = 4500) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setSyncToast(message);
    if (durationMs > 0) {
      toastTimerRef.current = setTimeout(() => {
        setSyncToast(null);
        toastTimerRef.current = null;
      }, durationMs);
    }
  }, []);

  // Custom Payout Rates: 3ตรง 500, โต๊ด 100, 2ตัว 70 | แผน 100x100 / 25x25 / 25x25 รวมงวดละ 300 บาท
  const [payoutConfig, setPayoutConfig] = useState<PayoutConfig>(() => {
    try {
      localStorage.removeItem('lotto_pro_payout_config_v1');
      localStorage.removeItem('lotto_pro_payout_config_v2');
      localStorage.removeItem('lotto_pro_payout_config_v3');
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
    showToast(`💰 อัปเดตอัตราจ่าย: 3ตรง ${newCfg.direct3D}฿ | โต๊ด ${newCfg.tod3D}฿ | 2ตัว ${newCfg.direct2D}฿ เรียบร้อย!`, 4000);
  }, [showToast]);

  // Auto-sync on startup (local baseline + non-blocking ThaiORC page 1 check)
  useEffect(() => {
    let cancelled = false;
    const { updatedDraws: localUpdated, newCount: localCount } = syncLatestDraws(drawsRef.current);

    if (localCount > 0) {
      drawsRef.current = localUpdated;
      setDraws(localUpdated);
      showToast(`⚡ ระบบ Auto-Update ดึงข้อมูลงวดใหม่เพิ่ม ${localCount} งวด (ล่าสุด ${localUpdated[0].date}) เรียบร้อยแล้ว!`, 5000);
      playSuccessChime();
    }

    fetchOnlineDrawsFromThaiORC({ maxPages: 1 })
      .then((res) => {
        if (cancelled || res.draws.length === 0) return;
        const { updatedDraws, newCount } = mergeOnlineDraws(drawsRef.current, res.draws);
        if (newCount > 0) {
          drawsRef.current = updatedDraws;
          setDraws(updatedDraws);
          if (!userChangedYearRef.current) {
            setSelectedYear(getLatestYearBE(updatedDraws));
          }
          showToast(`⚡ ซิงค์ผลล่าสุดจาก ${res.source} เพิ่ม ${newCount} งวด (ล่าสุด ${updatedDraws[0]?.date}) เรียบร้อย!`, 5000);
          playSuccessChime();
        }
      })
      .catch(() => {
        // ข้ามเงียบๆ หากเปิดใช้งานแบบออฟไลน์
      });

    return () => {
      cancelled = true;
    };
  }, [showToast]);

  // Selected Year Filter (ค่าเริ่มต้นเป็นปีล่าสุดที่มีข้อมูล)
  const [selectedYear, setSelectedYear] = useState<string>(() => getLatestYearBE(draws));
  const userChangedYearRef = useRef(false);

  const handleSelectYear = useCallback((year: string) => {
    userChangedYearRef.current = true;
    setSelectedYear(year);
  }, []);

  // Dynamic year counts derived from stored draws
  const yearCounts = useMemo(() => {
    const counts = new Map<string, number>();
    draws.forEach(d => {
      const yearBE = extractThaiYearBE(d.date);
      if (yearBE) {
        counts.set(yearBE, (counts.get(yearBE) || 0) + 1);
      }
    });

    const sortedYears = Array.from(counts.keys()).sort((a, b) => Number(b) - Number(a));
    return [
      { id: 'all', label: 'ทั้งหมด', count: draws.length },
      ...sortedYears.map(year => ({
        id: year,
        label: `ปี ${year}`,
        count: counts.get(year) || 0
      }))
    ];
  }, [draws]);

  // Active draws filtered by selected year (plus 1 previous draw as input)
  const activeDraws = useMemo(() => {
    return getDrawsSliceForYear(draws, selectedYear);
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

  // Per-year RR & performance breakdown + overall multi-year metrics
  const { yearlyRRItems, allYearsMetrics } = useMemo(() => {
    const allRes = runBacktest(draws, formula, payoutConfig);
    const items: YearlyRRItem[] = yearCounts
      .filter(y => y.id !== 'all')
      .map(y => {
        const slice = getDrawsSliceForYear(draws, y.id);
        const { metrics: yMetrics } = runBacktest(slice, formula, payoutConfig);
        return {
          year: y.id,
          drawCount: y.count,
          metrics: yMetrics
        };
      });
    return { yearlyRRItems: items, allYearsMetrics: allRes.metrics };
  }, [draws, yearCounts, formula, payoutConfig]);

  // Manual Trigger Auto Sync (ThaiORC 10-year historical pages)
  const handleAutoSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    playTerminalBeep(900, 0.08);
    showToast('🔄 กำลังเชื่อมต่อดึงผลสลากย้อนหลังจาก ThaiORC...', 0);

    try {
      // 1. ตรวจสอบและซิงค์กับฐานข้อมูลทางการก่อน
      const { updatedDraws: localUpdated, newCount: localCount } = syncLatestDraws(drawsRef.current);
      const workingList = localCount > 0 ? localUpdated : drawsRef.current;

      // 2. ดึงผลย้อนหลังหลายหน้าจาก horoscope.thaiorc.com/lotto/thai/stats/lottery-years10.php
      const result = await fetchOnlineDrawsFromThaiORC({
        maxPages: 8,
        onProgress: (page, collectedCount) => {
          showToast(`🔄 กำลังดึงข้อมูลจาก ThaiORC หน้า ${page}... (พบ ${collectedCount} งวด)`, 0);
        }
      });

      if (result.draws.length > 0) {
        const { updatedDraws, newCount, updatedCount } = mergeOnlineDraws(workingList, result.draws);
        if (newCount > 0 || updatedCount > 0) {
          drawsRef.current = updatedDraws;
          setDraws(updatedDraws);
          if (!userChangedYearRef.current) {
            setSelectedYear(getLatestYearBE(updatedDraws));
          }
          showToast(
            `🎉 ซิงค์จาก ${result.source} สำเร็จ! เพิ่มใหม่ ${newCount} งวด` +
            `${updatedCount > 0 ? ` • อัปเดต ${updatedCount} งวด` : ''} ` +
            `(รวม ${updatedDraws.length} งวด | ล่าสุด ${updatedDraws[0]?.date})`,
            5500
          );
          playSuccessChime();
          return;
        }

        if (localCount > 0) {
          drawsRef.current = localUpdated;
          setDraws(localUpdated);
          showToast(`🔄 ซิงค์สำเร็จ! เพิ่มข้อมูลงวดใหม่ ${localCount} งวด (ล่าสุด ${localUpdated[0].date})`, 5000);
          playSuccessChime();
        } else {
          showToast(`✅ ฐานข้อมูลครบถ้วนเป็นงวดล่าสุดแล้ว (${workingList[0]?.date || '-'} | ${workingList.length} งวด)`, 4500);
        }
      } else {
        if (localCount > 0) {
          drawsRef.current = localUpdated;
          setDraws(localUpdated);
        }
        showToast(`⚠️ ${result.error || 'ไม่สามารถดึงข้อมูลจาก ThaiORC ได้ในขณะนี้'}`, 5000);
      }
    } catch (e) {
      console.error(e);
      showToast('⚠️ เกิดข้อผิดพลาดในการเชื่อมต่อ ThaiORC กรุณาลองใหม่อีกครั้ง', 5000);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, showToast]);

  // Add Draw (with duplicate date prevention & chronological ordering)
  const handleAddDraw = useCallback((newDraw: LotteryDraw) => {
    const normDate = formatThaiDateShort(newDraw.date) || newDraw.date.trim();
    const normalizedNew: LotteryDraw = { ...newDraw, date: normDate };
    setDraws(prev => {
      const filtered = prev.filter(d => (formatThaiDateShort(d.date) || d.date.trim()) !== normDate);
      const updated = sortAndRenumberDraws([normalizedNew, ...filtered]);
      saveStoredLotteryData(updated);
      return updated;
    });
    showToast(`✅ บันทึกผลงวด ${normDate} เรียบร้อยแล้ว!`, 4000);
  }, [showToast]);

  // Reset Data
  const handleResetData = useCallback(() => {
    const fresh = resetStoredLotteryData();
    setDraws(fresh);
    userChangedYearRef.current = false;
    setSelectedYear(getLatestYearBE(fresh));
    setFormula(DEFAULT_FORMULA);
    playSuccessChime();
    showToast('🔄 รีเซ็ตฐานข้อมูลสถิติกลับเป็นค่ามาตรฐานเรียบร้อยแล้ว', 3000);
  }, [showToast]);

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
      showToast(`🤖 AI Auto-Tune สำเร็จ! ค้นพบสูตรที่เข้าเป้าสูงสุดสำหรับ ${yearLabel} เรียบร้อยแล้ว`, 4000);
    }, 700);
  }, [activeDraws, payoutConfig, selectedYear, showToast]);

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
        isSyncing={isSyncing}
        drawCount={draws.length}
        latestDate={latestDraw.date}
        payoutConfig={payoutConfig}
        activePresetName={activePresetName}
      />

      {/* Sync Toast Notification */}
      {syncToast && (
        <div
          className={`text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-1 ${
            syncToast.startsWith('⚠️')
              ? 'bg-gradient-to-r from-amber-600 to-rose-600'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600'
          }`}
        >
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
        selectedYear={selectedYear}
        onSelectYear={handleSelectYear}
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

          {/* Yearly RR Breakdown */}
          <YearlyRRBreakdown
            items={yearlyRRItems}
            allMetrics={allYearsMetrics}
            selectedYear={selectedYear}
            onSelectYear={handleSelectYear}
          />
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
