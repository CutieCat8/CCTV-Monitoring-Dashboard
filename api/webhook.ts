import type { VercelRequest, VercelResponse } from '@vercel/node';

// ที่เก็บ webhook ชั่วคราว (ใน production ควรใช้ database)
let webhookStore: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // อนุญาต CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // รับ webhook (POST)
  if (req.method === 'POST') {
    const payload = {
      id: webhookStore.length + 1,
      headers: req.headers,
      body: req.body,
      query: req.query,
      timestamp: new Date().toISOString()
    };

    webhookStore.push(payload);

    return res.status(200).json({
      success: true,
      message: 'Webhook received',
      id: payload.id
    });
  }

  // ดู webhook ที่ได้รับ (GET)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: webhookStore.length,
      webhooks: webhookStore
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
