export interface Camera {
  id: number;
  name: string;
  status: 'live' | 'offline';
  location: string;
}

export const cameras: Camera[] = [
  { id: 0, name: 'ถนนท่า หน้าวัดอุปคุต', status: 'live', location: 'ถนนท่า' },
  { id: 1, name: 'ถนนท่าแพ', status: 'live', location: 'ถนนท่าแพ' },
  { id: 2, name: 'ถนนมูลเมือง', status: 'live', location: 'ถนนมูลเมือง' },
  { id: 3, name: 'ถนนชัยศรีภูมิ คูเมืองแยกช้างม่อย', status: 'live', location: 'ถนนชัยศรีภูมิ' },
  { id: 4, name: 'ถนนหน้าประตูเชียงใหม่', status: 'live', location: 'ประตูเชียงใหม่' },
  { id: 5, name: 'ถนนช้างหล่อ แยกถนนทิพย์เนตร', status: 'live', location: 'ถนนช้างหล่อ' },
  { id: 6, name: 'สี่แยกหลังมหาวิทยาลัยเชียงใหม่', status: 'live', location: 'มช.' },
  { id: 7, name: 'สี่แยกหน้าม หาวิทยาลัยเชียงใหม่ 1', status: 'live', location: 'มช.' },
  { id: 8, name: 'สี่แยกหน้ามหาวิทยาลัยเชียงใหม่ 2', status: 'live', location: 'มช.' },
  { id: 9, name: 'สี่แยกเมญ่า 1', status: 'live', location: 'สี่แยกเมญ่า' },
  { id: 10, name: 'สี่แยกเมญ่า 2', status: 'live', location: 'สี่แยกเมญ่า' },
  { id: 11, name: 'สี่แยกถนนเจริญเมือง สะพานนวรัฐ 1', status: 'live', location: 'สะพานนวรัฐ' },
  { id: 12, name: 'สี่แยกถนนเจริญเมือง สะพานนวรัฐ 2', status: 'live', location: 'สะพานนวรัฐ' },
  { id: 13, name: 'สี่แยกถนนเจริญเมือง สะพานนวรัฐ 3', status: 'live', location: 'สะพานนวรัฐ' },
];
