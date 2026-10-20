import { DigitFormula, FormulaState, LotteryDraw, BacktestRow, StrategyMetrics, DigitFrequency, VariableId, PayoutConfig, DEFAULT_PAYOUT_CONFIG } from '../types';
import { VARIABLES } from '../data/lotteryData';

export const DEFAULT_FORMULA: FormulaState = {
  digit1: { v1: 'h', v2: 'bt', c: 5 },
  digit2: { v1: 'h', v2: 'u', c: 1 },
  digit3: { v1: 'h', v2: 'none', c: 7 },
  bot1: { v1: 'h', v2: 'h', c: 0 },
  bot2: { v1: 'h', v2: 'none', c: 1 }
};

export function getVariableValues(top3: string, bot2: string): Record<VariableId, number> {
  const t3 = top3 || '000';
  const b2 = bot2 || '00';
  return {
    h: parseInt(t3[0], 10) || 0,
    t: parseInt(t3[1], 10) || 0,
    u: parseInt(t3[2], 10) || 0,
    bt: parseInt(b2[0], 10) || 0,
    bu: parseInt(b2[1], 10) || 0,
    none: 0
  };
}

export function calculateDigit(conf: DigitFormula, prevTop3: string, prevBot2: string): number {
  const vals = getVariableValues(prevTop3, prevBot2);
  const v1 = vals[conf.v1] ?? 0;
  const v2 = vals[conf.v2] ?? 0;
  const c = conf.c ?? 0;
  const res = (v1 + v2 + c) % 10;
  return (res + 10) % 10;
}

export function predictDigits(formula: FormulaState, latestDraw: LotteryDraw) {
  const prevTop = latestDraw.top3;
  const prevBot = latestDraw.bot2;

  const d1 = calculateDigit(formula.digit1, prevTop, prevBot);
  const d2 = calculateDigit(formula.digit2, prevTop, prevBot);
  const d3 = calculateDigit(formula.digit3, prevTop, prevBot);

  const b1 = calculateDigit(formula.bot1, prevTop, prevBot);
  const b2 = calculateDigit(formula.bot2, prevTop, prevBot);

  return {
    top3: `${d1}${d2}${d3}`,
    top2: `${d2}${d3}`,
    bot2: `${b1}${b2}`,
    digits: [d1, d2, d3],
    botDigits: [b1, b2]
  };
}

