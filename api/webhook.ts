import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

async function ensureWebhookTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS webhook_entries (
      id BIGSERIAL PRIMARY KEY,
      headers JSONB NOT NULL,
      body JSONB NOT NULL,
      query JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

type WebhookRow = {
  id: number;
  headers: unknown;
  body: unknown;
  query: unknown;
  created_at: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // อนุญาต CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await ensureWebhookTable();

    // รับ webhook (POST)
    if (req.method === 'POST') {
      const headers = req.headers ?? {};
      const body = req.body ?? {};
      const query = req.query ?? {};
      const headersJson = JSON.stringify(headers);
      const bodyJson = JSON.stringify(body);
      const queryJson = JSON.stringify(query);

      const result = await sql<{ id: number }>`
        INSERT INTO webhook_entries (headers, body, query)
        VALUES (${headersJson}::jsonb, ${bodyJson}::jsonb, ${queryJson}::jsonb)
        RETURNING id
      `;

      return res.status(200).json({
        success: true,
        message: 'Webhook received',
        id: result.rows[0].id
      });
    }

    // ดู webhook ที่ได้รับ (GET)
    if (req.method === 'GET') {
      const result = await sql<WebhookRow>`
        SELECT id, headers, body, query, created_at
        FROM webhook_entries
        ORDER BY id DESC
      `;

      const webhooks = result.rows.map((row) => ({
        id: row.id,
        headers: row.headers,
        body: row.body,
        query: row.query,
        timestamp: row.created_at
      }));

      return res.status(200).json({
        success: true,
        count: webhooks.length,
        webhooks
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
