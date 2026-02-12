import { 
  Wind, 
  CloudSun, 
  Droplets, 
  Navigation, 
  Car, 
  AlertTriangle, 
  Lightbulb,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  X,
  Megaphone,
  ChevronRight,
  Construction,
  CircleDot
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';

type ReportStatus = 'submitted' | 'in-progress' | 'resolved';

interface RecentReport {
  id: string;
  type: 'streetlight' | 'road' | 'traffic-light';
  title: string;
  location: string;
  time: string;
  status: ReportStatus;
}

export function CitizenDashboard() {
  const [showAlert, setShowAlert] = useState(true);
  const { isDarkMode } = useTheme();

  const recentReports: RecentReport[] = [
    {
      id: '1',
      type: 'streetlight',
      title: 'ไฟถนนชำรุด ซ.ท่าเฉลิม ซอย 5',
      location: 'กำลังดำเนินการ',
      time: '1 ชั่วโมงที่แล้ว',
      status: 'in-progress',
    },
    {
      id: '2',
      type: 'road',
      title: 'ถนนเสีย มีหลุมอุปสรรค ถ.ช้างคลาน',
      location: 'รับเรื่องแล้ว',
      time: '3 ชั่วโมงที่แล้ว',
      status: 'submitted',
    },
    {
      id: '3',
      type: 'traffic-light',
      title: 'ไฟจราจรเสีย สัมพันธมิตร',
      location: 'เสร็จสิ้น',
      time: '5 ชั่วโมงที่แล้ว',
      status: 'resolved',
    },
  ];

  const getReportIcon = (type: 'streetlight' | 'road' | 'traffic-light') => {
    switch (type) {
      case 'streetlight':
        return Lightbulb;
      case 'road':
        return Construction;
      case 'traffic-light':
        return CircleDot;
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
        return 'text-blue-400';
      case 'in-progress':
        return 'text-orange-400';
      case 'resolved':
        return 'text-green-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ภาพรวมเมือง</h1>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ข้อมูล ณ วันที่ 25 มกราคม 2026</p>
      </div>

      {/* Alert Banner */}
      {showAlert && (
        <div className={`rounded-2xl p-5 relative border ${
          isDarkMode 
            ? 'bg-gradient-to-r from-orange-900/50 to-red-950/30 border-orange-800/50' 
            : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
        }`}>
          <button
            onClick={() => setShowAlert(false)}
            className={`absolute top-4 right-4 transition-colors ${
              isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label="ปิดประกาศ"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ประกาศจราจรชั่วคราว</h3>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                ปิดถนนชั่วคราววันที่ 26-28 มกราคม เนื่องจากงานเทศกาลฤดูหนาว หลีกเลี่ยงเส้นทางหลักในเขตเมืองเก่า ขอความร่วมมือหลีกเลี่ยงเส้นทาง 2 ช่วงเวลาเร่งด่วน - ช่วงเช้า 7-9 น. ช่วงเย็น 16-19 น.
              </p>
              <button className="text-orange-400 text-sm mt-2 hover:text-orange-300 transition-colors">
                อ่าน 2 ข้อความเพิ่ม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* PM2.5 Card */}
        <div className={`rounded-2xl p-6 border ${
          isDarkMode 
            ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wind className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>คุณภาพอากาศ PM2.5</span>
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>-12%</span>
            </div>
          </div>

          <div className="mb-4">
            <div className={`text-5xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              45 <span className={`text-2xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>µg/m³</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-500 text-sm font-medium">ดี</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ค่าเฉลี่ยย่อยอำเภอ ช้างม่อย เมืองเชียงใหม่</div>
            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-200'}`}>
              <div className="h-full w-[30%] bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 rounded-full"></div>
            </div>
            <div className={`flex justify-between text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              <span>0-50</span>
              <span>51-100</span>
              <span>101-150</span>
              <span>151+</span>
            </div>
          </div>
        </div>

        {/* Weather Card */}
        <div className={`rounded-2xl p-6 border ${
          isDarkMode 
            ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <CloudSun className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>สภาพอากาศ</span>
          </div>

          <div className="flex items-start justify-between mb-6">
            <div>
              <div className={`text-5xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                24°
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>แดดจ้า</div>
            </div>
            <div className="w-16 h-16 text-yellow-500">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Droplets className="w-4 h-4 text-blue-400" />
              <div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>ความชื้น</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>65%</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="w-4 h-4 text-gray-400" />
              <div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>ลม</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>12 km/h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Status Card */}
        <div className={`rounded-2xl p-6 border ${
          isDarkMode 
            ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>สถานะความปลอดภัย</span>
          </div>

          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-500 mb-1">ปลอดภัย</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ไม่มีเหตุฉุกเฉิน</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>กล้อง CCTV ทำงาน</span>
              <span className="text-green-500">324/320</span>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>ไฟถนนทำงาน</span>
              <span className="text-green-500">1,243/1,250</span>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic and Incident Stats */}
      <div className="grid grid-cols-4 gap-4">
        {/* Traffic Congestion */}
        <div className={`rounded-2xl p-5 border ${
          isDarkMode 
            ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>รถติดในเมือง</div>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>12</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-500 text-sm">
            <TrendingDown className="w-4 h-4" />
            <span>-6%</span>
          </div>
        </div>

        {/* Accidents */}
        <div className={`rounded-2xl p-5 border ${
          isDarkMode 
            ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>อุบัติเหตุ</div>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>3</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-red-500 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+2</span>
          </div>
        </div>

        {/* Violations */}
        <div className={`rounded-2xl p-5 border ${
          isDarkMode 
            ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>การฝ่าฝืน</div>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>28</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-500 text-sm">
            <TrendingDown className="w-4 h-4" />
            <span>-15%</span>
          </div>
        </div>

        {/* Citizen Reports */}
        <div className={`rounded-2xl p-5 border ${
          isDarkMode 
            ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>สิ่งเตือนใหม่</div>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>8</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-blue-500 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+3</span>
          </div>
        </div>
      </div>

      {/* Bottom Section - Map and Recent Reports */}
      <div className="grid grid-cols-2 gap-4">
        {/* Map Preview */}
        <div className={`rounded-2xl border overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className={`p-5 border-b flex items-center justify-between ${
            isDarkMode ? 'border-neutral-800' : 'border-gray-200'
          }`}>
            <h3 className={`font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              แผนที่เมือง
            </h3>
            <Link to="/citizen/map" className="text-orange-400 text-sm hover:text-orange-300 flex items-center gap-1">
              ดูทั้งหมด
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mini Map */}
          <div className={`h-64 relative p-4 ${
            isDarkMode ? 'bg-gradient-to-br from-neutral-950 to-black' : 'bg-gradient-to-br from-gray-100 to-gray-200'
          }`}>
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="mini-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path
                      d="M 30 0 L 0 0 0 30"
                      fill="none"
                      stroke="rgb(100, 100, 100)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mini-grid)" />
              </svg>
            </div>

            {/* Incident Markers */}
            <div className="absolute top-12 left-16">
              <div className="relative">
                <div className="absolute -inset-1.5 w-12 h-12 bg-red-500 rounded-full opacity-30 animate-pulse blur-xl"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full relative z-10"></div>
              </div>
            </div>

            <div className="absolute top-32 left-32">
              <div className="relative">
                <div className="absolute -inset-2 w-16 h-16 bg-orange-500 rounded-full opacity-30 animate-pulse blur-xl"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full relative z-10"></div>
              </div>
            </div>

            <div className="absolute bottom-20 right-24">
              <div className="relative">
                <div className="absolute -inset-2 w-16 h-16 bg-orange-500 rounded-full opacity-30 animate-pulse blur-xl"></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full relative z-10"></div>
              </div>
            </div>

            <div className="absolute top-20 right-20">
              <div className="relative">
                <div className="absolute -inset-1.5 w-12 h-12 bg-yellow-500 rounded-full opacity-30 animate-pulse blur-xl"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full relative z-10"></div>
              </div>
            </div>

            {/* Legend */}
            <div className={`absolute bottom-4 left-4 backdrop-blur-sm rounded-lg p-3 border ${
              isDarkMode 
                ? 'bg-neutral-950/80 border-neutral-800' 
                : 'bg-white/80 border-gray-300'
            }`}>
              <div className="space-y-1 text-xs">
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>อุบัติเหตุ</span>
                </div>
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>รถติด</span>
                </div>
                <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>การฝ่าฝืน</span>
                </div>
              </div>
            </div>

            {/* Location Indicator */}
            <div className="absolute bottom-4 right-4 bg-orange-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" fill="white" />
              </svg>
              ช้างม่อย
            </div>

            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>
              อัพเดท 15 วิที่ผ่านมา
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className={`rounded-2xl border overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <div className={`p-5 border-b flex items-center justify-between ${
            isDarkMode ? 'border-neutral-800' : 'border-gray-200'
          }`}>
            <h3 className={`font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              การร้องเรียนล่าสุด
            </h3>
            <Link to="/citizen/report" className="text-orange-400 text-sm hover:text-orange-300 flex items-center gap-1">
              ดูทั้งหมด
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-5 space-y-3">
            {recentReports.map((report) => {
              const Icon = getReportIcon(report.type);
              return (
                <div
                  key={report.id}
                  className={`border rounded-xl p-4 transition-colors ${
                    isDarkMode 
                      ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-neutral-900' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{report.title}</h4>
                      <div className={`text-xs ${getStatusColor(report.status)} mb-1`}>
                        {report.location}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{report.time}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* View All Button */}
            <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-3 rounded-xl transition-all font-medium text-sm shadow-lg shadow-orange-600/20">
              ดูทั้งหมดปัญหา
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
