import { MapPin, Clock, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type AnnouncementType = 'emergency' | 'warning' | 'info';

interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  description: string;
  location: string;
  time: string;
  urgent?: boolean;
}

export function CitizenAnnouncements() {
  const { isDarkMode } = useTheme();
  const announcements: Announcement[] = [
    {
      id: '1',
      type: 'emergency',
      title: 'เตือนอากาศหนาวจัดในช่วง 25-29 มกราคม',
      description:
        'กรมอุตุนิยมวิทยาพยากรณ์อากาศว่าระหว่างวันที่ 25-29 มกราคม จะมีมวลอากาศเย็นจากประเทศจีนลงมาครอบคลุมพื้นที่ภาคเหนือ ส่งผลให้อุณหภูมิในพื้นที่ลดลง 3-5 องศาเซลเซียส ขอให้ประชาชนดูแลสุขภาพและระวังอันตรายจากอากาศหนาว',
      location: 'ทั่วจังหวัดเชียงใหม่',
      time: '30 นาทีที่แล้ว',
      urgent: true,
    },
    {
      id: '2',
      type: 'emergency',
      title: 'เตือนพายุ "คงเหลย" พาดผ่านไทยช่วง 5-8 กุมภาพันธ์',
      description:
        'พายุโซนร้อน "คงเหลย" กำลังเคลื่อนตัวจากประเทศจีนลงสู่เวียดนาม และคาดว่าจะพาดผ่านประเทศไทยในช่วงวันที่ 5-8 กุมภาพันธ์ ส่งผลให้เกิดฝนตกหนัก ลมแรง และอุณหภูมิลดลง ขอให้ประชาชนเตรียมพร้อมรับมือ',
      location: 'ทั่วภาคเหนือและภาคตะวันออกเฉียงเหนือ',
      time: '1 ชั่วโมงที่แล้ว',
      urgent: true,
    },
    {
      id: '3',
      type: 'emergency',
      title: 'ปิดถนนชั่วคราว - งานเทศกาลดอกไม้เชียงใหม่',
      description:
        'ปิดการจราจรถนนช้างคลาน - ท่าแพ ตั้งแต่วันที่ 26-28 มกราคม 2026 เวลา 17:00-23:00 น. เนื่องจากจัดงานเทศกาลดอกไม้ ขอความร่วมมือประชาชนหลีกเลี่ยงเส้นทาง',
      location: 'ถ. ช้างคลาน - ถ. ท่าแพ',
      time: '2 ชั่วโมงที่แล้ว',
      urgent: true,
    },
    {
      id: '4',
      type: 'warning',
      title: 'ประกาศมาตรการลดฝุ่น PM2.5',
      description:
        'กรุณาลดการเผาในที่โล่ง และใช้รถใช้ถนนตามความจำเป็น ในช่วงสัปดาห์นี้เนื่องจากค่า PM2.5 มีแนวโน้มสูงขึ้น แนะนำสวมหน้ากากอนามัยเมื่อออกจากบ้าน',
      location: 'ทั่วเมืองเชียงใหม่',
      time: '5 ชั่วโมงที่แล้ว',
    },
    {
      id: '5',
      type: 'info',
      title: 'ซ่อมแซมไฟถนนเสร็จสิ้น',
      description:
        'การซ่อมแซมไฟถนนบริเวณถนนห้วยแก้ว ซอย 3-7 ได้ดำเนินการเสร็จสิ้นเรียบร้อยแล้ว ระบบไฟฟ้าทำงานปกติ ขอบคุณประชาชนที่แจ้งเบาะแส',
      location: 'ถ. ห้วยแก้ว',
      time: '8 ชั่วโมงที่แล้ว',
    },
    {
      id: '6',
      type: 'emergency',
      title: 'อุบัติเหตุรถชน สี่แยกริมปิง',
      description:
        'เกิดอุบัติเหตุรถชน 3 คัน บริเวณสี่แยกริมปิง ทำให้การจราจรคับคั่ง เจ้าหน้าที่กำลังดำเนินการ กรุณาหลีกเลี่ยงเส้นทาง หรือเพิ่มเวลาในการเดินทาง',
      location: 'สี่แยกริมปิง',
      time: '1 วันที่แล้ว',
      urgent: true,
    },
    {
      id: '7',
      type: 'info',
      title: 'เปิดจุดบริการน้ำดื่มฟรี',
      description:
        'เปิดจุดบริการน้ำดื่มฟรีสำหรับประชาชน ณ สวนสาธารณะ 5 แห่ง ทั่วเมืองเชียงใหม่ ตั้งแต่เดือนกุมภาพันธ์เป็นต้นไป เพื่อส่งเสริมการลดการใช้พลาสติก',
      location: 'สวนสาธารณะทั่วเมือง',
      time: '2 วันที่แล้ว',
    },
  ];

  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-6 h-6" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6" />;
      case 'info':
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: AnnouncementType) => {
    switch (type) {
      case 'emergency':
        return 'from-red-950/50 to-red-900/30 border-red-800/50';
      case 'warning':
        return 'from-yellow-950/50 to-yellow-900/30 border-yellow-800/50';
      case 'info':
        return 'from-neutral-900 to-neutral-950 border-neutral-800';
    }
  };

  const getLightTypeClass = (type: AnnouncementType) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 border-red-300';
      case 'warning':
        return 'bg-[#fff8e1] border-[#f0dba8]';
      case 'info':
        return 'bg-[#e0e0e0] border-[#c7c7c7]';
    }
  };

  const getIconColor = (type: AnnouncementType) => {
    switch (type) {
      case 'emergency':
        return isDarkMode ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700';
      case 'warning':
        return isDarkMode ? 'bg-yellow-600 text-white' : 'bg-amber-100 text-amber-700';
      case 'info':
        return isDarkMode ? 'bg-neutral-700 text-white' : 'bg-gray-200 text-gray-700';
    }
  };

  const getBadgeColor = (type: AnnouncementType) => {
    switch (type) {
      case 'emergency':
        return isDarkMode ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700';
      case 'warning':
        return isDarkMode ? 'bg-yellow-600 text-white' : 'bg-amber-100 text-amber-800';
      case 'info':
        return isDarkMode ? 'bg-neutral-600 text-white' : 'bg-gray-300 text-gray-700';
    }
  };

  const getBadgeLabel = (type: AnnouncementType) => {
    switch (type) {
      case 'emergency':
        return 'สำคัญ';
      case 'warning':
        return 'ปานกลาง';
      case 'info':
        return 'ทั่วไป';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ประกาศจากเจ้าหน้าที่</h1>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          ข่าวสารและประกาศอัพเดตจากระบบ Officer Dashboard
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`${isDarkMode ? 'bg-gradient-to-r' : ''} ${
              isDarkMode ? getTypeColor(announcement.type) : getLightTypeClass(announcement.type)
            } rounded-2xl p-6 border relative transition-all ${
              isDarkMode ? 'hover:border-opacity-80' : 'hover:shadow-sm'
            }`}
          >
            <div className="flex gap-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 ${getIconColor(
                  announcement.type
                )} rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                {getTypeIcon(announcement.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-semibold text-lg pr-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {announcement.title}
                  </h3>
                  <span
                    className={`px-3 py-1 ${getBadgeColor(
                      announcement.type
                    )} rounded-lg text-xs font-medium whitespace-nowrap`}
                  >
                    {getBadgeLabel(announcement.type)}
                  </span>
                </div>

                <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {announcement.description}
                </p>

                <div className={`flex items-center gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{announcement.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{announcement.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
