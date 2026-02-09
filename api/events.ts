import type { VercelRequest, VercelResponse } from '@vercel/node';

// ที่เก็บ events ชั่วคราว (ใน production ควรใช้ database)
let events: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // อนุญาต CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // สร้าง event ใหม่ (POST)
  if (req.method === 'POST') {
    const event = {
      id: events.length + 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    events.push(event);

    return res.status(201).json({
      success: true,
      event
    });
  }

  // ดึง events ทั้งหมด (GET)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      events
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
