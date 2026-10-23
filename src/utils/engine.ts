import { DigitFormula, FormulaState, LotteryDraw, BacktestRow, StrategyMetrics, DigitFrequency, VariableId, PayoutConfig, DEFAULT_PAYOUT_CONFIG } from '../types';
import { VARIABLES } from '../data/lotteryData';

export const DEFAULT_FORMULA: FormulaState = {
  digit1: { v1: 'hu', v2: 'btu', v3: 'tbt', c: 2 },
  digit2: { v1: 'ht', v2: 'tbu', v3: 'ubu', c: 0 },
  digit3: { v1: 't', v2: 'u', v3: 'bt', c: 7 },
  bot1: { v1: 'btu', v2: 'tbu', v3: 'tbu', c: 6 },
  bot2: { v1: 'h', v2: 'bu', v3: 'bu', c: 5 }
};

export function getVariableValues(top3: string, bot2: string): Record<VariableId, number> {
  const t3 = top3 || '000';
  const b2 = bot2 || '00';
  const h = parseInt(t3[0], 10) || 0;
  const t = parseInt(t3[1], 10) || 0;
  const u = parseInt(t3[2], 10) || 0;
  const bt = parseInt(b2[0], 10) || 0;
  const bu = parseInt(b2[1], 10) || 0;

  return {
    h,
    t,
    u,
    bt,
    bu,
    ht: (h * t) % 10,
    tu: (t * u) % 10,
    hu: (h * u) % 10,
    btu: (bt * bu) % 10,
    hbt: (h * bt) % 10,
    hbu: (h * bu) % 10,
    tbt: (t * bt) % 10,
    tbu: (t * bu) % 10,
    ubt: (u * bt) % 10,
    ubu: (u * bu) % 10,
    none: 0
  };
}

export function calculateDigit(conf: DigitFormula, prevTop3: string, prevBot2: string): number {
  const vals = getVariableValues(prevTop3, prevBot2);
  const v1 = vals[conf.v1] ?? 0;
  const v2 = vals[conf.v2] ?? 0;
  const v3 = vals[conf.v3 || 'none'] ?? 0;
  const c = conf.c ?? 0;
  const res = (v1 + v2 + v3 + c) % 10;
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
        grossPayout: 0,
        totalCost: 0,
        riskRewardRatio: 0,
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
  let totalGrossPayout = 0;

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

    totalGrossPayout += payout;
    const netPnL = payout - cost;

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
      cumulativePnL: 0
    };
  });

  // Accumulate cumulativePnL in true chronological order (from oldest draw to newest draw)
  for (let i = rows.length - 1; i >= 0; i--) {
    runningPnL += rows[i].simulatedPnL;
    rows[i].cumulativePnL = runningPnL;
  }

  const total = rows.length;
  const anyWinCount = rows.filter(r => r.is3Exact || r.is3Tod || r.is2TopExact || r.is2BotExact).length;
  const winRate = total > 0 ? (anyWinCount / total) * 100 : 0;
  const costPerDraw = (payoutConfig.betDirect3D + payoutConfig.betTod3D + payoutConfig.betTop2D + payoutConfig.betBot2D) || 100;
  const totalCost = total * costPerDraw;
  const roi = totalCost > 0 ? (runningPnL / totalCost) * 100 : 0;
  const riskRewardRatio = totalCost > 0 ? totalGrossPayout / totalCost : 0;

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
    grossPayout: totalGrossPayout,
    totalCost,
    riskRewardRatio,
    roi,
    winRate
  };

  return { rows, metrics };
}

function popcntBigInt(n: bigint): number {
  let c = 0;
  while (n > 0n) {
    n &= n - 1n;
    c++;
  }
  return c;
}

function sort3Digits(a: number, b: number, c: number): number {
  if (a > b) { const t = a; a = b; b = t; }
  if (b > c) { const t = b; b = c; c = t; }
  if (a > b) { const t = a; a = b; b = t; }
  return a * 100 + b * 10 + c;
}

