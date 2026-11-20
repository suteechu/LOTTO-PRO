import { LotteryDraw } from '../types';

export const THAIORC_LOTTO_URL = 'https://horoscope.thaiorc.com/lotto/thai/stats/lottery-years10.php';

export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
] as const;

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

const THAI_MONTH_TO_NUM: Record<string, number> = {
  'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4,
  'พ.ค.': 5, 'มิ.ย.': 6, 'ก.ค.': 7, 'ส.ค.': 8,
  'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12
};

function normalizeYearToBE(rawYear: string): number {
  const num = parseInt(rawYear, 10);
  if (isNaN(num)) return 2569;
  if (rawYear.length <= 2) return 2500 + num;
  if (num < 2400) return num + 543; // CE -> BE
  return num;
}

/**
 * แปลงวันที่ภาษาไทยหรือรูปแบบ DD/MM/YYYY (พ.ศ./ค.ศ.) ให้อยู่ในฟอร์แมตมาตรฐาน "1 พ.ย. 69"
 */
export function formatThaiDateShort(rawDate: string): string {
  if (!rawDate) return '';
  const trimmed = rawDate.trim();

  // รองรับ DD/MM/YYYY หรือ DD-MM-YYYY เช่น 16/11/2569 หรือ 01/11/2569
  const slashMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (slashMatch) {
    const day = parseInt(slashMatch[1], 10);
    const monthNum = parseInt(slashMatch[2], 10);
    const yearBE = normalizeYearToBE(slashMatch[3]);
    const shortM = THAI_MONTHS_SHORT[monthNum - 1];
    if (shortM && day >= 1 && day <= 31) {
      return `${day} ${shortM} ${String(yearBE).slice(-2)}`;
    }
  }

  const match = trimmed.match(/(\d{1,2})\s*([^\s0-9]+)\s*(\d{2,4})/);
  if (!match) return trimmed;

  const day = parseInt(match[1], 10);
  const mStr = match[2].trim();
  const yearBE = normalizeYearToBE(match[3]);
  const shortM = THAI_MONTHS_MAP[mStr] || mStr;

  return `${day} ${shortM} ${String(yearBE).slice(-2)}`;
}

/**
 * แปลงวันที่มาตรฐานเป็นตัวเลข YYYYMMDD (พ.ศ.) สำหรับเรียงลำดับงวดก่อน-หลัง
 */
export function parseThaiDateSortKey(rawDate: string): number {
  const norm = formatThaiDateShort(rawDate);
  const match = norm.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{2,4})$/);
  if (!match) return 0;

  const day = parseInt(match[1], 10);
  const shortM = THAI_MONTHS_MAP[match[2]] || match[2];
  const month = THAI_MONTH_TO_NUM[shortM];
  const yearBE = normalizeYearToBE(match[3]);
  if (!month || isNaN(day)) return 0;

  return yearBE * 10000 + month * 100 + day;
}

/**
 * คืนค่าปี พ.ศ. 4 หลัก (เช่น "2569") จากวันที่งวด
 */
export function extractThaiYearBE(rawDate: string): string {
  const norm = formatThaiDateShort(rawDate);
  const match = norm.match(/(\d{2,4})\s*$/);
  if (!match) return '';
  return String(normalizeYearToBE(match[1]));
}

export interface ParsedLottoResult {
  date: string;
  top3: string;
  bot2: string;
  full6?: string;
  rawText?: string;
}

/**
 * ดึงข้อมูลผลหวยจากข้อความที่ผู้ใช้คัดลอกมาวาง (รองรับทั้งจาก ThaiORC, lottery.co.th, กองสลาก, Sanook)
 */
