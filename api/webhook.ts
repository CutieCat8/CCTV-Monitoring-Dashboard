import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for webhooks (resets on serverless function restart)
// For production, use a proper database like Neon, Supabase, or MongoDB Atlas
const webhookStore: Array<{
  id: number;
  headers: unknown;
  body: unknown;
  query: unknown;
  created_at: string;
}> = [];

let nextId = 1;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // อนุญาต CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // รับ webhook (POST)
    if (req.method === 'POST') {
      const headers = req.headers ?? {};
      const body = req.body ?? {};
      const query = req.query ?? {};

      const entry = {
        id: nextId++,
        headers,
        body,
        query,
        created_at: new Date().toISOString()
      };

      webhookStore.push(entry);

      return res.status(200).json({
        success: true,
        message: 'Webhook received',
        id: entry.id
      });
    }

    // ดู webhook ที่ได้รับ (GET)
    if (req.method === 'GET') {
      // Get limit from query parameter, default to 10, max 100
      const limit = Math.min(parseInt(String(req.query.limit || '10')), 100);
      
      const total = webhookStore.length;
      
      // Get latest webhooks (reverse order)
      const webhooks = webhookStore
        .slice(-limit)
        .reverse()
        .map((entry) => ({
          id: entry.id,
          body: entry.body,
          timestamp: entry.created_at
        }));

      return res.status(200).json({
        success: true,
        total: total,
        showing: webhooks.length,
        limit: limit,
        message: `Showing ${webhooks.length} of ${total} total webhooks`,
        webhooks
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
