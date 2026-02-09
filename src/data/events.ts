export interface Event {
  id: number;
  type: 'no-helmet' | 'illegal-parking' | 'red-light' | 'wrong-lane';
  cameraId: number;
  cameraName: string;
  timestamp: Date;
  thumbnail: string;
}

export const violationTypes = {
  'no-helmet': { label: 'No Helmet Detected', color: 'bg-orange-100 text-orange-700' },
  'illegal-parking': { label: 'Illegal Parking', color: 'bg-red-100 text-red-700' },
  'red-light': { label: 'Red Light Violation', color: 'bg-red-100 text-red-700' },
  'wrong-lane': { label: 'Wrong Lane Usage', color: 'bg-yellow-100 text-yellow-700' },
};

export const events: Event[] = [
  {
    id: 1,
    type: 'no-helmet',
    cameraId: 1,
    cameraName: 'ถนนท่าแพ',
    timestamp: new Date(Date.now() - 5 * 60000),
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    type: 'illegal-parking',
    cameraId: 4,
    cameraName: 'ถนนหน้าประตูเชียงใหม่',
    timestamp: new Date(Date.now() - 12 * 60000),
    thumbnail: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    type: 'red-light',
    cameraId: 6,
    cameraName: 'สี่แยกหลังมหาวิทยาลัยเชียงใหม่',
    timestamp: new Date(Date.now() - 18 * 60000),
    thumbnail: 'https://images.unsplash.com/photo-1533197901-0bebd4a016ec?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    type: 'wrong-lane',
    cameraId: 9,
    cameraName: 'สี่แยกเมญ่า 1',
    timestamp: new Date(Date.now() - 25 * 60000),
    thumbnail: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    type: 'no-helmet',
    cameraId: 11,
    cameraName: 'สี่แยกถนนเจริญเมือง สะพานนวรัฐ 1',
    timestamp: new Date(Date.now() - 35 * 60000),
    thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop'
  },
  {
    id: 6,
    type: 'illegal-parking',
    cameraId: 2,
    cameraName: 'ถนนมูลเมือง',
    timestamp: new Date(Date.now() - 45 * 60000),
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop'
  },
];
