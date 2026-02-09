import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { sendData, getAllData, createEvent, getEvents } from '@/utils/api';

export default function APITestPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSendData = async () => {
    setLoading(true);
    try {
      const result = await sendData({ message });
      setResponse(result);
    } catch (error: any) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetData = async () => {
    setLoading(true);
    try {
      const result = await getAllData();
      setResponse(result);
    } catch (error: any) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    setLoading(true);
    try {
      const result = await createEvent({
        type: 'test_event',
        camera: 'CAM-001',
        description: message || 'ทดสอบระบบ',
        severity: 'low'
      });
      setResponse(result);
    } catch (error: any) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetEvents = async () => {
    setLoading(true);
    try {
      const result = await getEvents();
      setResponse(result);
    } catch (error: any) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">API Testing Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ส่งข้อมูล */}
        <Card>
          <CardHeader>
            <CardTitle>ส่งข้อมูล</CardTitle>
            <CardDescription>ทดสอบ POST ไปยัง API endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="พิมพ์ข้อความที่ต้องการส่ง..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button onClick={handleSendData} disabled={loading}>
                ส่งไป /api/data
              </Button>
              <Button onClick={handleCreateEvent} disabled={loading} variant="outline">
                ส่งไป /api/events
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* รับข้อมูล */}
        <Card>
          <CardHeader>
            <CardTitle>รับข้อมูล</CardTitle>
            <CardDescription>ทดสอบ GET จาก API endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleGetData} disabled={loading} variant="secondary">
                ดึงจาก /api/data
              </Button>
              <Button onClick={handleGetEvents} disabled={loading} variant="secondary">
                ดึงจาก /api/events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* แสดงผลลัพธ์ */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
