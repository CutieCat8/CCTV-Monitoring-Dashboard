import { useState } from 'react';
import { Lightbulb, Construction, CircleDot, Upload, MapPin } from 'lucide-react';

type ReportType = 'streetlight' | 'road' | 'traffic-light';
type ReportStatus = 'submitted' | 'in-progress' | 'resolved';

interface Report {
  id: string;
  type: ReportType;
  title: string;
  location: string;
  date: string;
  status: ReportStatus;
}

export function CitizenReport() {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const myReports: Report[] = [
    {
      id: '1',
      type: 'streetlight',
      title: 'ไฟถนนชำรุด ถ. ห้วยแก้ว ซอย 5',
      location: 'ถ. ห้วยแก้ว ซอย 5',
      date: '24 ม.ค. 2026',
      status: 'in-progress',
    },
    {
      id: '2',
      type: 'road',
      title: 'มีหลุมบนถนนใหญ่ อันตราย',
      location: 'ถ. ช้างคลาน',
      date: '23 ม.ค. 2026',
      status: 'submitted',
    },
    {
      id: '3',
      type: 'traffic-light',
      title: 'ไฟจราจรไม่ทำงาน',
      location: 'สี่แยกนิมมาน',
      date: '22 ม.ค. 2026',
      status: 'resolved',
    },
  ];

  const reportTypes = [
    {
      type: 'streetlight' as ReportType,
      icon: Lightbulb,
      label: 'ไฟถนนเสีย',
    },
    {
      type: 'road' as ReportType,
      icon: Construction,
      label: 'ถนนชำรุด',
    },
    {
      type: 'traffic-light' as ReportType,
      icon: CircleDot,
      label: 'ไฟจราจรเสีย',
    },
  ];

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
        return { label: 'รับเรื่องแล้ว', color: 'text-blue-400' };
      case 'in-progress':
        return { label: 'กำลังดำเนินการ', color: 'text-orange-400' };
      case 'resolved':
        return { label: 'เสร็จสิ้น', color: 'text-green-400' };
    }
  };

  const getStatusDotColor = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-400';
      case 'in-progress':
        return 'bg-orange-400';
      case 'resolved':
        return 'bg-green-400';
    }
  };

  const handleSubmit = () => {
    if (!selectedType || !location || !description) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    alert('ส่งรายการร้องเรียนเรียบร้อยแล้ว');
    setSelectedType(null);
    setLocation('');
    setDescription('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800">
        <h1 className="text-3xl font-bold text-white mb-1">ระบบร้องเรียนปัญหา</h1>
        <p className="text-gray-400 text-sm">แจ้งปัญหาสาธารณูปโภคและติดตามสถานะ</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Left Panel - Report Form */}
        <div className="w-[45%] bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-6 overflow-auto">
          <h2 className="text-xl font-bold text-white mb-6">แจ้งปัญหาใหม่</h2>

          {/* Report Type Selector */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-3 block">ประเภทปัญหา</label>
            <div className="grid grid-cols-3 gap-3">
              {reportTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedType === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => setSelectedType(item.type)}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-neutral-800 border-neutral-700'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                        isSelected ? 'bg-neutral-700' : 'bg-neutral-900'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white text-xs font-medium">{item.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Input */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">สถานที่</label>
            <div className="relative">
              <input
                type="text"
                placeholder="ระบุที่อยู่หรือชื่อสถานที่"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-600 focus:outline-none focus:border-neutral-700 transition-all"
              />
              <MapPin className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">รายละเอียด</label>
            <textarea
              placeholder="อธิบายปัญหาที่พบ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neutral-700 transition-all resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">แนบรูปภาพ (ไม่บังคับ)</label>
            <div className="border-2 border-dashed border-neutral-800 rounded-xl p-8 text-center hover:border-neutral-700 transition-colors cursor-pointer bg-neutral-950">
              <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-8 h-8 text-gray-500" />
              </div>
              <div className="text-white text-sm font-medium mb-1">
                คลิกที่นี่เพื่ออัพโหลดรูปภาพ
              </div>
              <div className="text-gray-500 text-xs">PNG, JPG ขนาดไม่เกิน 5MB</div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            ส่งรายการร้องเรียน
          </button>
        </div>

        {/* Right Panel - My Reports */}
        <div className="flex-1 bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-800 p-6 overflow-auto">
          <h2 className="text-xl font-bold text-white mb-6">เรื่องร้องเรียนของฉัน</h2>

          <div className="space-y-3 mb-8">
            {myReports.map((report) => {
              const status = getStatusBadge(report.status);
              const Icon =
                report.type === 'streetlight'
                  ? Lightbulb
                  : report.type === 'road'
                  ? Construction
                  : CircleDot;

              return (
                <div
                  key={report.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Icon className="w-4 h-4" />
                      <span>
                        {report.type === 'streetlight'
                          ? 'ไฟถนน'
                          : report.type === 'road'
                          ? 'ถนนชำรุด'
                          : 'ไฟจราจร'}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-medium mb-3">{report.title}</h3>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{report.location}</span>
                    </div>
                    <span>{report.date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-3 text-sm">สถานะ</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-400">รับเรื่องแล้ว</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-gray-400">กำลังดำเนินการ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-400">เสร็จสิ้น</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}