<div align="center">

# CCTV Monitoring Dashboard

**ระบบติดตามกล้องวงจรปิดและวิเคราะห์เหตุการณ์จราจรแบบเรียลไทม์ สำหรับเมืองอัจฉริยะ**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/status-prototype-orange)

</div>

---

## ภาพรวม

CCTV Monitoring Dashboard เป็นเว็บแอปพลิเคชันสำหรับเฝ้าระวังและบริหารจัดการเหตุการณ์จราจรจากกล้อง CCTV หลายจุด แบ่งการใช้งานเป็น 2 ส่วน

| ส่วนงาน | ผู้ใช้ | จุดประสงค์ |
|---|---|---|
| **Dashboard** | เจ้าหน้าที่ควบคุมจราจร | ดูภาพสดจากกล้อง ตรวจสอบเหตุการณ์ และวิเคราะห์สถิติการจราจร |
| **Citizen Portal** | ประชาชนทั่วไป | ดูแผนที่จราจรและคุณภาพอากาศ รับประกาศ และแจ้งเหตุ |

> **สถานะโครงการ:** ต้นแบบ (prototype) ภาพกล้องสดใช้สตรีมสาธารณะของ Caltrans เพื่อสาธิตการทำงาน ส่วนข้อมูลเหตุการณ์และสถิติเป็นข้อมูลจำลอง รอเชื่อมต่อกับ Backend และฐานข้อมูลจริง

## คุณสมบัติ

### สำหรับเจ้าหน้าที่ (Dashboard)
- **Live Monitoring** – เล่นสตรีมกล้องสดแบบ HLS (Play/Pause, Mute, Fullscreen) กล้องที่ออฟไลน์หรือสตรีมเสียจะแสดงสถานะ `OFFLINE`
- **Dashboard** – ภาพรวมจำนวนกล้อง สถานะออนไลน์ และสถิติการฝ่าฝืน
- **Events** – รายการเหตุการณ์พร้อมตัวกรองตามประเภทและแผงรายละเอียด
- **Traffic Analytics** – กราฟวิเคราะห์ปริมาณการจราจรด้วย Recharts

### สำหรับประชาชน (Citizen Portal)
- **คุณภาพอากาศและสภาพอากาศ** – ค่า PM2.5 ตามพื้นที่ที่เลือก จาก AQICN, Air4Thai และ Open-Meteo
- **แผนที่แบบโต้ตอบ** – แผนที่ Leaflet สลับโหมดการจราจร / คุณภาพอากาศ (AQI)
- **ประกาศและข่าวสาร** – แยกระดับ ฉุกเฉิน / เตือน / ข้อมูลทั่วไป
- **แจ้งเหตุ** – แบบฟอร์มรายงานปัญหาพร้อมแนบรูปภาพ
- **กิจกรรมและเหตุการณ์สำคัญ**
- **ธีมสว่าง/มืด** – ค่าเริ่มต้นเป็นธีมสว่าง

## เทคโนโลยี

| ด้าน | เครื่องมือ |
|---|---|
| Framework | React 18, TypeScript, React Router |
| Build | Vite 6 (SWC) |
| Styling | Tailwind CSS 4 (Vite plugin), Radix UI, ฟอนต์ Prompt |
| วิดีโอ | hls.js |
| แผนที่ | Leaflet, react-leaflet |
| กราฟ | Recharts |
| Backend | Vercel Serverless Functions (`api/`) |

## เริ่มต้นใช้งาน

### ความต้องการ
- Node.js 18 ขึ้นไป
- npm

### ติดตั้งและรัน

```bash
git clone https://github.com/CutieCat8/CCTV-Monitoring-Dashboard.git
cd CCTV-Monitoring-Dashboard
npm install
cp .env.local.example .env.local   # แล้วแก้ค่าตามหัวข้อด้านล่าง
npm run dev
```

เปิดเบราว์เซอร์ที่ <http://localhost:3000>

### สคริปต์

| คำสั่ง | หน้าที่ |
|---|---|
| `npm run dev` | รัน development server (พอร์ต 3000) |
| `npm run build` | build สำหรับ production ไปที่ `dist/` |

### ตัวแปรสภาพแวดล้อม

คัดลอก `.env.local.example` เป็น `.env.local` (ไฟล์นี้ถูก ignore โดย git ห้าม commit)

