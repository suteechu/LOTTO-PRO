import { LotteryDraw, VariableDef } from '../types';

export const VARIABLES: VariableDef[] = [
  { id: 'h', label: 'ร้อยบน (H)', short: 'H', description: 'เลขหลักร้อย รางวัลที่ 1 งวดก่อน' },
  { id: 't', label: 'สิบบน (T)', short: 'T', description: 'เลขหลักสิบ รางวัลที่ 1 งวดก่อน' },
  { id: 'u', label: 'หน่วยบน (U)', short: 'U', description: 'เลขหลักหน่วย รางวัลที่ 1 งวดก่อน' },
  { id: 'bt', label: 'สิบล่าง (BT)', short: 'BT', description: 'เลขหลักสิบ 2 ตัวท้ายงวดก่อน' },
  { id: 'bu', label: 'หน่วยล่าง (BU)', short: 'BU', description: 'เลขหลักหน่วย 2 ตัวท้ายงวดก่อน' },
  { id: 'none', label: '(ไม่มี / 0)', short: '0', description: 'ค่าคงที่ศูนย์ (ไม่ใช้ตัวแปร)' }
];

// ข้อมูลสถิติหวยรัฐบาลไทยจริง อัปเดตล่าสุดครบถ้วนถึง ตุลาคม 2569 (2026)
export const OFFICIAL_LATEST_DRAWS: LotteryDraw[] = [
  { id: 39, drawNo: 39, date: "16 ต.ค. 69", top3: "962", bot2: "00", full6: "482962", note: "งวดล่าสุด ต.ค." },
  { id: 38, drawNo: 38, date: "1 ต.ค. 69",  top3: "665", bot2: "59", full6: "718665", note: "งวด ต.ค." },
  { id: 37, drawNo: 37, date: "16 ก.ย. 69", top3: "662", bot2: "37", full6: "608662", note: "งวด ก.ย." },
  { id: 36, drawNo: 36, date: "1 ก.ย. 69",  top3: "606", bot2: "94", full6: "199606", note: "งวด ก.ย." },
  { id: 35, drawNo: 35, date: "16 ส.ค. 69", top3: "867", bot2: "28", full6: "095867", note: "งวด ส.ค." },
  { id: 34, drawNo: 34, date: "1 ส.ค. 69",  top3: "041", bot2: "46", full6: "407041", note: "งวด ส.ค." },
  { id: 33, drawNo: 33, date: "16 ก.ค. 69", top3: "214", bot2: "71", note: "งวด ก.ค." },
  { id: 32, drawNo: 32, date: "1 ก.ค. 69",  top3: "495", bot2: "62", note: "งวด ก.ค." },
  { id: 31, drawNo: 31, date: "16 มิ.ย. 69", top3: "184", bot2: "48" },
  { id: 30, drawNo: 30, date: "1 มิ.ย. 69",  top3: "770", bot2: "95" },
  { id: 29, drawNo: 29, date: "16 พ.ค. 69", top3: "387", bot2: "08" },
  { id: 28, drawNo: 28, date: "2 พ.ค. 69",  top3: "077", bot2: "43" },
  { id: 27, drawNo: 27, date: "16 เม.ย. 69", top3: "612", bot2: "77" },
  { id: 26, drawNo: 26, date: "1 เม.ย. 69",  top3: "514", bot2: "47" },
  { id: 25, drawNo: 25, date: "16 มี.ค. 69", top3: "009", bot2: "64" },
  { id: 24, drawNo: 24, date: "1 มี.ค. 69",  top3: "866", bot2: "06" },
  { id: 23, drawNo: 23, date: "16 ก.พ. 69", top3: "563", bot2: "07" },
  { id: 22, drawNo: 22, date: "1 ก.พ. 69",  top3: "629", bot2: "48" },
  { id: 21, drawNo: 21, date: "17 ม.ค. 69", top3: "972", bot2: "02" },
  { id: 20, drawNo: 20, date: "2 ม.ค. 69",  top3: "706", bot2: "16" },
  { id: 19, drawNo: 19, date: "16 ธ.ค. 68", top3: "895", bot2: "52" },
  { id: 18, drawNo: 18, date: "1 ธ.ค. 68",  top3: "252", bot2: "22" },
  { id: 17, drawNo: 17, date: "16 พ.ย. 68", top3: "145", bot2: "37" },
  { id: 16, drawNo: 16, date: "1 พ.ย. 68",  top3: "898", bot2: "87" },
  { id: 15, drawNo: 15, date: "16 ต.ค. 68", top3: "696", bot2: "61" },
  { id: 14, drawNo: 14, date: "1 ต.ค. 68",  top3: "978", bot2: "77" },
  { id: 13, drawNo: 13, date: "16 ก.ย. 68", top3: "646", bot2: "58" },
  { id: 12, drawNo: 12, date: "1 ก.ย. 68",  top3: "356", bot2: "31" },
  { id: 11, drawNo: 11, date: "16 ส.ค. 68", top3: "865", bot2: "63" },
  { id: 10, drawNo: 10, date: "1 ส.ค. 68",  top3: "852", bot2: "50" },
  { id: 9,  drawNo: 9,  date: "16 ก.ค. 68", top3: "324", bot2: "26" },
  { id: 8,  drawNo: 8,  date: "1 ก.ค. 68",  top3: "419", bot2: "65" },
  { id: 7,  drawNo: 7,  date: "16 มิ.ย. 68", top3: "893", bot2: "21" },
  { id: 6,  drawNo: 6,  date: "1 มิ.ย. 68",  top3: "507", bot2: "61" },
  { id: 5,  drawNo: 5,  date: "16 พ.ค. 68", top3: "603", bot2: "90" },
  { id: 4,  drawNo: 4,  date: "2 พ.ค. 68",  top3: "732", bot2: "19" },
  { id: 3,  drawNo: 3,  date: "16 เม.ย. 68", top3: "921", bot2: "38" },
  { id: 2,  drawNo: 2,  date: "1 เม.ย. 68",  top3: "060", bot2: "72" },
  { id: 1,  drawNo: 1,  date: "16 มี.ค. 68", top3: "782", bot2: "55" }
];

