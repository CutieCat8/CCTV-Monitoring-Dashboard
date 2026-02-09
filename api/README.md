# API Endpoints

API endpoints สำหรับรับและเก็บข้อมูล (Vercel Serverless Functions)

## 📌 Endpoints ที่มี

### 1. `/api/data` - จัดการข้อมูลทั่วไป

#### POST - เพิ่มข้อมูล
```bash
curl -X POST https://your-domain.vercel.app/api/data \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

#### GET - ดูข้อมูลทั้งหมด
```bash
curl https://your-domain.vercel.app/api/data
```

#### DELETE - ลบข้อมูลทั้งหมด
```bash
curl -X DELETE https://your-domain.vercel.app/api/data
```

---

### 2. `/api/webhook` - รับ Webhooks

#### POST - รับ webhook จากระบบอื่น
```bash
curl -X POST https://your-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": {}}'
```

#### GET - ดู webhooks ที่ได้รับ
```bash
curl https://your-domain.vercel.app/api/webhook
```

---

### 3. `/api/events` - จัดการ CCTV Events

#### POST - สร้าง event ใหม่
```bash
curl -X POST https://your-domain.vercel.app/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "alert",
    "camera": "CAM-001",
    "description": "Motion detected"
  }'
```

#### GET - ดู events ทั้งหมด
```bash
curl https://your-domain.vercel.app/api/events
```

---

## ⚠️ หมายเหตุสำคัญ

**ข้อมูลเก็บใน Memory เท่านั้น** - ข้อมูลจะหายเมื่อ:
- Function restart
- Deploy ใหม่
- ไม่มี request ในระยะเวลาหนึ่ง

### 💾 แนะนำสำหรับ Production:

เชื่อมต่อกับ Database จริง เช่น:
- **Vercel Postgres** (แนะนำ)
- **MongoDB Atlas**
- **Supabase**
- **PlanetScale**

---

## 🔧 การใช้งานใน Frontend

```typescript
// ส่งข้อมูลไป API
async function sendData(data: any) {
  const response = await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// ดึงข้อมูลจาก API
async function getData() {
  const response = await fetch('/api/data');
  return response.json();
}
```
