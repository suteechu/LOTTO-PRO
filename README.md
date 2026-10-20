# 🎰 LOTTO-PRO TERMINAL v3.5 PRO

> **Quantitative Thai Lottery Backtester & Algorithmic Auto-Optimizer**  
> แอประบบวิเคราะห์สถิติหวยรัฐบาลไทย สไตล์กระดานเทรดคริปโต / ไฟแนนเชียลเทอร์มินัล (Bloomberg & Binance Dark Theme)

---

## ✨ ไฮไลท์ฟังก์ชันสำคัญ (Key Features)

1. **🤖 AI Quant Auto-Tuning Engine**
   - อัลกอริทึมค้นหาสูตรคำนวณที่ดีที่สุดอัตโนมัติ (Brute-force optimization 1,800+ รูปแบบ)
   - ปรับสูตรคำนวณแยกอิสระทั้ง 3 ตัวบน (หลักร้อย, หลักสิบ, หลักหน่วย) และ 2 ตัวล่าง
   - เพิ่มโอกาสทำกำไรและอัตราความแม่นยำสูงสุดตามสถิติจริง

2. **📊 Quantitative Modular Formula Engine**
   - คำนวณแบบโมดูลาร์: `(ตัวแปร 1 + ตัวแปร 2 + ค่าคงที่ C) mod 10`
   - รองรับตัวแปรหลัก: `H (ร้อยบน)`, `T (สิบบน)`, `U (หน่วยบน)`, `BT (สิบล่าง)`, `BU (หน่วยล่าง)`, และค่าคงที่
   - สลับสูตรสำเร็จรูปผ่าน **คลังสูตรเซียน (Battle-Tested Presets)**:
     - 🎯 *AI Direct Jackpot (เน้น 3 ตัวตรง)*
     - ⚡ *Master Runner (เน้นเลขวิ่ง-รูด 1D+ อัตราเข้าเป้า 85%+)*
     - 💰 *2-Digit Cashflow (เน้น 2 ตัวล่าง)*
     - 📊 *Statistical Momentum (ค่าเฉลี่ยสถิติ)*

3. **📈 Financial Equity Curve (กราฟ P&L จำลอง)**
   - คำนวณผลตอบแทนสะสม (Simulated Cumulative P&L) ทุกงวดประวัติศาสตร์
   - แสดงจุดสูงสุด-ต่ำสุด และ ROI % เสมือนการทดสอบระบบเทรดเชิงปริมาณ

4. **🔥 Volume (Hot / Cold) & Statistical Matrix**
   - โซนเลขมาแรง (Hot Zone) และเลขค้างออก (Cold Zone)
   - กราฟแท่งกระจายตัว 0 - 9 พร้อมนับงวดที่เว้นว่าง (Gap / Skip Analysis)
   - มิเตอร์เปรียบเทียบสัดส่วนเลขคู่/คี่ (Odd/Even) และเลขสูง/ต่ำ (High/Low)

5. **📋 Backtest Execution Log (ตารางคำนวณย้อนหลัง)**
   - ไฮไลท์ตัวเลขที่ตรงตำแหน่งด้วยสีเขียวนีออน
   - ตรวจจับรางวัล 3 ตัวตรง, 3 ตัวโต๊ด, 2 ตัวบน, 2 ตัวล่าง และเลขวิ่ง
   - ตัวกรองแยกหมวดหมู่และช่องค้นหาอัจฉริยะ

6. **🎫 Digital Prediction Slip (ใบแนวทางสลาก)**
   - สรุปตัวเลขทำนายงวดถัดไป พร้อมชุดโต๊ด และเลขวิ่งบน-ล่าง
   - ปุ่มคัดลอกข้อความจัดรูปแบบสวยงาม พร้อมส่งต่อทาง Line หรือ Facebook ได้ทันที

7. **⚡ เพิ่มงวดใหม่ & บันทึกข้อมูลอัตโนมัติ (Local Persistence)**
   - เพิ่มผลการออกรางวัลจริงงวดล่าสุดได้ง่ายๆ ใน 3 วินาที
   - บันทึกฐานข้อมูลลงในเบราว์เซอร์อัตโนมัติ ไม่ต้องกลัวข้อมูลหาย
   - ส่งออกข้อมูลเป็นไฟล์ Excel / CSV ได้ทุกเมื่อ

8. **🔊 Built-in Web Audio Synthesizer**
   - มีระบบเสียงสังเคราะห์สไตล์ Terminal (Beeper & Success Chimes) เปิด-ปิดได้ตามต้องการ

---

## 🚀 เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** React 19 + TypeScript
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Audio:** Web Audio API
- **Deployment:** GitHub Pages Ready

---

## 💻 วิธีการรันบนเครื่องของคุณ (Getting Started)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มรันเซิร์ฟเวอร์สำหรับพัฒนา (Development Mode)
npm run dev

# 3. บิลด์สำหรับ Production
npm run build

# 4. ทดสอบพรีวิวผลลัพธ์
npm run preview
```

---

## 🌐 การนำขึ้น GitHub Pages (Deployment)

โปรเจกต์ตั้งค่าพร้อมขึ้น GitHub Pages ได้ทันที:

```bash
npm run deploy
```

---

*Disclaimer: ระบบนี้พัฒนาขึ้นเพื่อการวิเคราะห์สถิติและการทดสอบทางคณิตศาสตร์เชิงปริมาณเท่านั้น*
