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

export interface PayoutConfig {
  direct3D: number; // 3 ตรง บาทละ 500
  tod3D: number;    // 3 โต๊ด บาทละ 100
  direct2D: number; // 2 ตัว บาทละ 70
  betDirect3D: number; // แทง 3 ตรง (ค่าเริ่มต้น 25 บาท)
  betTod3D: number;    // แทง โต๊ด (ค่าเริ่มต้น 25 บาท)
  betTop2D: number;    // แทง 2 บน (ค่าเริ่มต้น 75 บาท)
  betBot2D: number;    // แทง 2 ล่าง (ค่าเริ่มต้น 75 บาท)
}

export const DEFAULT_PAYOUT_CONFIG: PayoutConfig = {
  direct3D: 500, // 3 ตรง บาทละ 500
  tod3D: 100,    // โต๊ด บาทละ 100
  direct2D: 70,  // 2 ตัว บาทละ 70
  betDirect3D: 25, // แทง 3 ตรง: 25 บาท
  betTod3D: 25,    // แทง โต๊ด: 25 บาท
  betTop2D: 75,    // แทง 2 บน: 75 บาท
  betBot2D: 75     // แทง 2 ล่าง: 75 บาท
}; // รวมงวดละ 200 บาท
