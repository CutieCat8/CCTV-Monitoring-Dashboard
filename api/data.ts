import type { VercelRequest, VercelResponse } from '@vercel/node';

// ที่เก็บข้อมูลชั่วคราว (ใน production ควรใช้ database)
let dataStore: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // อนุญาต CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // รับข้อมูล (POST)
  if (req.method === 'POST') {
    const data = req.body;
    
    // บันทึกข้อมูล
    dataStore.push({
      id: dataStore.length + 1,
      data: data,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'ได้รับข้อมูลแล้ว',
      saved: dataStore[dataStore.length - 1]
    });
  }

  // ส่งข้อมูลกลับ (GET)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: dataStore.length,
      data: dataStore
    });
  }

  // ลบข้อมูลทั้งหมด (DELETE)
  if (req.method === 'DELETE') {
    dataStore = [];
    return res.status(200).json({
      success: true,
      message: 'ลบข้อมูลทั้งหมดแล้ว'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