export function parseLottoText(text: string): ParsedLottoResult | null {
  if (!text || typeof text !== 'string') return null;

  // 1. ตรวจหาวันที่ (รองรับทั้ง 16/11/2569 และ 16 พฤศจิกายน 2569 / 16 พ.ย. 69)
  let parsedDate = '';
  let textWithoutDate = text;

  const numericDateMatch = text.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-](?:25\d{2}|20\d{2}|\d{2}))\b/);
  const thaiDateMatch = text.match(/(\d{1,2})\s*(มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม|ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*(25\d{2}|\d{2})/);

  if (numericDateMatch) {
    parsedDate = formatThaiDateShort(numericDateMatch[1]);
    textWithoutDate = text.replace(numericDateMatch[0], ' ');
  } else if (thaiDateMatch) {
    parsedDate = formatThaiDateShort(thaiDateMatch[0]);
    textWithoutDate = text.replace(thaiDateMatch[0], ' ');
  }

  // 2. ตรวจหารางวัลที่ 1 (เลข 6 หลัก)
  let full6 = '';
  const p1Match = textWithoutDate.match(/(?:รางวัลที่\s*1|รางวัลที่หนึ่ง|1st\s*Prize)\D*?(\d{6})\b/i);
  if (p1Match) {
    full6 = p1Match[1];
  } else {
    const loose6 = textWithoutDate.match(/\b\d{6}\b/);
    if (loose6) full6 = loose6[0];
  }

  // 3. ตรวจหาเลขท้าย 2 ตัว
  let bot2 = '';
  const b2Match = textWithoutDate.match(/(?:เลขท้าย\s*2\s*ตัว|2\s*ตัวล่าง|สองตัวล่าง|2\s*ตัวท้าย|2\s*ตัว|ล่าง)\D*?(\d{2})\b/i);
  if (b2Match) {
    bot2 = b2Match[1];
  } else if (full6) {
    // กรณีวางข้อมูลทั้งแถวจากตาราง ThaiORC เช่น "16/11/2569 645654 101 938 106 782 06"
    const afterFull6 = textWithoutDate.slice(textWithoutDate.indexOf(full6) + 6);
    const twoDigitMatches = afterFull6.match(/\b\d{2}\b/g);
    if (twoDigitMatches && twoDigitMatches.length > 0) {
      bot2 = twoDigitMatches[twoDigitMatches.length - 1];
    }
  }

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

function decodeHtmlBytes(buffer: ArrayBuffer, contentType = ''): string {
  const utf8 = new TextDecoder('utf-8').decode(buffer);
  const metaWin874 = /charset\s*=\s*["']?(?:windows-874|tis-620)/i.test(utf8);
  const headerWin874 = /charset\s*=\s*(?:windows-874|tis-620)/i.test(contentType);

  if (metaWin874 || headerWin874 || utf8.includes('\uFFFD')) {
    try {
      return new TextDecoder('windows-874').decode(buffer);
    } catch {
      return utf8;
    }
  }
  return utf8;
}

function cleanCellText(cell: Element | undefined): string {
  if (!cell) return '';
  return (cell.textContent || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildDrawFromCells(
  dateText: string,
  prize1Text: string,
  front3Text: string,
  back3Text: string,
  bot2Text: string
): LotteryDraw | null {
  const dateMatch = dateText.trim().match(/^(\d{1,2})\/(\d{1,2})\/(25\d{2})$/);
  const full6Match = prize1Text.replace(/\s+/g, '').match(/^(\d{6})$/);
  const bot2Match = bot2Text.replace(/\s+/g, '').match(/^(\d{2})$/);

  if (!dateMatch || !full6Match || !bot2Match) return null;

  const day = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10);
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;

  const normDate = formatThaiDateShort(`${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}`);
  const full6 = full6Match[1];
  const top3 = full6.slice(-3);
  const bot2 = bot2Match[1];

  const front3 = front3Text.match(/\d{3}/g) || [];
  const back3 = back3Text.match(/\d{3}/g) || [];

  const noteParts = [`รางวัลที่ 1: ${full6}`, `2 ตัวท้าย: ${bot2}`];
  if (front3.length > 0) noteParts.push(`หน้า ${front3.join(', ')}`);
  if (back3.length > 0) noteParts.push(`หลัง ${back3.join(', ')}`);

  return {
    id: parseThaiDateSortKey(normDate) || Date.now(),
    drawNo: 0,
    date: normDate,
    top3,
    bot2,
    full6,
    note: `${noteParts.join(' | ')} (ThaiORC)`
  };
}

/**
 * แกะตารางผลสลากจากหน้า HTML ของ horoscope.thaiorc.com/lotto/thai/stats/lottery-years10.php
 */
export function parseThaiORCHtml(html: string): LotteryDraw[] {
  if (!html || typeof html !== 'string') return [];

  const draws: LotteryDraw[] = [];
  const seen = new Set<string>();

  if (typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const rows = Array.from(doc.querySelectorAll('tr'));

    for (const row of rows) {
      const tds = Array.from(row.children).filter(el => el.tagName === 'TD');
      if (tds.length !== 5) continue;

      const parsed = buildDrawFromCells(
        cleanCellText(tds[0]),
        cleanCellText(tds[1]),
        cleanCellText(tds[2]),
        cleanCellText(tds[3]),
        cleanCellText(tds[4])
      );

      if (parsed && !seen.has(parsed.date)) {
        seen.add(parsed.date);
        draws.push(parsed);
      }
    }
    return draws;
  }

  // Fallback regex เมื่อรันนอก DOM environment
  const trRegex = /<tr\b[^>]*>((?:(?!<tr\b)[\s\S])*?)<\/tr>/gi;
  const tdRegex = /<td\b[^>]*>([\s\S]*?)<\/td>/gi;
  const stripHtml = (s: string) =>
    s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

  let trMatch: RegExpExecArray | null;
  while ((trMatch = trRegex.exec(html)) !== null) {
    const cells: string[] = [];
    let tdMatch: RegExpExecArray | null;
    tdRegex.lastIndex = 0;
    while ((tdMatch = tdRegex.exec(trMatch[1])) !== null) {
      cells.push(stripHtml(tdMatch[1]));
    }
    if (cells.length !== 5) continue;

    const parsed = buildDrawFromCells(cells[0], cells[1], cells[2], cells[3], cells[4]);
    if (parsed && !seen.has(parsed.date)) {
      seen.add(parsed.date);
      draws.push(parsed);
    }
  }

  return draws;
}

interface FetchProxyStrategy {
  name: string;
  fetchHtml: (targetUrl: string, signal: AbortSignal) => Promise<string | null>;
}

function isLocalhost(): boolean {
  return (
    typeof window !== 'undefined' &&
    /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)
  );
}

const PROXY_STRATEGIES: FetchProxyStrategy[] = [
  {
    name: 'AllOrigins Raw',
    fetchHtml: async (targetUrl, signal) => {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`, { signal });
      if (!res.ok) return null;
      return decodeHtmlBytes(await res.arrayBuffer(), res.headers.get('content-type') || '');
    }
  },
  {
    name: 'CorsProxy.io',
    fetchHtml: async (targetUrl, signal) => {
      const res = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`, { signal });
      if (!res.ok) return null;
      return decodeHtmlBytes(await res.arrayBuffer(), res.headers.get('content-type') || '');
    }
  },
  {
    name: 'AllOrigins JSON',
    fetchHtml: async (targetUrl, signal) => {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`, { signal });
      if (!res.ok) return null;
      const data = await res.json();
      return typeof data?.contents === 'string' ? data.contents : null;
    }
  },
  {
    name: 'CodeTabs Proxy',
    fetchHtml: async (targetUrl, signal) => {
      const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`, { signal });
      if (!res.ok) return null;
      return decodeHtmlBytes(await res.arrayBuffer(), res.headers.get('content-type') || '');
    }
  },
  {
    name: 'Direct',
    fetchHtml: async (targetUrl, signal) => {
      const res = await fetch(targetUrl, { signal });
      if (!res.ok) return null;
      return decodeHtmlBytes(await res.arrayBuffer(), res.headers.get('content-type') || '');
    }
  }
];

