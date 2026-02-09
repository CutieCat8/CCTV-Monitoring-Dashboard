# CCTV Monitoring Dashboard

ระบบจัดการและติดตามกล้องวงจรปิด (CCTV) แบบเรียลไทม์ พร้อมระบบวิเคราะห์เหตุการณ์และการจราจร

##  รายละเอียดโปรเจค

โปรเจคนี้เป็นระบบ Dashboard สำหรับติดตามและจัดการกล้อง CCTV แบบ Real-time ที่พัฒนาด้วย React และ TypeScript มีระบบแยกการใช้งานสำหรับเจ้าหน้าที่ (Dashboard) และประชาชนทั่วไป (Citizen Portal)

##  คุณสมบัติหลัก

### สำหรับเจ้าหน้าที่ (Dashboard)
-  **Live Monitoring** - ติดตามกล้องวงจรปิดแบบเรียลไทม์
-  **Dashboard** - แสดงภาพรวมสถิติและข้อมูลสำคัญ
-  **Events Management** - จัดการและติดตามเหตุการณ์ต่างๆ
-  **Traffic Analytics** - วิเคราะห์ข้อมูลการจราจร

### สำหรับประชาชน (Citizen Portal)
-  **Citizen Dashboard** - แดชบอร์ดสำหรับประชาชน
-  **Interactive Map** - แผนที่แสดงตำแหน่งกล้อง CCTV
-  **Announcements** - ประกาศและข่าวสาร
-  **Report System** - ระบบแจ้งเหตุและรายงานปัญหา
-  **Events** - ติดตามเหตุการณ์สำคัญ

##  เทคโนโลยีที่ใช้

- **React 18** - JavaScript Library สำหรับสร้าง UI
- **TypeScript** - เพิ่ม Type Safety ให้กับ JavaScript
- **Vite** - Build Tool ที่รวดเร็ว
- **React Router** - จัดการ Routing
- **Radix UI** - Component Library
- **Tailwind CSS** - Utility-first CSS Framework
- **Recharts** - Library สำหรับสร้างกราฟ
- **Lucide React** - Icon Library

##  การติดตั้ง

### ความต้องการของระบบ
- Node.js (เวอร์ชัน 16 ขึ้นไป)
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. Clone หรือ Download โปรเจค

2. ติดตั้ง Dependencies
```bash
npm install
```

3. รันโปรเจคในโหมด Development
```bash
npm run dev
```

4. เปิดเบราว์เซอร์ที่ `http://localhost:3000`

##  การใช้งาน

### การเข้าสู่ระบบ
- เริ่มต้นที่หน้า Login (`/login`)
- ระบบจะ redirect ไปยังหน้า Dashboard หรือ Citizen Portal

### เส้นทางหลัก (Routes)

#### Dashboard (สำหรับเจ้าหน้าที่)
- `/dashboard` - หน้าแดชบอร์ดหลัก
- `/dashboard/live` - ติดตามกล้องแบบ Real-time
- `/dashboard/events` - จัดการเหตุการณ์

#### Citizen Portal (สำหรับประชาชน)
- `/citizen` - หน้าหลักสำหรับประชาชน
- `/citizen/map` - แผนที่กล้อง CCTV
- `/citizen/announcements` - ประกาศและข่าวสาร
- `/citizen/report` - แจ้งเหตุและรายงานปัญหา
- `/citizen/events` - เหตุการณ์สำคัญ

##  โครงสร้างโปรเจค

```
├── src/
│   ├── components/      # React Components
│   │   ├── ui/         # UI Components (Radix UI)
│   │   └── figma/      # Custom Components
│   ├── pages/          # หน้าต่างๆ ของแอพ
│   ├── data/           # ข้อมูล Mock (cameras, events, traffic)
│   ├── styles/         # Global Styles
│   └── routes.tsx      # การกำหนดเส้นทาง
├── package.json
├── vite.config.ts
└── README.md
```

##  UI Components

โปรเจคใช้ UI Components จาก Radix UI ประกอบด้วย:
- Accordion, Alert Dialog, Avatar
- Button, Card, Dialog
- Dropdown Menu, Navigation Menu
- Table, Tabs, Tooltip
- และอื่นๆ อีกมากมาย

##  สคริปต์ที่มีให้ใช้งาน

```bash
# รัน Development Server
npm run dev

# Build สำหรับ Production
npm run build

# Preview Production Build
npm run preview
```

## 🔧 การปรับแต่ง

### ข้อมูล Mock Data
สามารถแก้ไขข้อมูลทดสอบได้ที่:
- `src/data/cameras.ts` - ข้อมูลกล้อง
- `src/data/events.ts` - ข้อมูลเหตุการณ์
- `src/data/trafficData.ts` - ข้อมูลการจราจร

### สไตล์และธีม
- แก้ไข Global Styles ที่ `src/styles/globals.css`
- ปรับแต่ง Tailwind Config ที่ `vite.config.ts`

##  เอกสารเพิ่มเติม

- [Guidelines](src/guidelines/Guidelines.md) - แนวทางการพัฒนา
- [Attributions](src/Attributions.md) - เครดิตและแหล่งที่มา


##  ทีมพัฒนา

โปรเจคนี้พัฒนาขึ้นเพื่อใช้ในการเรียนการสอน

##  License

This project is for educational purposes.

---

**หมายเหตุ:** โปรเจคนี้ใช้ข้อมูล Mock Data สำหรับการทดสอบและพัฒนา ในส่วนของการใช้งานจริง ผมได้ทำการขอ API ไปเรียบร้อยแล้วครับ ตอนนี้รอทางบริษัทให้ API มาเชื่อมต่อกับ Backend API และฐานข้อมูลจริง
  
