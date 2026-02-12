// Utility functions สำหรับเรียกใช้ API Endpoints

// ใช้ Production API เสมอ เพราะ local ไม่มี API endpoints
const API_BASE_URL = 'https://cctv-monitoring-dashboard.vercel.app';

// ============================================
// Webhook Response Types
// ============================================

export interface WebhookData {
  id: string;
  strRes?: string;
  taskId?: string;
  boxCode?: string;
  imageUrl?: string; // Base64 encoded image
  taskName?: string;
  coordinate?: string;
  equipmentId?: string;
  equipmentName?: string;
  installationArea?: string;
  installationLocation?: string;
  sendTime?: number;
  eventTypeId?: string;
  [key: string]: any;
}

export interface WebhookEntry {
  id: string;
  body: WebhookData;
  timestamp: string;
}

export interface WebhooksResponse {
  success: boolean;
  total: number;
  showing: number;
  limit: number;
  message: string;
  webhooks: WebhookEntry[];
}

// ============================================
// Data API
// ============================================

export async function sendData(data: any) {
  const response = await fetch(`${API_BASE_URL}/api/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('Failed to send data');
  return response.json();
}

export async function getAllData() {
  const response = await fetch(`${API_BASE_URL}/api/data`);
  
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
}

export async function clearAllData() {
  const response = await fetch(`${API_BASE_URL}/api/data`, {
    method: 'DELETE'
  });
  
  if (!response.ok) throw new Error('Failed to clear data');
  return response.json();
}

// ============================================
// Webhook API
// ============================================

export async function sendWebhook(payload: any) {
  const response = await fetch(`${API_BASE_URL}/api/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) throw new Error('Failed to send webhook');
  return response.json();
}

export async function getWebhooks(limit: number = 100): Promise<WebhooksResponse> {
  const response = await fetch(`${API_BASE_URL}/api/webhook?limit=${limit}`);
  
  if (!response.ok) throw new Error('Failed to fetch webhooks');
  return response.json();
}

// แปลง Base64 image เป็น data URL
export function base64ToDataUrl(base64: string): string {
  // ถ้าขึ้นต้นด้วย /9j/ แสดงว่าเป็น JPEG
  if (base64.startsWith('/9j/')) {
    return `data:image/jpeg;base64,${base64}`;
  }
  // ถ้าขึ้นต้นด้วย iVBOR แสดงว่าเป็น PNG
  if (base64.startsWith('iVBOR')) {
    return `data:image/png;base64,${base64}`;
  }
  // default เป็น JPEG
  return `data:image/jpeg;base64,${base64}`;
}

// ============================================
// Events API
// ============================================

export interface CCTVEvent {
  type?: string;
  camera?: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  [key: string]: any;
}

export async function createEvent(event: CCTVEvent) {
  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
  
  if (!response.ok) throw new Error('Failed to create event');
  return response.json();
}

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/api/events`);
  
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}

// ============================================
// ตัวอย่างการใช้งาน
// ============================================

/*
// ส่งข้อมูลทั่วไป
await sendData({ message: 'Hello from frontend' });

// รับ webhook
await sendWebhook({ event: 'test', data: { foo: 'bar' } });

// สร้าง CCTV event
await createEvent({
  type: 'motion_detected',
  camera: 'CAM-001',
  description: 'Motion detected in Zone A',
  severity: 'medium'
});

// ดึงข้อมูล
const data = await getAllData();
const webhooks = await getWebhooks();
const events = await getEvents();
*/
