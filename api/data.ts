import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for data (resets on serverless function restart)
const dataStore: Array<{
  id: number;
  payload: unknown;
  created_at: string;
}> = [];

let nextId = 1;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // อนุญาต CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // รับข้อมูล (POST)
    if (req.method === 'POST') {
      const data = req.body ?? {};
      
      const entry = {
        id: nextId++,
        payload: data,
        created_at: new Date().toISOString()
      };

      dataStore.push(entry);

      return res.status(200).json({
        success: true,
        message: 'ได้รับข้อมูลแล้ว',
        saved: {
          id: entry.id,
          data: entry.payload,
          timestamp: entry.created_at
        }
      });
    }

    // ส่งข้อมูลกลับ (GET)
    if (req.method === 'GET') {
      // Get limit from query parameter, default to 100, max 1000
      const limit = Math.min(parseInt(String(req.query.limit || '100')), 1000);
      
      const data = dataStore
        .slice(-limit)
        .reverse()
        .map((row) => ({
          id: row.id,
          data: row.payload,
          timestamp: row.created_at
        }));

      return res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    }

    // ลบข้อมูลทั้งหมด (DELETE)
    if (req.method === 'DELETE') {
      dataStore.length = 0;
      nextId = 1;
      return res.status(200).json({
        success: true,
        message: 'ลบข้อมูลทั้งหมดแล้ว'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
