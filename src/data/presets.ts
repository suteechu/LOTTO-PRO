import { PresetFormula, FormulaState, DigitFormula } from '../types';

export const PRESET_FORMULAS: PresetFormula[] = [
  {
    id: 'team-1-2569-god-tier',
    name: '👑 ทีม 1: 2569 Momentum God-Tier (ปี 69 RR 1:41.1 | Win 50.0%)',
    description: 'แชมป์โมเมนตัมปีล่าสุด 2569 เข้า 3ตรง 5 งวด, 2บน 5 งวด, 2ล่าง 7 งวด (กำไรปี 69 +264,400฿ | รวม 10 ปี +281,200฿)',
    targetMode: 'both',
    winRateTag: 'ปี 69 RR 1:41.1 | 10Y RR 1:5.0',
    formula: {
      digit1: { v1: 'hu', v2: 'btu', v3: 'tbt', c: 2 },
      digit2: { v1: 'ht', v2: 'tbu', v3: 'ubu', c: 0 },
      digit3: { v1: 't', v2: 'u', v3: 'bt', c: 7 },
      bot1:   { v1: 'u', v2: 'ht', v3: 'hbu', c: 2 },
      bot2:   { v1: 'tu', v2: 'hbu', v3: 'hbu', c: 8 }
    }
  },
  {
    id: 'team-2-hybrid-10y-69',
    name: '⚡ ทีม 2: Hybrid 10Y & 2569 All-Star (10 ปี RR 1:6.9 | ปี 69 RR 1:16.7)',
    description: 'สูตรสมดุล 10 ปีและปีล่าสุด เข้า 3ตรง 8 งวด (ปี 68–69 แตกปีละ 2 งวด), 3โต๊ด 3 งวด, 2บน 13 งวด, 2ล่าง 21 งวด กำไรสุทธิ 10 ปี +418,700฿',
    targetMode: 'both',
    winRateTag: '10Y RR 1:6.9 | 8x Jackpot',
    formula: {
      digit1: { v1: 'hu', v2: 'hu', v3: 'ubu', c: 7 },
      digit2: { v1: 'ht', v2: 'hbt', v3: 'tbt', c: 6 },
      digit3: { v1: 'bt', v2: 'hbu', v3: 'none', c: 1 },
      bot1:   { v1: 'btu', v2: 'tbt', v3: 'tbu', c: 0 },
      bot2:   { v1: 'u', v2: 'hbt', v3: 'hbt', c: 8 }
    }
  },
  {
    id: 'team-3-10y-supreme-rr',
    name: '🏆 ทีม 3: 10-Year Supreme Max RR (แชมป์ 10 ปี RR สูงสุด 1:7.1)',
    description: 'แชมป์สถิติย้อนหลัง 10 ปีเต็ม (237 งวด) เข้า 3ตรง 8 งวด, 3โต๊ด 4 งวด, 2บน 14 งวด, 2ล่าง 21 งวด ทำกำไรสุทธิสูงสุด +430,450฿',
    targetMode: 'both',
    winRateTag: '10Y RR 1:7.1 | ROI +608%',
    formula: {
      digit1: { v1: 'u', v2: 'u', v3: 'u', c: 3 },
      digit2: { v1: 'ht', v2: 'hbt', v3: 'tbt', c: 6 },
      digit3: { v1: 'bt', v2: 'hbt', v3: 'hbu', c: 1 },
      bot1:   { v1: 'btu', v2: 'tbt', v3: 'tbu', c: 0 },
      bot2:   { v1: 'u', v2: 'hbt', v3: 'hbt', c: 8 }
    }
  }
];

function isSameDigitFormula(a: DigitFormula, b: DigitFormula): boolean {
  return (
    a.v1 === b.v1 &&
    a.v2 === b.v2 &&
    (a.v3 || 'none') === (b.v3 || 'none') &&
    a.c === b.c
  );
}

export function matchCurrentPreset(formula: FormulaState): PresetFormula | null {
  for (const preset of PRESET_FORMULAS) {
    const pf = preset.formula;
    if (
      isSameDigitFormula(pf.digit1, formula.digit1) &&
      isSameDigitFormula(pf.digit2, formula.digit2) &&
      isSameDigitFormula(pf.digit3, formula.digit3) &&
      isSameDigitFormula(pf.bot1, formula.bot1) &&
      isSameDigitFormula(pf.bot2, formula.bot2)
    ) {
      return preset;
    }
  }
  return null;
}
