import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ตรวจสอบว่ามี Environment Variables อะไรบ้าง (ไม่แสดงค่าจริง)
  const envCheck = {
    POSTGRES_URL: process.env.POSTGRES_URL ? '✅ มี' : '❌ ไม่มี',
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? '✅ มี' : '❌ ไม่มี',
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? '✅ มี' : '❌ ไม่มี',
    POSTGRES_USER: process.env.POSTGRES_USER ? '✅ มี' : '❌ ไม่มี',
    POSTGRES_HOST: process.env.POSTGRES_HOST ? '✅ มี' : '❌ ไม่มี',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? '✅ มี' : '❌ ไม่มี',
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? '✅ มี' : '❌ ไม่มี',
    
    // เช็คชื่ออื่นที่อาจผิด
    STORAGE_URL: process.env.STORAGE_URL ? '⚠️ มี (แต่ชื่อผิด!)' : '✅ ไม่มี',
    NEON_URL: process.env.NEON_URL ? '⚠️ มี (แต่ชื่อผิด!)' : '✅ ไม่มี',
    DATABASE_URL: process.env.DATABASE_URL ? '⚠️ มี (แต่ @vercel/postgres ไม่ใช้)' : '✅ ไม่มี',
    
    // แสดง prefix ของ POSTGRES_URL 4 ตัวแรกและ 4 ตัวท้าย (เพื่อไม่เปิดเผย credential)
    POSTGRES_URL_preview: process.env.POSTGRES_URL 
      ? `${process.env.POSTGRES_URL.substring(0, 15)}...${process.env.POSTGRES_URL.slice(-20)}`
      : 'ไม่มี'
  };

  return res.status(200).json({
    message: 'Environment Variables Check',
    timestamp: new Date().toISOString(),
    variables: envCheck
  });
}
