import { PresetFormula, FormulaState, DigitFormula } from '../types';

export const PRESET_FORMULAS: PresetFormula[] = [
  {
    id: 'god-tier-quantum-alpha',
    name: '👑 God-Tier Quantum Alpha (RR 1:28.9 | Win 44.7%)',
    description: 'สูตรควอนตัม 3 ตัวแปรคูณไขว้ สำหรับแผน 100×100 / 25×25 (งวดละ 300฿) เข้า 3ตรง 6 งวด, 2บน(ไป-กลับ) 8 งวด, 2ล่าง(ไป-กลับ) 9 งวด กำไรสุทธิ +318,350฿',
    targetMode: 'both',
    winRateTag: 'RR 1:28.9 | ROI +2,793%',
    formula: {
      digit1: { v1: 'hu', v2: 'btu', v3: 'tbt', c: 2 },
      digit2: { v1: 'ht', v2: 'tbu', v3: 'ubu', c: 0 },
      digit3: { v1: 't', v2: 'u', v3: 'bt', c: 7 },
      bot1:   { v1: 'ht', v2: 'hu', v3: 'hbt', c: 7 },
      bot2:   { v1: 'bt', v2: 'bu', v3: 'hbt', c: 4 }
    }
  },
  {
    id: 'hyper-matrix-3d',
    name: '⚡ Hyper-Matrix 3D Alpha (RR 1:18.9 | เน้น 3 ตัวตรง)',
    description: 'สูตรเมทริกซ์จับคู่หลักสิบและผลคูณไขว้ เข้า 3 ตัวตรง 6 งวด และ 2 ตัวล่าง 7 งวด ทำกำไรสุทธิ +135,650฿',
    targetMode: 'top3',
    winRateTag: 'RR 1:18.9 | 6x Jackpot',
    formula: {
      digit1: { v1: 't', v2: 't', v3: 'hu', c: 4 },
      digit2: { v1: 'bt', v2: 'btu', v3: 'hbt', c: 9 },
      digit3: { v1: 'u', v2: 'ht', v3: 'none', c: 3 },
      bot1:   { v1: 'btu', v2: 'tbu', v3: 'tbu', c: 6 },
      bot2:   { v1: 'h', v2: 'bu', v3: 'bu', c: 5 }
    }
  },
  {
    id: 'omni-prize-quantum',
    name: '💎 Omni-Prize Quantum (ครบทุกรางวัล: ตรง+โต๊ด+บน+ล่าง)',
    description: 'เก็บครบทุกสถานะรางวัล (3ตรง 5 งวด, 3โต๊ด 1 งวด, 2บน 6 งวด, 2ล่าง 7 งวด) พร้อมอัตราเลขวิ่งเข้าเป้าสูงถึง 55.3%',
    targetMode: 'both',
    winRateTag: 'RR 1:17.5 | 55% Strike',
    formula: {
      digit1: { v1: 'u', v2: 'hbu', v3: 'none', c: 6 },
      digit2: { v1: 'ht', v2: 'tbu', v3: 'ubu', c: 0 },
      digit3: { v1: 't', v2: 'u', v3: 'bt', c: 7 },
      bot1:   { v1: 'btu', v2: 'tbu', v3: 'tbu', c: 6 },
      bot2:   { v1: 'h', v2: 'bu', v3: 'bu', c: 5 }
    }
  },
  {
    id: 'dual-2d-sniper',
    name: '🚀 Dual-2D Cash Sniper (2 ตัวบน 7 งวด + ล่าง 7 งวด)',
    description: 'เน้นกระแสเงินสดความถี่สูง เข้า 2 ตัวบน 7 งวด, 2 ตัวล่าง 7 งวด (รวม 14 ครั้ง) และพ่วงแจ็กพอต 3 ตัวตรงอีก 5 งวด',
    targetMode: 'both',
    winRateTag: 'RR 1:17.9 | 14x 2D Hits',
    formula: {
      digit1: { v1: 'u', v2: 'bu', v3: 'tbu', c: 2 },
      digit2: { v1: 'bu', v2: 'hbt', v3: 'hbu', c: 6 },
      digit3: { v1: 'h', v2: 'bu', v3: 'ht', c: 7 },
      bot1:   { v1: 'btu', v2: 'tbu', v3: 'tbu', c: 6 },
      bot2:   { v1: 'h', v2: 'bu', v3: 'bu', c: 5 }
    }
  },
  {
    id: 'linear-3var-alpha',
    name: '📐 Pure Linear 3-Factor (บวก 3 ตัวแปรล้วน ไม่ใช้คูณ)',
    description: 'สูตรบวกเชิงเส้น 3 ตัวแปรคำนวณมือได้ง่าย เข้า 3 ตรง 4 งวด, 3 โต๊ด 1 งวด, 2 บน 7 งวด, 2 ล่าง 6 งวด',
    targetMode: 'both',
    winRateTag: 'RR 1:15.9 | Easy Calc',
    formula: {
      digit1: { v1: 'h', v2: 'h', v3: 't', c: 3 },
      digit2: { v1: 'bt', v2: 'bu', v3: 'bu', c: 1 },
      digit3: { v1: 'bt', v2: 'bt', v3: 'bt', c: 0 },
      bot1:   { v1: 'h', v2: 't', v3: 'bt', c: 8 },
      bot2:   { v1: 'h', v2: 'bu', v3: 'bu', c: 5 }
    }
  },
  {
    id: 'ultimate-quant-alpha',
    name: '🏆 Classic Quant Alpha (สูตรดั้งเดิม 2 ตัวแปร)',
    description: 'สูตรดั้งเดิมใช้เพียง 2 ตัวแปร สถิติเข้า 3 ตัวตรง 3 งวด และ 2 ตัวตรง 8 งวด',
    targetMode: 'both',
    winRateTag: 'RR 1:10.5 | Classic',
    formula: {
      digit1: { v1: 'h', v2: 'bt', v3: 'none', c: 5 },
      digit2: { v1: 'h', v2: 'u',  v3: 'none', c: 1 },
      digit3: { v1: 'h', v2: 'none', v3: 'none', c: 7 },
      bot1:   { v1: 'h', v2: 'h',  v3: 'none', c: 0 },
      bot2:   { v1: 'h', v2: 'none', v3: 'none', c: 1 }
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