async function fetchThaiORCPage(
  page: number,
  preferredStrategyIdx = -1,
  timeoutMs = 8000
): Promise<{ draws: LotteryDraw[]; strategyIdx: number; proxyName: string } | null> {
  const query = page <= 1 ? '' : `?pg=${page}`;
  const targetUrl = `${THAIORC_LOTTO_URL}${query}`;

  // เมื่อรันบน Vite Dev Server (localhost) ให้ลองผ่าน local proxy ก่อนเพื่อหลีกเลี่ยง CORS
  if (isLocalhost() && preferredStrategyIdx === -1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`/api/thaiorc${query}`, { signal: controller.signal });
      clearTimeout(timer);
      if (res.ok) {
        const html = decodeHtmlBytes(await res.arrayBuffer(), res.headers.get('content-type') || '');
        const parsed = parseThaiORCHtml(html);
        if (parsed.length > 0) {
          return { draws: parsed, strategyIdx: -1, proxyName: 'Vite Local Proxy' };
        }
      }
    } catch {
      clearTimeout(timer);
    }
  }

  const startIdx = preferredStrategyIdx < 0 ? 0 : preferredStrategyIdx;
  const order = [
    startIdx,
    ...PROXY_STRATEGIES.map((_, idx) => idx).filter(idx => idx !== startIdx)
  ];

  for (const idx of order) {
    const strategy = PROXY_STRATEGIES[idx];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const html = await strategy.fetchHtml(targetUrl, controller.signal);
      clearTimeout(timer);
      if (!html) continue;

      const parsed = parseThaiORCHtml(html);
      if (parsed.length > 0) {
        return { draws: parsed, strategyIdx: idx, proxyName: strategy.name };
      }
    } catch {
      clearTimeout(timer);
    }
  }

  return null;
}

