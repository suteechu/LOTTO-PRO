import { LotteryDraw } from '../types';

export const THAI_MONTHS_MAP: Record<string, string> = {
  'มกราคม': 'ม.ค.', 'ม.ค.': 'ม.ค.', 'ม.ค': 'ม.ค.',
  'กุมภาพันธ์': 'ก.พ.', 'ก.พ.': 'ก.พ.', 'ก.พ': 'ก.พ.',
  'มีนาคม': 'มี.ค.', 'มี.ค.': 'มี.ค.', 'มี.ค': 'มี.ค.',
  'เมษายน': 'เม.ย.', 'เม.ย.': 'เม.ย.', 'เม.ย': 'เม.ย.',
  'พฤษภาคม': 'พ.ค.', 'พ.ค.': 'พ.ค.', 'พ.ค': 'พ.ค.',
  'มิถุนายน': 'มิ.ย.', 'มิ.ย.': 'มิ.ย.', 'มิ.ย': 'มิ.ย.',
  'กรกฎาคม': 'ก.ค.', 'ก.ค.': 'ก.ค.', 'ก.ค': 'ก.ค.',
  'สิงหาคม': 'ส.ค.', 'ส.ค.': 'ส.ค.', 'ส.ค': 'ส.ค.',
  'กันยายน': 'ก.ย.', 'ก.ย.': 'ก.ย.', 'ก.ย': 'ก.ย.',
  'ตุลาคม': 'ต.ค.', 'ต.ค.': 'ต.ค.', 'ต.ค': 'ต.ค.',
  'พฤศจิกายน': 'พ.ย.', 'พ.ย.': 'พ.ย.', 'พ.ย': 'พ.ย.',
  'ธันวาคม': 'ธ.ค.', 'ธ.ค.': 'ธ.ค.', 'ธ.ค': 'ธ.ค.'
};

/**
 * แปลงวันที่ภาษาไทยในรูปแบบต่างๆ (เช่น 1 พฤศจิกายน 2569 หรือ 01 พ.ย. 2569) ให้อยู่ในฟอร์แมตมาตรฐาน "1 พ.ย. 69"
 */
export function formatThaiDateShort(rawDate: string): string {
  if (!rawDate) return '';
  const match = rawDate.match(/(\d{1,2})\s*([^\s0-9]+)\s*(\d{2,4})/);
  if (!match) return rawDate.trim();

  const day = parseInt(match[1], 10);
  const mStr = match[2].trim();
  const yStr = match[3].slice(-2);
  const shortM = THAI_MONTHS_MAP[mStr] || mStr;

  return `${day} ${shortM} ${yStr}`;
}

export interface ParsedLottoResult {
  date: string;
  top3: string;
  bot2: string;
  full6?: string;
  rawText?: string;
}

/**
 * ดึงข้อมูลผลหวยจากข้อความ หรือ HTML ที่คัดลอกมาจาก Sanook / กองสลาก / ข่าวออนไลน์
 */
