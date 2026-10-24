export type VariableId =
  | 'h' | 't' | 'u' | 'bt' | 'bu'
  | 'ht' | 'tu' | 'hu' | 'btu'
  | 'hbt' | 'hbu' | 'tbt' | 'tbu' | 'ubt' | 'ubu'
  | 'none';

export interface VariableDef {
  id: VariableId;
  label: string;
  short: string;
  description: string;
}

export interface DigitFormula {
  v1: VariableId;
  v2: VariableId;
  v3?: VariableId;
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
  is2TopRev: boolean;     // 2 ตัวบนกลับ
  is2BotExact: boolean;   // 2 ตัวล่างตรง
  is2BotRev: boolean;     // 2 ตัวล่างกลับ
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
  rev2TopHits: number;
  exact2BotHits: number;
  rev2BotHits: number;
  hit1PlusTop: number;
  hit1PlusTopRate: number;
  totalProfit: number;
  grossPayout: number;
  totalCost: number;
  riskRewardRatio: number;
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
  direct3D: number;     // 3 ตรง บาทละ 500
  tod3D: number;        // 3 โต๊ด บาทละ 100
  direct2D: number;     // 2 ตัว บาทละ 70
  betDirect3D: number;  // แทง 3 ตรง (ค่าเริ่มต้น 100 บาท)
  betTod3D: number;     // แทง 3 โต๊ด (ค่าเริ่มต้น 100 บาท)
  betTop2D: number;     // แทง 2 บนตรง (ค่าเริ่มต้น 25 บาท)
  betTop2DRev: number;  // แทง 2 บนกลับ (ค่าเริ่มต้น 25 บาท)
  betBot2D: number;     // แทง 2 ล่างตรง (ค่าเริ่มต้น 25 บาท)
  betBot2DRev: number;  // แทง 2 ล่างกลับ (ค่าเริ่มต้น 25 บาท)
}

export const DEFAULT_PAYOUT_CONFIG: PayoutConfig = {
  direct3D: 500,    // 3 ตรง บาทละ 500
  tod3D: 100,       // โต๊ด บาทละ 100
  direct2D: 70,     // 2 ตัว บาทละ 70
  betDirect3D: 100, // 3 ตัวตรง: 100 บาท (100×100)
  betTod3D: 100,    // 3 ตัวโต๊ด: 100 บาท (100×100)
  betTop2D: 25,     // 2 บนตรง: 25 บาท (25×25)
  betTop2DRev: 25,  // 2 บนกลับ: 25 บาท (25×25)
  betBot2D: 25,     // 2 ล่างตรง: 25 บาท (25×25)
  betBot2DRev: 25   // 2 ล่างกลับ: 25 บาท (25×25)
}; // รวมงวดละ 300 บาท (3ตัว 100*100 | 2บน 25*25 | 2ล่าง 25*25)
