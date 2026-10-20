export interface Camera {
  id: number;
  name: string;
  status: 'live' | 'offline';
  location: string;
  streamUrl?: string; // mock-up: public Caltrans HLS feed
  streamSource?: string;
}

export const cameras: Camera[] = [
  { id: 0, name: 'Hwy 51 at H St', status: 'live', location: 'Sacramento', streamUrl: 'https://wzmedia.dot.ca.gov/D3/51_H_St_SAC51_SB.stream/playlist.m3u8', streamSource: 'Hwy 51 at H St, Sacramento' },
  { id: 1, name: 'US-101 Candlestick Park', status: 'live', location: 'San Francisco', streamUrl: 'https://wzmedia.dot.ca.gov/D4/N101_at_Candlestick_Park.stream/playlist.m3u8', streamSource: 'US-101 Candlestick Park, San Francisco' },
  { id: 2, name: 'I-110 Avenue 26', status: 'live', location: 'Los Angeles', streamUrl: 'https://wzmedia.dot.ca.gov/D7/CCTV-196.stream/playlist.m3u8', streamSource: 'I-110 Avenue 26, Los Angeles' },
  { id: 3, name: 'Hwy 5 at Pocket Rd', status: 'live', location: 'Sacramento', streamUrl: 'https://wzmedia.dot.ca.gov/D3/5_Pocket_Rd_OC_SAC5_SB.stream/playlist.m3u8', streamSource: 'Hwy 5 at Pocket Rd, Sacramento' },
  { id: 5, name: 'I-580 Toll Plaza', status: 'live', location: 'Richmond', streamUrl: 'https://wzmedia.dot.ca.gov/D4/E580_at_Toll_Plaza.stream/playlist.m3u8', streamSource: 'I-580 Toll Plaza, Richmond' },
  { id: 9, name: 'SR-99 Fremont St', status: 'live', location: 'Stockton', streamUrl: 'https://wzmedia.dot.ca.gov/D10/SJ_NB99_NO_FremontSt.stream/playlist.m3u8', streamSource: 'SR-99 Fremont St, Stockton' },
  { id: 10, name: 'SR-180 Cedar Ave', status: 'live', location: 'Fresno', streamUrl: 'https://wzmedia.dot.ca.gov/D6/180_JWO_Cedar.stream/playlist.m3u8', streamSource: 'SR-180 Cedar Ave, Fresno' },
  { id: 16, name: 'I-10 LA County Line', status: 'live', location: 'Montclair', streamUrl: 'https://wzmedia.dot.ca.gov/D8/LB-8_10_1.stream/playlist.m3u8', streamSource: 'I-10 LA County Line, Montclair' },
  { id: 14, name: 'US-101 Sheffield Dr', status: 'live', location: 'Summerland', streamUrl: 'https://wzmedia.dot.ca.gov/D5/101atSheffieldDr.stream/playlist.m3u8', streamSource: 'US-101 Sheffield Dr, Summerland' },
  { id: 15, name: 'SR-99 Airport Dr', status: 'live', location: 'Bakersfield', streamUrl: 'https://wzmedia.dot.ca.gov/D6/99_Airport_Dr.stream/playlist.m3u8', streamSource: 'SR-99 Airport Dr, Bakersfield' },
  { id: 4, name: 'ถนนหน้าประตูเชียงใหม่', status: 'offline', location: 'ประตูเชียงใหม่' },
  { id: 6, name: 'สี่แยกหลังมหาวิทยาลัยเชียงใหม่', status: 'offline', location: 'มช.' },
  { id: 7, name: 'สี่แยกหน้าม หาวิทยาลัยเชียงใหม่ 1', status: 'offline', location: 'มช.' },
  { id: 8, name: 'สี่แยกหน้ามหาวิทยาลัยเชียงใหม่ 2', status: 'offline', location: 'มช.' },
  { id: 11, name: 'สี่แยกถนนเจริญเมือง สะพานนวรัฐ 1', status: 'offline', location: 'สะพานนวรัฐ' },
  { id: 12, name: 'สี่แยกถนนเจริญเมือง สะพานนวรัฐ 2', status: 'offline', location: 'สะพานนวรัฐ' },
  { id: 13, name: 'สี่แยกถนนเจริญเมือง สะพานนวรัฐ 3', status: 'offline', location: 'สะพานนวรัฐ' },
];

// Map Equipment Name จาก API ไปเป็นชื่อกล้องใน Live Monitoring
export function mapEquipmentNameToCameraName(equipmentName: string | undefined): string | null {
  if (!equipmentName) return null;
  
  const mapping: Record<string, string> = {
    'ถนนชัยศรีภูมิ-คูเมืองแยกช้างม่อย': 'Hwy 5 at Pocket Rd',
    'ถนนมูลเมือง-คูเมืองแยกราชมรรคา': 'I-110 Avenue 26',
    '172.16.3.116': 'SR-99 Fremont St',
    '172.16.3.117': 'SR-180 Cedar Ave',
    '172.16.3.118': 'I-10 LA County Line',
    'ถนนท่าแพ': 'US-101 Candlestick Park',
    'ถนนท่าแพ-หน้าวัดอุปคุต': 'Hwy 51 at H St',
    'ถนนช่างหล่อ-แยกถนนทิพย์เนตร': 'I-580 Toll Plaza',
    'ถนนบำรุงบุรี': 'US-101 Sheffield Dr',
    'ถนนลอยเคราะห์-สะพานเหล็ก': 'SR-99 Airport Dr',
  };
  
  return mapping[equipmentName] || null;
}
