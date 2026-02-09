import { Calendar, MapPin, Users, Clock, ExternalLink } from 'lucide-react';
import { useState } from 'react';

type EventCategory = 'all' | 'festival' | 'market' | 'sports' | 'culture';

interface Event {
  id: string;
  category: EventCategory;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: string;
  emoji: string;
  badge: string;
  badgeColor: string;
  statusBadge: string;
  statusBadgeColor: string;
}

export function CitizenEvents() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');

  const events: Event[] = [
    {
      id: '1',
      category: 'festival',
      title: 'งานเทศกาลฤดูหนาว ณ สวน อบจ.เชียงใหม่',
      description:
        'ชมดอกไม้งามหลากสี กิจกรรมสนุกสนานสำหรับทุกครอบครัว คอนเสิร์ต และอาหารพื้นเมือง',
      date: '26 ธ.ค. 2025 - 3 ม.ค. 2026',
      time: '09:00 - 22:00 น.',
      location: 'สวน อบจ.เชียงใหม่',
      attendees: '15,000+ คน',
      emoji: '🌸',
      badge: 'เทศกาล',
      badgeColor: 'bg-pink-600',
      statusBadge: 'กำลังจัด',
      statusBadgeColor: 'bg-green-600',
    },
    {
      id: '2',
      category: 'festival',
      title: 'งาน.datatablesดอกไม้เชียงใหม่',
      description:
        '.datatablesดอกไม้ประจำปี ขบวนแห่รถประดับดอกไม้ นางสาวดอกไม้ และกิจกรรมทางวัฒนธรรม',
      date: '1-3 ก.พ. 2026',
      time: 'ตลอดวัน',
      location: 'ถนนช้างคลาน - ท่าแพ',
      attendees: '50,000+ คน',
      emoji: '🌸',
      badge: 'เทศกาล',
      badgeColor: 'bg-pink-600',
      statusBadge: 'เร็วๆ นี้',
      statusBadgeColor: 'bg-orange-600',
    },
    {
      id: '3',
      category: 'market',
      title: 'ตลาดนัดสินค้า OTOP',
      description:
        'สินค้าพื้นเมืองคุณภาพจากกลุ่ม OTOP ทั่วจังหวัด อาหาร ผ้า หัตถกรรม ของที่ระลึก',
      date: 'ทุกสุดสัปดาห์',
      time: '17:00 - 22:00 น.',
      location: 'ลานกิจกรรม ท่าแพ',
      attendees: '3,000+ คน',
      emoji: '🛍️',
      badge: 'ตลาด',
      badgeColor: 'bg-blue-600',
      statusBadge: 'ทุกสัปดาห์',
      statusBadgeColor: 'bg-blue-600',
    },
    {
      id: '4',
      category: 'sports',
      title: 'วิ่งการกุศล Chiang Mai Marathon',
      description:
        'งานวิ่งการกุศลประจำปี ระยะทาง 5, 10, 21 และ 42 กม. ร่วมวิ่งเพื่อสุขภาพและการกุศล',
      date: '15 ก.พ. 2026',
      time: '05:00 - 12:00 น.',
      location: 'จุดสตาร์ท สนามกีฬา 700 ปี',
      attendees: '8,000+ คน',
      emoji: '🏃',
      badge: 'กีฬา',
      badgeColor: 'bg-orange-600',
      statusBadge: 'เร็วๆ นี้',
      statusBadgeColor: 'bg-orange-600',
    },
    {
      id: '5',
      category: 'culture',
      title: 'งานวัฒนธรรมล้านนา',
      description:
        'แสดงวัฒนธรรมล้านนา ฟ้อนรำ ดนตรีพื้นบ้าน อาหารล้านนา และกิจกรรมเชิงอนุรักษ์',
      date: '10-12 ก.พ. 2026',
      time: '10:00 - 21:00 น.',
      location: 'ศูนย์วัฒนธรรมล้านนา',
      attendees: '5,000+ คน',
      emoji: '🎭',
      badge: 'วัฒนธรรม',
      badgeColor: 'bg-pink-600',
      statusBadge: 'เร็วๆ นี้',
      statusBadgeColor: 'bg-orange-600',
    },
    {
      id: '6',
      category: 'market',
      title: 'Chiang Mai Night Market',
      description:
        'ตลาดกลางคืนย่านเมืองเก่า อาหารริมทาง สินค้าพื้นเมือง และการแสดงสด',
      date: 'ทุกวัน',
      time: '18:00 - 24:00 น.',
      location: 'ถนนคนเดินวัวลาย',
      attendees: '10,000+ คน',
      emoji: '🏮',
      badge: 'ตลาด',
      badgeColor: 'bg-blue-600',
      statusBadge: 'ทุกวัน',
      statusBadgeColor: 'bg-blue-600',
    },
  ];

  const categories = [
    { id: 'all' as EventCategory, label: 'ทั้งหมด' },
    { id: 'festival' as EventCategory, label: 'เทศกาล' },
    { id: 'market' as EventCategory, label: 'ตลาด' },
    { id: 'sports' as EventCategory, label: 'กีฬา' },
    { id: 'culture' as EventCategory, label: 'วัฒนธรรม' },
  ];

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((event) => event.category === selectedCategory);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">อีเวนท์และกิจกรรม</h1>
        <p className="text-gray-400 text-sm">
          งานและกิจกรรมทั้งหมดในเมืองใหม่
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2 rounded-lg font-medium transition-all text-sm ${
              selectedCategory === category.id
                ? 'bg-orange-600 text-white'
                : 'bg-neutral-900 text-gray-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-3 gap-5">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all group"
          >
            {/* Event Image/Emoji */}
            <div className="h-44 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center relative">
              <div className="text-7xl">{event.emoji}</div>
              {/* Status Badge - Left */}
              <div className="absolute top-4 left-4">
                <div
                  className={`${event.statusBadgeColor} text-white text-xs px-3 py-1 rounded-lg font-medium`}
                >
                  {event.statusBadge}
                </div>
              </div>
              {/* Category Badge - Right */}
              <div className="absolute top-4 right-4">
                <div className="text-white text-sm font-medium">
                  {event.badge}
                </div>
              </div>
            </div>

            {/* Event Content */}
            <div className="p-5">
              <h3 className="text-white font-bold text-base mb-2 line-clamp-2 min-h-[3rem]">
                {event.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
                {event.description}
              </p>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">{event.date}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">{event.time}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">{event.location}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs">{event.attendees}</span>
                </div>
              </div>

              {/* View Details Button */}
              <button className="w-full bg-transparent hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium">
                <ExternalLink className="w-4 h-4" />
                ดูรายละเอียด
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}