export function runBacktest(
  draws: LotteryDraw[],
  formula: FormulaState,
  payoutConfig: PayoutConfig = DEFAULT_PAYOUT_CONFIG
): { rows: BacktestRow[]; metrics: StrategyMetrics } {
  if (!draws || draws.length < 2) {
    return {
      rows: [],
      metrics: {
        totalDraws: 0,
        exact3Hits: 0,
        exact3Rate: 0,
        tod3Hits: 0,
        tod3Rate: 0,
        exact2TopHits: 0,
        exact2BotHits: 0,
        hit1PlusTop: 0,
        hit1PlusTopRate: 0,
        totalProfit: 0,
        roi: 0,
        winRate: 0
      }
    };
  }

  let exact3Hits = 0;
  let tod3Hits = 0;
  let exact2TopHits = 0;
  let exact2BotHits = 0;
  let hit1PlusTop = 0;
  let runningPnL = 0;

  const validDraws = draws.slice(0, -1);
  const rows: BacktestRow[] = validDraws.map((current, idx) => {
    const prev = draws[idx + 1];

    const p1 = calculateDigit(formula.digit1, prev.top3, prev.bot2);
    const p2 = calculateDigit(formula.digit2, prev.top3, prev.bot2);
    const p3 = calculateDigit(formula.digit3, prev.top3, prev.bot2);
    const predTop3 = `${p1}${p2}${p3}`;

    const pb1 = calculateDigit(formula.bot1, prev.top3, prev.bot2);
    const pb2 = calculateDigit(formula.bot2, prev.top3, prev.bot2);
    const predBot2 = `${pb1}${pb2}`;

    // Actual values
    const actTop3 = current.top3;
    const actBot2 = current.bot2;

    const is3Exact = predTop3 === actTop3;
    const is3Tod = !is3Exact && predTop3.split('').sort().join('') === actTop3.split('').sort().join('');
    const is2TopExact = predTop3.slice(1) === actTop3.slice(1);
    const is2BotExact = predBot2 === actBot2;

    let matchedTopCount = 0;
    if (p1 === parseInt(actTop3[0], 10)) matchedTopCount++;
    if (p2 === parseInt(actTop3[1], 10)) matchedTopCount++;
    if (p3 === parseInt(actTop3[2], 10)) matchedTopCount++;

    let matchedBotCount = 0;
    if (pb1 === parseInt(actBot2[0], 10)) matchedBotCount++;
    if (pb2 === parseInt(actBot2[1], 10)) matchedBotCount++;

    if (is3Exact) exact3Hits++;
    if (is3Tod) tod3Hits++;
    if (is2TopExact) exact2TopHits++;
    if (is2BotExact) exact2BotHits++;
    if (matchedTopCount >= 1) hit1PlusTop++;

    // Simulated P&L per draw based on User's Payout Rates:
    // 3 ตรง: บาทละ 500, โต๊ด: บาทละ 100, 2 ตัว: บาทละ 70
    const cost = (payoutConfig.betDirect3D + payoutConfig.betTod3D + payoutConfig.betTop2D + payoutConfig.betBot2D) || 100;
    let payout = 0;
    if (is3Exact) payout += payoutConfig.betDirect3D * payoutConfig.direct3D;     // 3ตรง (บาทละ 500)
    if (is3Tod) payout += payoutConfig.betTod3D * payoutConfig.tod3D;           // โต๊ด (บาทละ 100)
    if (is2TopExact) payout += payoutConfig.betTop2D * payoutConfig.direct2D;   // 2ตัวบน (บาทละ 70)
    if (is2BotExact) payout += payoutConfig.betBot2D * payoutConfig.direct2D;   // 2ตัวล่าง (บาทละ 70)

    const netPnL = payout - cost;
    runningPnL += netPnL;

    return {
      drawNo: current.drawNo,
      date: current.date,
      actualTop3: actTop3,
      actualBot2: actBot2,
      predTop3,
      predBot2,
      is3Exact,
      is3Tod,
      is2TopExact,
      is2BotExact,
      matchedTopCount,
      matchedBotCount,
      simulatedPnL: netPnL,
      cumulativePnL: runningPnL
    };
  });

  const total = rows.length;
  const anyWinCount = rows.filter(r => r.is3Exact || r.is3Tod || r.is2TopExact || r.is2BotExact).length;
  const winRate = total > 0 ? (anyWinCount / total) * 100 : 0;
  const costPerDraw = (payoutConfig.betDirect3D + payoutConfig.betTod3D + payoutConfig.betTop2D + payoutConfig.betBot2D) || 100;
  const totalCost = total * costPerDraw;
  const roi = totalCost > 0 ? (runningPnL / totalCost) * 100 : 0;

  const metrics: StrategyMetrics = {
    totalDraws: total,
    exact3Hits,
    exact3Rate: total > 0 ? (exact3Hits / total) * 100 : 0,
    tod3Hits,
    tod3Rate: total > 0 ? (tod3Hits / total) * 100 : 0,
    exact2TopHits,
    exact2BotHits,
    hit1PlusTop,
    hit1PlusTopRate: total > 0 ? (hit1PlusTop / total) * 100 : 0,
    totalProfit: runningPnL,
    roi,
    winRate
  };

  return { rows, metrics };
}

