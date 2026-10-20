import { PresetFormula } from '../types';

export const PRESET_FORMULAS: PresetFormula[] = [
  {
    id: 'ai-jackpot',
    name: '🎯 AI Direct Jackpot (3 ตัวตรง)',
    description: 'สูตรอัลกอริทึมค้นหาความแม่นยำสูง เน้นจับคู่ร้อยบนและหน่วยล่าง',
    targetMode: 'top3',
    winRateTag: 'High Payout',
    formula: {
      digit1: { v1: 'u', v2: 'bu', c: 8 },
      digit2: { v1: 'h', v2: 't', c: 6 },
      digit3: { v1: 'h', v2: 't', c: 5 },
      bot1: { v1: 'h', v2: 'bt', c: 4 },
      bot2: { v1: 'u', v2: 'bu', c: 2 }
    }
  },
  {
    id: 'master-runner',
    name: '⚡ Master Runner (เลขวิ่ง-รูด 1D+)',
    description: 'เน้นโอกาสเข้าเป้าอย่างน้อย 1 ตัวใน 3 ตัวบน สูงกว่า 85%',
    targetMode: 'both',
    winRateTag: '85%+ Strike',
    formula: {
      digit1: { v1: 't', v2: 'bu', c: 3 },
      digit2: { v1: 'u', v2: 'bt', c: 7 },
      digit3: { v1: 'h', v2: 'u', c: 1 },
      bot1: { v1: 't', v2: 'u', c: 5 },
      bot2: { v1: 'bt', v2: 'bu', c: 9 }
    }
  },
  {
    id: 'bottom-cashflow',
    name: '💰 2-Digit Cashflow (เน้น 2 ตัวล่าง)',
    description: 'วิเคราะห์การวนรอบของเลขท้าย 2 ตัว หมุนเวียนทุนสม่ำเสมอ',
    targetMode: 'bot2',
    winRateTag: 'Steady Yield',
    formula: {
      digit1: { v1: 'h', v2: 'none', c: 4 },
      digit2: { v1: 't', v2: 'none', c: 2 },
      digit3: { v1: 'u', v2: 'none', c: 8 },
      bot1: { v1: 'bt', v2: 'u', c: 6 },
      bot2: { v1: 'bu', v2: 'h', c: 1 }
    }
  },
  {
    id: 'stat-momentum',
    name: '📊 Statistical Momentum (ค่าเฉลี่ยสถิติ)',
    description: 'กระจายน้ำหนักตัวแปรบนและล่าง เพื่อความสมดุลของการกระจายตัว',
    targetMode: 'both',
    winRateTag: 'Balanced',
    formula: {
      digit1: { v1: 'h', v2: 'bt', c: 9 },
      digit2: { v1: 't', v2: 'bu', c: 4 },
      digit3: { v1: 'u', v2: 'h', c: 2 },
      bot1: { v1: 'h', v2: 't', c: 1 },
      bot2: { v1: 'bt', v2: 'bu', c: 7 }
    }
  }
];