| ตัวแปร | จำเป็น | คำอธิบาย |
|---|---|---|
| `VITE_WAQI_TOKEN` | แนะนำ | โทเค็น AQICN/WAQI สำหรับข้อมูลคุณภาพอากาศ ถ้าไม่ตั้งค่า ระบบจะใช้แหล่งข้อมูลสำรอง |
| `POSTGRES_*` | ไม่ | ใช้เมื่อต่อ Vercel Postgres ปัจจุบัน API เก็บข้อมูลในหน่วยความจำ จึงยังไม่จำเป็น |

## เส้นทาง (Routes)

| เส้นทาง | หน้า |
|---|---|
| `/login` | เข้าสู่ระบบ |
| `/dashboard` | แดชบอร์ดหลัก |
| `/dashboard/live` | Live Monitoring |
| `/dashboard/events` | จัดการเหตุการณ์ |
| `/citizen` | หน้าหลักประชาชน |
| `/citizen/map` | แผนที่ |
| `/citizen/announcements` | ประกาศ |
| `/citizen/report` | แจ้งเหตุ |
| `/citizen/events` | กิจกรรม |

## โครงสร้างโปรเจกต์

```
├── api/                  # Vercel Serverless Functions (data, events, webhook)
├── src/
│   ├── components/       # คอมโพเนนต์ (LiveFeed, CameraList, FilterDropdown, ui/ ...)
│   ├── contexts/         # ThemeContext
│   ├── data/             # ข้อมูลกล้อง เหตุการณ์ และการจราจร
│   ├── pages/            # หน้าของ Dashboard และ Citizen Portal
│   ├── styles/           # globals.css
│   └── routes.tsx        # การกำหนดเส้นทาง
├── vercel.json           # คำสั่ง build, runtime ของ API และ SPA rewrite
└── vite.config.ts
```

## API

Serverless endpoints ใต้ `/api` (รายละเอียดและตัวอย่างอยู่ที่ [`api/README.md`](api/README.md))

| Endpoint | Method | หน้าที่ |
|---|---|---|
| `/api/events` | GET, POST | อ่าน/สร้างเหตุการณ์ CCTV |
| `/api/data` | GET, POST, DELETE | จัดการข้อมูลทั่วไป |
| `/api/webhook` | GET, POST | รับ webhook จากระบบภายนอก |

> ข้อมูลเก็บในหน่วยความจำของ function จึง **หายเมื่อ function รีสตาร์ท** ต้องเชื่อมฐานข้อมูลก่อนใช้งานจริง

## ข้อมูลกล้อง

กล้องที่สถานะ `live` ใช้สตรีม HLS สาธารณะของ Caltrans (แคลิฟอร์เนีย) ซึ่งไม่ต้องใช้ API key กำหนดใน `src/data/cameras.ts` ผ่านฟิลด์ `streamUrl` และ `streamSource` หากต้องการใช้กล้องจริง ให้แทนค่า `streamUrl` ด้วยลิงก์ `.m3u8` ของระบบของคุณ

## การดีพลอย

โปรเจกต์ตั้งค่าไว้สำหรับ [Vercel](https://vercel.com) อยู่แล้ว `vercel.json` กำหนดคำสั่ง build, โฟลเดอร์ผลลัพธ์ `dist`, runtime ของ API และ rewrite ให้ทุกเส้นทางที่ไม่ใช่ `/api` ชี้ไปที่ `index.html` เพื่อให้รีเฟรชหน้าย่อยได้โดยไม่เกิด 404 ตั้งค่าตัวแปรสภาพแวดล้อมผ่าน Vercel Dashboard

## แผนพัฒนา

- [ ] เชื่อมต่อ Backend API และฐานข้อมูลจริง แทนข้อมูลจำลอง
- [ ] ระบบยืนยันตัวตนและสิทธิ์ผู้ใช้
- [ ] แทนที่สตรีมสาธิตด้วยกล้อง CCTV จริง
- [ ] แบ่ง bundle (code-splitting) เพื่อลดขนาด JavaScript

## เอกสารเพิ่มเติม

- [`PRESENTATION.md`](PRESENTATION.md) – เอกสารนำเสนอโปรเจกต์
- [`api/README.md`](api/README.md) – เอกสาร API
- [`src/Attributions.md`](src/Attributions.md) – เครดิตแหล่งที่มา

## ลิขสิทธิ์

พัฒนาเพื่อการศึกษา ยังไม่ได้กำหนดสัญญาอนุญาต (License) สำหรับการนำไปใช้เชิงพาณิชย์
