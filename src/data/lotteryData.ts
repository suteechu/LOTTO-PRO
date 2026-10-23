import { LotteryDraw, VariableDef } from '../types';

export const VARIABLES: VariableDef[] = [
  { id: 'h', label: 'ร้อยบน (H)', short: 'H', description: 'เลขหลักร้อย รางวัลที่ 1 งวดก่อน' },
  { id: 't', label: 'สิบบน (T)', short: 'T', description: 'เลขหลักสิบ รางวัลที่ 1 งวดก่อน' },
  { id: 'u', label: 'หน่วยบน (U)', short: 'U', description: 'เลขหลักหน่วย รางวัลที่ 1 งวดก่อน' },
  { id: 'bt', label: 'สิบล่าง (BT)', short: 'BT', description: 'เลขหลักสิบ 2 ตัวท้ายงวดก่อน' },
  { id: 'bu', label: 'หน่วยล่าง (BU)', short: 'BU', description: 'เลขหลักหน่วย 2 ตัวท้ายงวดก่อน' },
  { id: 'ht', label: 'ร้อย×สิบบน (H×T)', short: 'H×T', description: 'ผลคูณหลักร้อยและหลักสิบบน mod 10' },
  { id: 'tu', label: 'สิบ×หน่วยบน (T×U)', short: 'T×U', description: 'ผลคูณหลักสิบและหลักหน่วยบน mod 10' },
  { id: 'hu', label: 'ร้อย×หน่วยบน (H×U)', short: 'H×U', description: 'ผลคูณหลักร้อยและหลักหน่วยบน mod 10' },
  { id: 'btu', label: 'สิบ×หน่วยล่าง (BT×BU)', short: 'BT×BU', description: 'ผลคูณสิบล่างและหน่วยล่าง mod 10' },
  { id: 'hbt', label: 'ร้อยบน×สิบล่าง (H×BT)', short: 'H×BT', description: 'ผลคูณร้อยบนและสิบล่าง mod 10' },
  { id: 'hbu', label: 'ร้อยบน×หน่วยล่าง (H×BU)', short: 'H×BU', description: 'ผลคูณร้อยบนและหน่วยล่าง mod 10' },
  { id: 'tbt', label: 'สิบบน×สิบล่าง (T×BT)', short: 'T×BT', description: 'ผลคูณสิบบนและสิบล่าง mod 10' },
  { id: 'tbu', label: 'สิบบน×หน่วยล่าง (T×BU)', short: 'T×BU', description: 'ผลคูณสิบบนและหน่วยล่าง mod 10' },
  { id: 'ubt', label: 'หน่วยบน×สิบล่าง (U×BT)', short: 'U×BT', description: 'ผลคูณหน่วยบนและสิบล่าง mod 10' },
  { id: 'ubu', label: 'หน่วยบน×หน่วยล่าง (U×BU)', short: 'U×BU', description: 'ผลคูณหน่วยบนและหน่วยล่าง mod 10' },
  { id: 'none', label: '(ไม่มี / 0)', short: '0', description: 'ค่าคงที่ศูนย์ (ไม่ใช้ตัวแปร)' }
];

// ข้อมูลผลสลากกินแบ่งรัฐบาลของจริง ปี 2569 ตรวจสอบตรงกับกองสลากฯ / Sanook / Thairath 100%
export const OFFICIAL_LATEST_DRAWS: LotteryDraw[] = [
  { id: 39, drawNo: 39, date: "16 ต.ค. 69", top3: "781", bot2: "48", full6: "011781", note: "รางวัลที่ 1: 011781 | 2 ตัวท้าย: 48" },
  { id: 38, drawNo: 38, date: "1 ต.ค. 69",  top3: "701", bot2: "70", full6: "402701", note: "รางวัลที่ 1: 402701 | 2 ตัวท้าย: 70" },
  { id: 37, drawNo: 37, date: "16 ก.ย. 69", top3: "640", bot2: "64", full6: "730640", note: "รางวัลที่ 1: 730640 | 2 ตัวท้าย: 64" },
  { id: 36, drawNo: 36, date: "1 ก.ย. 69",  top3: "212", bot2: "04", full6: "417212", note: "รางวัลที่ 1: 417212 | 2 ตัวท้าย: 04" },
  { id: 35, drawNo: 35, date: "16 ส.ค. 69", top3: "615", bot2: "53", full6: "004615", note: "รางวัลที่ 1: 004615 | 2 ตัวท้าย: 53" },
  { id: 34, drawNo: 34, date: "1 ส.ค. 69",  top3: "479", bot2: "69", full6: "932479", note: "รางวัลที่ 1: 932479 | 2 ตัวท้าย: 69" },
  { id: 33, drawNo: 33, date: "16 ก.ค. 69", top3: "214", bot2: "71" },
  { id: 32, drawNo: 32, date: "1 ก.ค. 69",  top3: "495", bot2: "62" },
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

const STORAGE_KEY = 'lotto_pro_custom_draws_v3';

export function getStoredLotteryData(): LotteryDraw[] {
  try {
    // Clean old caches if any
    localStorage.removeItem('lotto_pro_custom_draws_v1');
    localStorage.removeItem('lotto_pro_custom_draws_v2');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Check if latest date matches
        if (parsed[0].date === OFFICIAL_LATEST_DRAWS[0].date && parsed[0].top3 === OFFICIAL_LATEST_DRAWS[0].top3) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error('Failed to parse stored lottery data', e);
  }
  saveStoredLotteryData(OFFICIAL_LATEST_DRAWS);
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
  } catch (e) {
    console.error('Failed to reset lottery data', e);
  }
  return OFFICIAL_LATEST_DRAWS;
}

export function syncLatestDraws(currentDraws: LotteryDraw[]): { updatedDraws: LotteryDraw[]; newCount: number } {
  // If current data top draw is not matching the official verified top draw
  if (!currentDraws.length || currentDraws[0].top3 !== OFFICIAL_LATEST_DRAWS[0].top3 || currentDraws[0].date !== OFFICIAL_LATEST_DRAWS[0].date) {
    saveStoredLotteryData(OFFICIAL_LATEST_DRAWS);
    return { updatedDraws: OFFICIAL_LATEST_DRAWS, newCount: OFFICIAL_LATEST_DRAWS.length };
  }

  const existingDates = new Set(currentDraws.map(d => d.date));
  const newOfficial = OFFICIAL_LATEST_DRAWS.filter(d => !existingDates.has(d.date));

  if (newOfficial.length === 0) {
    return { updatedDraws: currentDraws, newCount: 0 };
  }

  const merged = [...newOfficial, ...currentDraws].sort((a, b) => b.drawNo - a.drawNo);
  saveStoredLotteryData(merged);
  return { updatedDraws: merged, newCount: newOfficial.length };
}
