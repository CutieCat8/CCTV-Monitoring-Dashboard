import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for events (resets on serverless function restart)
const eventsStore: Array<{
  id: number;
  type: string | null;
  camera: string | null;
  description: string | null;
  severity: string | null;
  location: string | null;
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
    // สร้าง event ใหม่ (POST)
    if (req.method === 'POST') {
      const payload = req.body ?? {};
      const type = payload.type ?? null;
      const camera = payload.camera ?? null;
      const description = payload.description ?? null;
      const severity = payload.severity ?? null;
      const location = payload.location ?? null;

      const entry = {
        id: nextId++,
        type,
        camera,
        description,
        severity,
        location,
        payload,
        created_at: new Date().toISOString()
      };

      eventsStore.push(entry);

      return res.status(201).json({
        success: true,
        event: {
          id: entry.id,
          type: entry.type,
          camera: entry.camera,
          description: entry.description,
          severity: entry.severity,
          location: entry.location,
          payload: entry.payload,
          createdAt: entry.created_at
        }
      });
    }

    // ดึง events ทั้งหมด (GET)
    if (req.method === 'GET') {
      // Get limit from query parameter, default to 100, max 1000
      const limit = Math.min(parseInt(String(req.query.limit || '100')), 1000);
      
      const events = eventsStore
        .slice(-limit)
        .reverse()
        .map((row) => ({
          id: row.id,
          type: row.type,
          camera: row.camera,
          description: row.description,
          severity: row.severity,
          location: row.location,
          payload: row.payload,
          createdAt: row.created_at
        }));

      return res.status(200).json({
        success: true,
        events
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
