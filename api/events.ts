import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

async function ensureEventsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id BIGSERIAL PRIMARY KEY,
      type TEXT,
      camera TEXT,
      description TEXT,
      severity TEXT,
      location TEXT,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

type EventRow = {
  id: number;
  type: string | null;
  camera: string | null;
  description: string | null;
  severity: string | null;
  location: string | null;
  payload: unknown;
  created_at: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // อนุญาต CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await ensureEventsTable();

    // สร้าง event ใหม่ (POST)
    if (req.method === 'POST') {
      const payload = req.body ?? {};
      const payloadJson = JSON.stringify(payload);
      const type = payload.type ?? null;
      const camera = payload.camera ?? null;
      const description = payload.description ?? null;
      const severity = payload.severity ?? null;
      const location = payload.location ?? null;

      const result = await sql<EventRow>`
        INSERT INTO events (type, camera, description, severity, location, payload)
        VALUES (${type}, ${camera}, ${description}, ${severity}, ${location}, ${payloadJson}::jsonb)
        RETURNING id, type, camera, description, severity, location, payload, created_at
      `;

      const saved = result.rows[0];

      return res.status(201).json({
        success: true,
        event: {
          id: saved.id,
          type: saved.type,
          camera: saved.camera,
          description: saved.description,
          severity: saved.severity,
          location: saved.location,
          payload: saved.payload,
          createdAt: saved.created_at
        }
      });
    }

    // ดึง events ทั้งหมด (GET)
    if (req.method === 'GET') {
      const result = await sql<EventRow>`
        SELECT id, type, camera, description, severity, location, payload, created_at
        FROM events
        ORDER BY id DESC
      `;

      const events = result.rows.map((row) => ({
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
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      error: 'Database error',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
