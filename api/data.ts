import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

async function ensureDataTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS data_entries (
      id BIGSERIAL PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

type DataRow = {
  id: number;
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
    await ensureDataTable();

    // รับข้อมูล (POST)
    if (req.method === 'POST') {
      const data = req.body ?? {};
      const payloadJson = JSON.stringify(data);
      const result = await sql<DataRow>`
        INSERT INTO data_entries (payload)
        VALUES (${payloadJson}::jsonb)
        RETURNING id, payload, created_at
      `;

      const saved = result.rows[0];

      return res.status(200).json({
        success: true,
        message: 'ได้รับข้อมูลแล้ว',
        saved: {
          id: saved.id,
          data: saved.payload,
          timestamp: saved.created_at
        }
      });
    }

    // ส่งข้อมูลกลับ (GET)
    if (req.method === 'GET') {
      const result = await sql<DataRow>`
        SELECT id, payload, created_at
        FROM data_entries
        ORDER BY id DESC
      `;

      const data = result.rows.map((row) => ({
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
      await sql`DELETE FROM data_entries`;
      return res.status(200).json({
        success: true,
        message: 'ลบข้อมูลทั้งหมดแล้ว'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Database error'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