export interface OnlineDrawsSyncResult {
  draws: LotteryDraw[];
  pagesFetched: number;
  source: string;
  error?: string;
}

/**
 * ดึงผลสลากย้อนหลังหลายหน้าจาก horoscope.thaiorc.com/lotto/thai/stats/lottery-years10.php
 * หยุดอัตโนมัติทันทีเมื่อเจอหน้าที่ไม่พบงวดใหม่เพิ่มเติม (รองรับกรณีเซิร์ฟเวอร์จำกัดหน้าสูงสุด)
 */
export async function fetchOnlineDrawsFromThaiORC(options?: {
  maxPages?: number;
  onProgress?: (page: number, collectedCount: number) => void;
}): Promise<OnlineDrawsSyncResult> {
  const maxPages = Math.max(1, Math.min(options?.maxPages ?? 8, 8));
  const collected: LotteryDraw[] = [];
  const seenDates = new Set<string>();

  let preferredStrategyIdx = isLocalhost() ? -1 : 0;
  let usedProxyName = '';
  let pagesFetched = 0;

  for (let page = 1; page <= maxPages; page++) {
    const res = await fetchThaiORCPage(page, preferredStrategyIdx);
    if (!res) {
      if (page === 1) {
        return {
          draws: [],
          pagesFetched: 0,
          source: 'ThaiORC',
          error: 'ไม่สามารถเชื่อมต่อผ่าน CORS Proxy ไปยัง ThaiORC ได้'
        };
      }
      break;
    }

    preferredStrategyIdx = res.strategyIdx;
    usedProxyName = res.proxyName;
    pagesFetched++;

    const newOnPage = res.draws.filter(d => !seenDates.has(d.date));
    if (newOnPage.length === 0) {
      // เซิร์ฟเวอร์ส่งข้อมูลซ้ำหน้าเดิม (เช่น pg >= 6 คืนหน้า 5) จึงหยุดดึงทันที
      break;
    }

    for (const d of newOnPage) {
      seenDates.add(d.date);
      collected.push(d);
    }

    options?.onProgress?.(page, collected.length);
  }

  return {
    draws: collected,
    pagesFetched,
    source: usedProxyName ? `ThaiORC (${usedProxyName})` : 'ThaiORC'
  };
}

/**
 * ดึงผลสลากงวดล่าสุด 1 งวดจาก horoscope.thaiorc.com/lotto/thai/stats/lottery-years10.php
 */
export async function fetchOnlineLatestDraw(): Promise<LotteryDraw | null> {
  const result = await fetchOnlineDrawsFromThaiORC({ maxPages: 1 });
  return result.draws[0] || null;
}