// AI Optimizer: Find best configuration for a target digit
export function optimizeDigit(
  draws: LotteryDraw[],
  digitType: 'top1' | 'top2' | 'top3' | 'bot1' | 'bot2'
): { bestFormula: DigitFormula; hits: number; total: number; accuracy: number } {
  if (draws.length < 2) {
    return { bestFormula: { v1: 'u', v2: 'bu', c: 0 }, hits: 0, total: 0, accuracy: 0 };
  }

  const validDraws = draws.slice(0, -1);
  const total = validDraws.length;

  let bestHits = -1;
  let bestFormula: DigitFormula = { v1: 'none', v2: 'none', c: 0 };

  const varList: VariableId[] = ['h', 't', 'u', 'bt', 'bu', 'none'];

  for (const v1 of varList) {
    for (const v2 of varList) {
      for (let c = 0; c <= 9; c++) {
        const conf: DigitFormula = { v1, v2, c };
        let hits = 0;

        for (let i = 0; i < total; i++) {
          const current = draws[i];
          const prev = draws[i + 1];
          const pred = calculateDigit(conf, prev.top3, prev.bot2);

          let targetActual = 0;
          if (digitType === 'top1') targetActual = parseInt(current.top3[0], 10);
          else if (digitType === 'top2') targetActual = parseInt(current.top3[1], 10);
          else if (digitType === 'top3') targetActual = parseInt(current.top3[2], 10);
          else if (digitType === 'bot1') targetActual = parseInt(current.bot2[0], 10);
          else if (digitType === 'bot2') targetActual = parseInt(current.bot2[1], 10);

          if (pred === targetActual) {
            hits++;
          }
        }

        if (hits > bestHits) {
          bestHits = hits;
          bestFormula = conf;
        }
      }
    }
  }

  return {
    bestFormula,
    hits: bestHits,
    total,
    accuracy: total > 0 ? (bestHits / total) * 100 : 0
  };
}

export function autoOptimizeFullFormula(
  draws: LotteryDraw[],
  payoutConfig: PayoutConfig = DEFAULT_PAYOUT_CONFIG
): FormulaState {
  if (!draws || draws.length < 2) return DEFAULT_FORMULA;

  const validDraws = draws.slice(0, -1);
  const total = validDraws.length;
  const varList: VariableId[] = ['h', 't', 'u', 'bt', 'bu', 'none'];

  // Step 1: Optimize 2D Top (d2 and d3) jointly to maximize 2-digit direct hits
  let best2TopHits = -1;
  let bestD2: DigitFormula = { v1: 'h', v2: 'u', c: 1 };
  let bestD3: DigitFormula = { v1: 'h', v2: 'none', c: 7 };

  for (const v1 of varList) {
    for (const v2 of varList) {
      for (let c1 = 0; c1 <= 9; c1++) {
        const d2: DigitFormula = { v1, v2, c: c1 };
        for (const v3 of varList) {
          for (let c2 = 0; c2 <= 9; c2++) {
            const d3: DigitFormula = { v1: v3, v2: 'none', c: c2 };
            let hits = 0;
            for (let i = 0; i < total; i++) {
              const cur = validDraws[i];
              const prev = draws[i + 1];
              const p2 = calculateDigit(d2, prev.top3, prev.bot2);
              const p3 = calculateDigit(d3, prev.top3, prev.bot2);
              if (`${p2}${p3}` === cur.top3.slice(1)) hits++;
            }
            if (hits > best2TopHits) {
              best2TopHits = hits;
              bestD2 = d2;
              bestD3 = d3;
            }
          }
        }
      }
    }
  }

  // Step 2: Optimize 2D Bot (b1 and b2) jointly to maximize 2-digit bottom hits
  let best2BotHits = -1;
  let bestB1: DigitFormula = { v1: 'h', v2: 'h', c: 0 };
  let bestB2: DigitFormula = { v1: 'h', v2: 'none', c: 1 };

  for (const v1 of varList) {
    for (const v2 of varList) {
      for (let c1 = 0; c1 <= 9; c1++) {
        const b1: DigitFormula = { v1, v2, c: c1 };
        for (const v3 of varList) {
          for (let c2 = 0; c2 <= 9; c2++) {
            const b2: DigitFormula = { v1: v3, v2: 'none', c: c2 };
            let hits = 0;
            for (let i = 0; i < total; i++) {
              const cur = validDraws[i];
              const prev = draws[i + 1];
              const pb1 = calculateDigit(b1, prev.top3, prev.bot2);
              const pb2 = calculateDigit(b2, prev.top3, prev.bot2);
              if (`${pb1}${pb2}` === cur.bot2) hits++;
            }
            if (hits > best2BotHits) {
              best2BotHits = hits;
              bestB1 = b1;
              bestB2 = b2;
            }
          }
        }
      }
    }
  }

  // Step 3: Optimize D1 to maximize 3D Direct, 3D Tod, and Total Profit
  let bestScore = -Infinity;
  let bestD1: DigitFormula = { v1: 'h', v2: 'bt', c: 5 };

  for (const v1 of varList) {
    for (const v2 of varList) {
      for (let c = 0; c <= 9; c++) {
        const d1: DigitFormula = { v1, v2, c };
        let e3 = 0, t3 = 0, e2t = 0, e2b = 0;
        let pnl = 0;

        for (let i = 0; i < total; i++) {
          const cur = validDraws[i];
          const prev = draws[i + 1];

          const p1 = calculateDigit(d1, prev.top3, prev.bot2);
          const p2 = calculateDigit(bestD2, prev.top3, prev.bot2);
          const p3 = calculateDigit(bestD3, prev.top3, prev.bot2);
          const predTop = `${p1}${p2}${p3}`;

          const pb1 = calculateDigit(bestB1, prev.top3, prev.bot2);
          const pb2 = calculateDigit(bestB2, prev.top3, prev.bot2);
          const predBot = `${pb1}${pb2}`;

          const is3Exact = predTop === cur.top3;
          const is3Tod = !is3Exact && predTop.split('').sort().join('') === cur.top3.split('').sort().join('');
          const is2Top = predTop.slice(1) === cur.top3.slice(1);
          const is2Bot = predBot === cur.bot2;

          if (is3Exact) e3++;
          if (is3Tod) t3++;
          if (is2Top) e2t++;
          if (is2Bot) e2b++;

          let win = 0;
          if (is3Exact) win += payoutConfig.betDirect3D * payoutConfig.direct3D;
          if (is3Tod) win += payoutConfig.betTod3D * payoutConfig.tod3D;
          if (is2Top) win += payoutConfig.betTop2D * payoutConfig.direct2D;
          if (is2Bot) win += payoutConfig.betBot2D * payoutConfig.direct2D;

          const cost = (payoutConfig.betDirect3D + payoutConfig.betTod3D + payoutConfig.betTop2D + payoutConfig.betBot2D) || 100;
          pnl += (win - cost);
        }

        const score = e3 * 10000 + t3 * 2000 + e2t * 500 + e2b * 500 + pnl;
        if (score > bestScore) {
          bestScore = score;
          bestD1 = d1;
        }
      }
    }
  }

  return {
    digit1: bestD1,
    digit2: bestD2,
    digit3: bestD3,
    bot1: bestB1,
    bot2: bestB2
  };
}