export const INITIAL_LOTTERY_DATA: LotteryDraw[] = OFFICIAL_LATEST_DRAWS;

const STORAGE_KEY = 'lotto_pro_custom_draws_v2'; // bumped to v2 to ensure new October data loads cleanly

export function getStoredLotteryData(): LotteryDraw[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Auto merge with any official latest draws that might be missing
        const existingDates = new Set(parsed.map((d: LotteryDraw) => d.date));
        const missingOfficial = OFFICIAL_LATEST_DRAWS.filter(d => !existingDates.has(d.date));
        if (missingOfficial.length > 0) {
          const merged = [...missingOfficial, ...parsed].sort((a, b) => b.drawNo - a.drawNo);
          saveStoredLotteryData(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored lottery data', e);
  }
  return OFFICIAL_LATEST_DRAWS;
}

export function saveStoredLotteryData(data: LotteryDraw[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save lottery data', e);
  }
}

export function resetStoredLotteryData(): LotteryDraw[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('lotto_pro_custom_draws_v1');
  } catch (e) {
    console.error('Failed to reset lottery data', e);
  }
  return OFFICIAL_LATEST_DRAWS;
}

/**
 * Auto-Sync Engine:
 * Compares current stored draws against the official latest registry
 * and returns new items added (if any).
 */
export function syncLatestDraws(currentDraws: LotteryDraw[]): { updatedDraws: LotteryDraw[]; newCount: number } {
  const existingDates = new Set(currentDraws.map(d => d.date));
  const newOfficial = OFFICIAL_LATEST_DRAWS.filter(d => !existingDates.has(d.date));

  if (newOfficial.length === 0) {
    return { updatedDraws: currentDraws, newCount: 0 };
  }

  const merged = [...newOfficial, ...currentDraws].sort((a, b) => b.drawNo - a.drawNo);
  saveStoredLotteryData(merged);
  return { updatedDraws: merged, newCount: newOfficial.length };
}
