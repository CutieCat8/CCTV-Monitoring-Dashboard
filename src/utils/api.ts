// Utility functions สำหรับเรียกใช้ API Endpoints

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-domain.vercel.app' 
  : 'http://localhost:3000';

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

export async function getWebhooks() {
  const response = await fetch(`${API_BASE_URL}/api/webhook`);
  
  if (!response.ok) throw new Error('Failed to fetch webhooks');
  return response.json();
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
