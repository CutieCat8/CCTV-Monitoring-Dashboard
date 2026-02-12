export interface Camera {
  id: number;
  name: string;
  status: 'live' | 'offline';
  location: string;
}

export const cameras: Camera[] = [
  { id: 0, name: 'ถนนท่าแพ หน้าวัดอุปคุต', status: 'live', location: 'ถนนท่าแพ' },
  { id: 1, name: 'ถนนท่าแพ', status: 'live', location: 'ถนนท่าแพ' },
  { id: 2, name: 'ถนนมูลเมือง', status: 'live', location: 'ถนนมูลเมือง' },
  { id: 3, name: 'ถนนชัยศรีภูมิ คูเมืองแยกช้างม่อย', status: 'live', location: 'ถนนชัยศรีภูมิ' },
  { id: 4, name: 'ถนนหน้าประตูเชียงใหม่', status: 'offline', location: 'ประตูเชียงใหม่' },
  { id: 5, name: 'ถนนช้างหล่อ แยกถนนทิพย์เนตร', status: 'live', location: 'ถนนช้างหล่อ' },
  { id: 6, name: 'สี่แยกหลังมหาวิทยาลัยเชียงใหม่', status: 'offline', location: 'มช.' },
  { id: 7, name: 'สี่แยกหน้าม หาวิทยาลัยเชียงใหม่ 1', status: 'offline', location: 'มช.' },
  { id: 8, name: 'สี่แยกหน้ามหาวิทยาลัยเชียงใหม่ 2', status: 'offline', location: 'มช.' },
  { id: 9, name: 'สี่แยกเมญ่า 1', status: 'live', location: 'สี่แยกเมญ่า' },
  { id: 10, name: 'สี่แยกเมญ่า 2', status: 'live', location: 'สี่แยกเมญ่า' },
  { id: 16, name: 'สี่แยกเมญ่า 3', status: 'live', location: 'สี่แยกเมญ่า' },
  { id: 11, name: 'สี่แยกถนนเจริญเมือง สะพานนวรัฐ 1', status: 'offline', location: 'สะพานนวรัฐ' },
  { id: 12, name: 'สี่แยกถนนเจริญเมือง สะพานนวรัฐ 2', status: 'offline', location: 'สะพานนวรัฐ' },
  { id: 13, name: 'สี่แยกถนนเจริญเมือง สะพานนวรัฐ 3', status: 'offline', location: 'สะพานนวรัฐ' },
  { id: 14, name: 'ถนนบำรุงบุรี', status: 'live', location: 'ถนนบำรุงบุรี' },
  { id: 15, name: 'ถนนลอยเคราะห์-สะพานเหล็ก', status: 'live', location: 'ถนนลอยเคราะห์' },
];

// Map Equipment Name จาก API ไปเป็นชื่อกล้องใน Live Monitoring
export function mapEquipmentNameToCameraName(equipmentName: string | undefined): string | null {
  if (!equipmentName) return null;
  
  const mapping: Record<string, string> = {
    'ถนนชัยศรีภูมิ-คูเมืองแยกช้างม่อย': 'ถนนชัยศรีภูมิ คูเมืองแยกช้างม่อย',
    'ถนนมูลเมือง-คูเมืองแยกราชมรรคา': 'ถนนมูลเมือง',
    '172.16.3.116': 'สี่แยกเมญ่า 1',
    '172.16.3.117': 'สี่แยกเมญ่า 2',
    '172.16.3.118': 'สี่แยกเมญ่า 3',
    'ถนนท่าแพ': 'ถนนท่าแพ',
    'ถนนท่าแพ-หน้าวัดอุปคุต': 'ถนนท่าแพ หน้าวัดอุปคุต',
    'ถนนช่างหล่อ-แยกถนนทิพย์เนตร': 'ถนนช้างหล่อ แยกถนนทิพย์เนตร',
    'ถนนบำรุงบุรี': 'ถนนบำรุงบุรี',
    'ถนนลอยเคราะห์-สะพานเหล็ก': 'ถนนลอยเคราะห์-สะพานเหล็ก',
  };
  
  return mapping[equipmentName] || null;
}