export function parseLottoText(text: string): ParsedLottoResult | null {
  if (!text || typeof text !== 'string') return null;

  // 1. ตรวจหาวันที่ เช่น 1 พฤศจิกายน 2569 หรือ 1 พ.ย. 69
  const dateMatch = text.match(/(\d{1,2})\s*(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม|ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*(25\d{2}|\d{2})/);
  let parsedDate = '';
  if (dateMatch) {
    parsedDate = formatThaiDateShort(dateMatch[0]);
  }

  // 2. ตรวจหารางวัลที่ 1 (เลข 6 หลัก)
  let full6 = '';
  const p1Match = text.match(/(?:รางวัลที่\s*1|รางวัลที่หนึ่ง|1st\s*Prize)\D*?(\d{6})\b/i);
  if (p1Match) {
    full6 = p1Match[1];
  } else {
    // ถ้าไม่มีคำว่ารางวัลที่ 1 ให้หาเลข 6 หลักโดดๆ ตัวแรก
    const loose6 = text.match(/\b\d{6}\b/);
    if (loose6) full6 = loose6[0];
  }

  // 3. ตรวจหา 2 ตัวท้าย
  let bot2 = '';
  const b2Match = text.match(/(?:เลขท้าย\s*2\s*ตัว|2\s*ตัวล่าง|สองตัวล่าง|2\s*ตัวท้าย|ล่าง)\D*?(\d{2})\b/i);
  if (b2Match) {
    bot2 = b2Match[1];
  }

  // ถ้าได้ full6 มา ดึง 3 ตัวบนได้
  const top3 = full6.length === 6 ? full6.slice(-3) : '';

  if (!top3 && !bot2) return null;

  return {
    date: parsedDate,
    top3,
    bot2,
    full6: full6 || undefined,
    rawText: text.slice(0, 150)
  };
}

/**
 * ทำการดึงผลสลากงวดล่าสุดแบบอัตโนมัติจาก Public Lottery APIs และ CORS Web Mirrors
 */
export async function fetchOnlineLatestDraw(): Promise<LotteryDraw | null> {
  const timeoutMs = 4500;

  // แหล่งที่ 1: Rayriffy Open Lottery API (JSON ตรง)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch('https://lotto.api.rayriffy.com/latest', {
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.response) {
        const rawDate = data.response.date || '';
        const normDate = formatThaiDateShort(rawDate);

        const p1 = data.response.prizes?.find((p: any) => p.id === 'prizeFirst')?.number?.[0] || '';
        const b2 = data.response.runningNumbers?.find((p: any) => p.id === 'runningNumberBottomTwo')?.number?.[0] || '';

        if (p1 && p1.length === 6 && b2 && b2.length === 2) {
          const top3 = p1.slice(-3);
          return {
            id: Date.now(),
            drawNo: 0, // จะถูกคำนวณใหม่ตอนรวม
            date: normDate,
            top3,
            bot2: b2,
            full6: p1,
            note: `รางวัลที่ 1: ${p1} | 2 ตัวท้าย: ${b2} (ดึงอัตโนมัติจาก Rayriffy API)`
          };
        }
      }
    }
  } catch (e) {
    // ลองแหล่งถัดไป
  }

  // แหล่งที่ 2: ดึงจาก Sanook Lotto ผ่าน AllOrigins CORS Proxy
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const targetUrl = 'https://news.sanook.com/lotto/';
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const html = await res.text();
      const parsed = parseLottoText(html);
      if (parsed && parsed.top3 && parsed.bot2 && parsed.date) {
        return {
          id: Date.now(),
          drawNo: 0,
          date: parsed.date,
          top3: parsed.top3,
          bot2: parsed.bot2,
          full6: parsed.full6,
          note: `รางวัลที่ 1: ${parsed.full6 || parsed.top3} | 2 ตัวท้าย: ${parsed.bot2} (ดึงอัตโนมัติจาก Sanook via Mirror)`
        };
      }
    }
  } catch (e) {
    // ลองแหล่งถัดไป
  }

  // แหล่งที่ 3: ดึงผ่าน CorsProxy.io
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const targetUrl = 'https://news.sanook.com/lotto/';
    const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`;

    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      const html = await res.text();
      const parsed = parseLottoText(html);
      if (parsed && parsed.top3 && parsed.bot2 && parsed.date) {
        return {
          id: Date.now(),
          drawNo: 0,
          date: parsed.date,
          top3: parsed.top3,
          bot2: parsed.bot2,
          full6: parsed.full6,
          note: `รางวัลที่ 1: ${parsed.full6 || parsed.top3} | 2 ตัวท้าย: ${parsed.bot2} (ดึงอัตโนมัติจาก Sanook via CorsProxy)`
        };
      }
    }
  } catch (e) {
    // ทั้งหมดล้มเหลว (อาจไม่มีเน็ตหรือ CORS ติดบล็อก)
  }

  return null;
}
