export type VariableId = 'h' | 't' | 'u' | 'bt' | 'bu' | 'none';

export interface VariableDef {
  id: VariableId;
  label: string;
  short: string;
  description: string;
}

export interface DigitFormula {
  v1: VariableId;
  v2: VariableId;
  c: number;
}

export interface FormulaState {
  // Top 3 digits
  digit1: DigitFormula; // หลักร้อย
  digit2: DigitFormula; // หลักสิบ
  digit3: DigitFormula; // หลักหน่วย
  // Bottom 2 digits
  bot1: DigitFormula;   // สิบล่าง
  bot2: DigitFormula;   // หน่วยล่าง
}

export interface LotteryDraw {
  id: number;
  drawNo: number;
  date: string;
  top3: string;
  bot2: string;
  full6?: string;
  note?: string;
}

export interface BacktestRow {
  drawNo: number;
  date: string;
  actualTop3: string;
  actualBot2: string;
  predTop3: string;
  predBot2: string;
  is3Exact: boolean;      // 3 ตัวตรง
  is3Tod: boolean;        // 3 ตัวโต๊ด
  is2TopExact: boolean;   // 2 ตัวบนตรง
  is2BotExact: boolean;   // 2 ตัวล่างตรง
  matchedTopCount: number;
  matchedBotCount: number;
  simulatedPnL: number;
  cumulativePnL: number;
}

export interface StrategyMetrics {
  totalDraws: number;
  exact3Hits: number;
  exact3Rate: number;
  tod3Hits: number;
  tod3Rate: number;
  exact2TopHits: number;
  exact2BotHits: number;
  hit1PlusTop: number;
  hit1PlusTopRate: number;
  totalProfit: number;
  roi: number;
  winRate: number;
}

export interface DigitFrequency {
  digit: number;
  count: number;
  percentage: number;
  lastSeenDrawsAgo: number;
}

export interface PresetFormula {
  id: string;
  name: string;
  description: string;
  targetMode: 'top3' | 'bot2' | 'both';
  formula: FormulaState;
  winRateTag: string;
}