export function calculateDigitStats(draws: LotteryDraw[], target: 'top3' | 'bot2' = 'top3') {
  const counts = Array(10).fill(0);
  const lastSeen = Array(10).fill(-1);

  draws.forEach((draw, drawIndex) => {
    const numStr = target === 'top3' ? draw.top3 : draw.bot2;
    for (const char of numStr) {
      const d = parseInt(char, 10);
      if (!isNaN(d) && d >= 0 && d <= 9) {
        counts[d]++;
        if (lastSeen[d] === -1) {
          lastSeen[d] = drawIndex;
        }
      }
    }
  });

  const totalDigits = counts.reduce((a, b) => a + b, 0);
  let maxCount = Math.max(...counts, 1);

  const stats: DigitFrequency[] = counts.map((count, digit) => ({
    digit,
    count,
    percentage: totalDigits > 0 ? (count / totalDigits) * 100 : 0,
    lastSeenDrawsAgo: lastSeen[digit] !== -1 ? lastSeen[digit] : draws.length
  }));

  const sortedStats = [...stats].sort((a, b) => b.count - a.count);

  let oddCount = 0;
  let evenCount = 0;
  let highCount = 0; // 5-9
  let lowCount = 0;  // 0-4

  counts.forEach((count, digit) => {
    if (digit % 2 === 0) evenCount += count;
    else oddCount += count;

    if (digit >= 5) highCount += count;
    else lowCount += count;
  });

  return {
    stats: sortedStats,
    rawStats: stats,
    maxCount,
    hotZone: sortedStats.slice(0, 3).map(s => s.digit),
    coldZone: sortedStats.slice(-3).reverse().map(s => s.digit),
    oddCount,
    evenCount,
    highCount,
    lowCount
  };
}
