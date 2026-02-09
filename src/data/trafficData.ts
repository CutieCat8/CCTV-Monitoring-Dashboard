export interface TrafficDataPoint {
  hour: string;
  vehicles: number;
}

// Generate mock traffic data for each camera
export const generateTrafficData = (cameraId: number): TrafficDataPoint[] => {
  const baseData = [
    { hour: '00:00', base: 120 },
    { hour: '01:00', base: 80 },
    { hour: '02:00', base: 60 },
    { hour: '03:00', base: 50 },
    { hour: '04:00', base: 70 },
    { hour: '05:00', base: 150 },
    { hour: '06:00', base: 350 },
    { hour: '07:00', base: 580 },
    { hour: '08:00', base: 720 },
    { hour: '09:00', base: 650 },
    { hour: '10:00', base: 550 },
    { hour: '11:00', base: 600 },
    { hour: '12:00', base: 680 },
    { hour: '13:00', base: 620 },
    { hour: '14:00', base: 580 },
    { hour: '15:00', base: 620 },
    { hour: '16:00', base: 700 },
    { hour: '17:00', base: 780 },
    { hour: '18:00', base: 820 },
    { hour: '19:00', base: 650 },
    { hour: '20:00', base: 480 },
    { hour: '21:00', base: 380 },
    { hour: '22:00', base: 280 },
    { hour: '23:00', base: 180 },
  ];

  // Add some variation based on camera ID
  const variation = cameraId * 0.1;
  
  return baseData.map(point => ({
    hour: point.hour,
    vehicles: Math.floor(point.base * (1 + variation * (Math.random() - 0.5)))
  }));
};