// AI Optimizer: Find best configuration for a target digit
export function optimizeDigit(
  draws: LotteryDraw[],
  digitType: 'top1' | 'top2' | 'top3' | 'bot1' | 'bot2'
): { bestFormula: DigitFormula; hits: number; total: number; accuracy: number } {
  if (draws.length < 2) {
    return { bestFormula: { v1: 'u', v2: 'bu', v3: 'none', c: 0 }, hits: 0, total: 0, accuracy: 0 };
  }

  const validDraws = draws.slice(0, -1);
  const total = validDraws.length;

  let bestHits = -1;
  let bestFormula: DigitFormula = { v1: 'none', v2: 'none', v3: 'none', c: 0 };

  const varList: VariableId[] = [
    'h', 't', 'u', 'bt', 'bu',
    'ht', 'tu', 'hu', 'btu', 'hbt', 'hbu', 'tbt', 'tbu', 'ubt', 'ubu',
    'none'
  ];

  for (let i = 0; i < varList.length; i++) {
    for (let j = i; j < varList.length; j++) {
      for (let k = j; k < varList.length; k++) {
        for (let c = 0; c <= 9; c++) {
          const conf: DigitFormula = { v1: varList[i], v2: varList[j], v3: varList[k], c };
          let hits = 0;

          for (let idx = 0; idx < total; idx++) {
            const current = draws[idx];
            const prev = draws[idx + 1];
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

  const N = draws.length - 1;
  const varList: VariableId[] = [
    'h', 't', 'u', 'bt', 'bu',
    'ht', 'tu', 'hu', 'btu', 'hbt', 'hbu', 'tbt', 'tbu', 'ubt', 'ubu',
    'none'
  ];

  const prevVals = draws.slice(1).map(d => getVariableValues(d.top3, d.bot2));
  const actT1 = draws.slice(0, N).map(d => parseInt(d.top3[0], 10) || 0);
  const actT2 = draws.slice(0, N).map(d => parseInt(d.top3[1], 10) || 0);
  const actT3 = draws.slice(0, N).map(d => parseInt(d.top3[2], 10) || 0);
  const actB1 = draws.slice(0, N).map(d => parseInt(d.bot2[0], 10) || 0);
  const actB2 = draws.slice(0, N).map(d => parseInt(d.bot2[1], 10) || 0);
  const actTopSorted = draws.slice(0, N).map(d =>
    sort3Digits(parseInt(d.top3[0], 10) || 0, parseInt(d.top3[1], 10) || 0, parseInt(d.top3[2], 10) || 0)
  );

  interface Cand3 {
    v1: VariableId;
    v2: VariableId;
    v3: VariableId;
    c: number;
    preds: Uint8Array;
    m1: bigint;
    m2: bigint;
    m3: bigint;
    mb1: bigint;
    mb2: bigint;
    c1: number;
    c2: number;
    c3: number;
    cb1: number;
    cb2: number;
  }

  const cand3: Cand3[] = [];
  for (let i = 0; i < varList.length; i++) {
    for (let j = i; j < varList.length; j++) {
      for (let k = j; k < varList.length; k++) {
        for (let c = 0; c <= 9; c++) {
          const v1 = varList[i];
          const v2 = varList[j];
          const v3 = varList[k];
          const preds = new Uint8Array(N);
          let m1 = 0n, m2 = 0n, m3 = 0n, mb1 = 0n, mb2 = 0n;

          for (let idx = 0; idx < N; idx++) {
            const pv = prevVals[idx];
            const p = (pv[v1] + pv[v2] + pv[v3] + c) % 10;
            preds[idx] = p;
            const bit = 1n << BigInt(idx);
            if (p === actT1[idx]) m1 |= bit;
            if (p === actT2[idx]) m2 |= bit;
            if (p === actT3[idx]) m3 |= bit;
            if (p === actB1[idx]) mb1 |= bit;
            if (p === actB2[idx]) mb2 |= bit;
          }

          cand3.push({
            v1, v2, v3, c, preds,
            m1, m2, m3, mb1, mb2,
            c1: popcntBigInt(m1),
            c2: popcntBigInt(m2),
            c3: popcntBigInt(m3),
            cb1: popcntBigInt(mb1),
            cb2: popcntBigInt(mb2)
          });
        }
      }
    }
  }

  // Step 1: Optimize 2D Bot (b1, b2) jointly via bitmask intersection
  const topB1 = [...cand3].sort((a, b) => b.cb1 - a.cb1).slice(0, 260);
  const topB2 = [...cand3].sort((a, b) => b.cb2 - a.cb2).slice(0, 260);
  let bestBotH = -1;
  let bestB1: DigitFormula = DEFAULT_FORMULA.bot1;
  let bestB2: DigitFormula = DEFAULT_FORMULA.bot2;

  for (const b1 of topB1) {
    for (const b2 of topB2) {
      const h = popcntBigInt(b1.mb1 & b2.mb2);
      if (h > bestBotH) {
        bestBotH = h;
        bestB1 = { v1: b1.v1, v2: b1.v2, v3: b1.v3, c: b1.c };
        bestB2 = { v1: b2.v1, v2: b2.v2, v3: b2.v3, c: b2.c };
      }
    }
  }

  // Step 2: Optimize 2D Top (d2, d3) & 3D Direct/Tod (d1) jointly
  const topD2 = [...cand3].sort((a, b) => b.c2 - a.c2).slice(0, 300);
  const topD3 = [...cand3].sort((a, b) => b.c3 - a.c3).slice(0, 300);

  let maxH23 = 0;
  let pairs23: { d2: Cand3; d3: Cand3; m23: bigint; h23: number }[] = [];

  for (const d2 of topD2) {
    for (const d3 of topD3) {
      const m23 = d2.m2 & d3.m3;
      const h23 = popcntBigInt(m23);
      if (h23 > maxH23) maxH23 = h23;
      if (h23 >= Math.max(2, maxH23 - 1)) {
        pairs23.push({ d2, d3, m23, h23 });
      }
    }
  }

  pairs23.sort((a, b) => b.h23 - a.h23);
  pairs23 = pairs23.slice(0, 80);

  const topD1 = [...cand3].sort((a, b) => b.c1 - a.c1).slice(0, 400);
  let bestScore = -Infinity;
  let bestD1: DigitFormula = DEFAULT_FORMULA.digit1;
  let bestD2: DigitFormula = DEFAULT_FORMULA.digit2;
  let bestD3: DigitFormula = DEFAULT_FORMULA.digit3;

  const w3Exact = (payoutConfig.betDirect3D * payoutConfig.direct3D) || 12500;
  const w3Tod = (payoutConfig.betTod3D * payoutConfig.tod3D) || 2500;
  const w2Top = (payoutConfig.betTop2D * payoutConfig.direct2D) || 5250;

  for (const p of pairs23) {
    for (const d1 of topD1) {
      const e3 = popcntBigInt(p.m23 & d1.m1);
      let t3 = 0;
      for (let idx = 0; idx < N; idx++) {
        const p1 = d1.preds[idx];
        const p2 = p.d2.preds[idx];
        const p3 = p.d3.preds[idx];
        if (!(p1 === actT1[idx] && p2 === actT2[idx] && p3 === actT3[idx])) {
          if (sort3Digits(p1, p2, p3) === actTopSorted[idx]) t3++;
        }
      }
      const score = e3 * w3Exact + t3 * w3Tod + p.h23 * w2Top + d1.c1 * 10;
      if (score > bestScore) {
        bestScore = score;
        bestD1 = { v1: d1.v1, v2: d1.v2, v3: d1.v3, c: d1.c };
        bestD2 = { v1: p.d2.v1, v2: p.d2.v2, v3: p.d2.v3, c: p.d2.c };
        bestD3 = { v1: p.d3.v1, v2: p.d3.v2, v3: p.d3.v3, c: p.d3.c };
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
