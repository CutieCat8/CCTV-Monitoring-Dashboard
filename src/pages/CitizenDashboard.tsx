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
import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router';
import type { CitizenArea } from '../components/CitizenLayout';
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

interface AirQualityState {
  pm25: number;
  previousDayPm25: number | null;
  updatedAt: string;
  unit: 'aqi' | 'ugm3';
  source: 'aqicn' | 'air4thai' | 'open-meteo' | 'fallback';
}

interface WeatherState {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number | null;
  updatedAt: string;
  source: 'aqicn' | 'air4thai' | 'open-meteo' | 'fallback';
}

interface CitizenLayoutContext {
  selectedArea: CitizenArea;
}

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: 'ท้องฟ้าโปร่ง',
  1: 'แดดอ่อน',
  2: 'มีเมฆบางส่วน',
  3: 'เมฆมาก',
  45: 'หมอก',
  48: 'หมอกจัด',
  51: 'ฝนปรอยเล็กน้อย',
  53: 'ฝนปรอยปานกลาง',
  55: 'ฝนปรอยหนัก',
  61: 'ฝนเล็กน้อย',
  63: 'ฝนปานกลาง',
  65: 'ฝนหนัก',
  71: 'หิมะเล็กน้อย',
  73: 'หิมะปานกลาง',
  75: 'หิมะหนัก',
  80: 'ฝนตกเป็นช่วง',
  81: 'ฝนตกเป็นช่วงปานกลาง',
  82: 'ฝนตกเป็นช่วงหนัก',
  95: 'พายุฝนฟ้าคะนอง',
};

const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN as string | undefined;
const AIR4THAI_PROXY_URL = 'https://r.jina.ai/http://air4thai.pcd.go.th/services/getNewAQI_JSON.php';

interface Air4ThaiStation {
  stationID: string;
  areaTH?: string;
  lat?: string;
  long?: string;
  AQILast?: {
    date?: string;
    time?: string;
    PM25?: {
      aqi?: string;
      value?: string;
    };
  };
}

interface Air4ThaiStationsResponse {
  stations?: Air4ThaiStation[];
}

interface WaqiResponse {
  status: 'ok' | 'error';
  data?: {
    aqi?: number;
    iaqi?: {
      pm25?: { v: number };
      t?: { v: number };
      h?: { v: number };
      w?: { v: number };
    };
    time?: {
      iso?: string;
      s?: string;
    };
  };
}

const parseJinaWrappedJson = <T,>(rawText: string): T | null => {
  const firstBrace = rawText.indexOf('{');
  const lastBrace = rawText.lastIndexOf('}');

  if (firstBrace < 0 || lastBrace <= firstBrace) {
    return null;
  }

  try {
    return JSON.parse(rawText.slice(firstBrace, lastBrace + 1)) as T;
  } catch {
    return null;
  }
};

const normalizeAreaText = (text?: string) =>
  (text ?? '')
    .replace(/[\s,.]/g, '')
    .replace('เชียงใหม่', '')
    .replace('อำเภอ', 'อ.')
    .replace('ตำบล', 'ต.')
    .toLowerCase();

const toNumber = (value?: string) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const pickBestAir4ThaiStation = (stations: Air4ThaiStation[], selectedArea: CitizenArea) => {
  const districtKey = normalizeAreaText(selectedArea.district).replace('อ.', '');
  const subdistrictKey = normalizeAreaText(selectedArea.subdistrict).replace('ต.', '');

  const ranked = stations
    .map((station) => {
      const areaKey = normalizeAreaText(station.areaTH);
      const lat = toNumber(station.lat);
      const lon = toNumber(station.long);
      const distance = lat !== null && lon !== null ? getDistanceKm(selectedArea.latitude, selectedArea.longitude, lat, lon) : 9999;

      let score = 0;
      if (areaKey.includes(districtKey)) {
        score += 3;
      }
      if (subdistrictKey && areaKey.includes(subdistrictKey)) {
        score += 5;
      }

      return { station, score, distance };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.distance - b.distance;
    });

  return ranked[0]?.station;
};

const getPm25Status = (value: number, unit: 'aqi' | 'ugm3') => {
  const normalized = unit === 'aqi' ? value : value * 2;

  if (normalized <= 50) {
    return {
      label: 'ดี',
      textClass: 'text-green-500',
      dotClass: 'bg-green-500',
    };
  }

  if (normalized <= 100) {
    return {
      label: 'ปานกลาง',
      textClass: 'text-yellow-500',
      dotClass: 'bg-yellow-500',
    };
  }

  if (normalized <= 150) {
    return {
      label: 'เริ่มมีผลต่อสุขภาพ',
      textClass: 'text-orange-500',
      dotClass: 'bg-orange-500',
    };
  }

  if (normalized <= 200) {
    return {
      label: 'มีผลต่อสุขภาพ',
      textClass: 'text-red-500',
      dotClass: 'bg-red-500',
    };
  }

  return {
    label: 'มีผลต่อสุขภาพ',
    textClass: 'text-purple-500',
    dotClass: 'bg-purple-500',
  };
};

const formatThaiDateTime = (iso: string) => {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getPm25ProgressWidthClass = (value: number) => {
  if (value <= 15) return 'w-[10%]';
  if (value <= 30) return 'w-[20%]';
  if (value <= 45) return 'w-[30%]';
  if (value <= 60) return 'w-[40%]';
  if (value <= 75) return 'w-[50%]';
  if (value <= 90) return 'w-[60%]';
  if (value <= 105) return 'w-[70%]';
  if (value <= 120) return 'w-[80%]';
  if (value <= 135) return 'w-[90%]';
  return 'w-full';
};

export function CitizenDashboard() {
  const [showAlert, setShowAlert] = useState(true);
  const { isDarkMode } = useTheme();
  const { selectedArea } = useOutletContext<CitizenLayoutContext>();
  const [airQuality, setAirQuality] = useState<AirQualityState>({
    pm25: 45,
    previousDayPm25: null,
    updatedAt: new Date().toISOString(),
    unit: 'ugm3',
    source: 'fallback',
  });
  const [weather, setWeather] = useState<WeatherState>({
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    weatherCode: null,
    updatedAt: new Date().toISOString(),
    source: 'fallback',
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchEnvironmentData = async () => {
      try {
        let airQualityResolved = false;

        if (WAQI_TOKEN && WAQI_TOKEN.trim()) {
          const waqiResponse = await fetch(
            `https://api.waqi.info/feed/geo:${selectedArea.latitude};${selectedArea.longitude}/?token=${encodeURIComponent(
              WAQI_TOKEN.trim()
            )}`,
            { signal: controller.signal }
          );

          if (waqiResponse.ok) {
            const waqiPayload: WaqiResponse = await waqiResponse.json();

            if (waqiPayload.status === 'ok' && waqiPayload.data) {
              const pm25Aqi = Number(waqiPayload.data.iaqi?.pm25?.v ?? waqiPayload.data.aqi);
              const overallAqi = Number(waqiPayload.data.aqi);
              const currentHumidity = Number(waqiPayload.data.iaqi?.h?.v);
              const currentTemperature = Number(waqiPayload.data.iaqi?.t?.v);
              const currentWindSpeed = Number(waqiPayload.data.iaqi?.w?.v);
              const updatedAt =
                waqiPayload.data.time?.iso ??
                waqiPayload.data.time?.s ??
                new Date().toISOString();

              if (Number.isFinite(pm25Aqi)) {
                setAirQuality({
                  pm25: pm25Aqi,
                  previousDayPm25: Number.isFinite(overallAqi) ? overallAqi : null,
                  updatedAt,
                  unit: 'aqi',
                  source: 'aqicn',
                });
                airQualityResolved = true;
              }

              if (Number.isFinite(currentTemperature) || Number.isFinite(currentHumidity) || Number.isFinite(currentWindSpeed)) {
                setWeather((prev) => ({
                  temperature: Number.isFinite(currentTemperature) ? currentTemperature : prev.temperature,
                  humidity: Number.isFinite(currentHumidity) ? currentHumidity : prev.humidity,
                  windSpeed: Number.isFinite(currentWindSpeed) ? currentWindSpeed : prev.windSpeed,
                  weatherCode: prev.weatherCode,
                  updatedAt,
                  source: 'aqicn',
                }));
              }
            }
          }
        }

        if (!airQualityResolved) {
          const air4ThaiResponse = await fetch(AIR4THAI_PROXY_URL, { signal: controller.signal });
          if (air4ThaiResponse.ok) {
            const rawPayload = await air4ThaiResponse.text();
            const parsedPayload = parseJinaWrappedJson<Air4ThaiStationsResponse>(rawPayload);
            const stations = Array.isArray(parsedPayload?.stations)
              ? parsedPayload.stations.filter((station) => (station.areaTH ?? '').includes('เชียงใหม่'))
              : [];

            if (stations.length > 0) {
              const matchedStation = pickBestAir4ThaiStation(stations, selectedArea);
              const pm25Aqi = toNumber(matchedStation?.AQILast?.PM25?.aqi);
              const pm25Value = toNumber(matchedStation?.AQILast?.PM25?.value);
              const dateText = matchedStation?.AQILast?.date ?? '';
              const timeText = matchedStation?.AQILast?.time ?? '00:00';
              const updatedAt = dateText ? `${dateText}T${timeText}:00+07:00` : new Date().toISOString();

              if (pm25Aqi !== null && pm25Aqi >= 0) {
                setAirQuality({
                  pm25: pm25Aqi,
                  previousDayPm25: pm25Value,
                  updatedAt,
                  unit: 'aqi',
                  source: 'air4thai',
                });
                airQualityResolved = true;
              }
            }
          }
        }

        const airQualityQuery = new URLSearchParams({
          latitude: selectedArea.latitude.toString(),
          longitude: selectedArea.longitude.toString(),
          current: 'pm2_5',
          hourly: 'pm2_5',
          timezone: 'Asia/Bangkok',
          past_days: '2',
          forecast_days: '1',
        });

        const weatherQuery = new URLSearchParams({
          latitude: selectedArea.latitude.toString(),
          longitude: selectedArea.longitude.toString(),
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
          timezone: 'Asia/Bangkok',
        });

        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${weatherQuery.toString()}`, {
          signal: controller.signal,
        });

        if (!weatherResponse.ok) {
          throw new Error('Unable to fetch air quality data');
        }

        const weatherPayload = await weatherResponse.json();

        const currentTemperature = Number(weatherPayload?.current?.temperature_2m);
        const currentHumidity = Number(weatherPayload?.current?.relative_humidity_2m);
        const currentWindSpeed = Number(weatherPayload?.current?.wind_speed_10m);
        const currentWeatherCode = Number(weatherPayload?.current?.weather_code);
        const weatherTime = String(weatherPayload?.current?.time ?? new Date().toISOString());

        if (!Number.isFinite(currentTemperature) || !Number.isFinite(currentHumidity) || !Number.isFinite(currentWindSpeed)) {
          throw new Error('Invalid weather value');
        }

        if (!airQualityResolved) {
          const airQualityResponse = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${airQualityQuery.toString()}`, {
            signal: controller.signal,
          });

          if (!airQualityResponse.ok) {
            throw new Error('Unable to fetch fallback PM2.5 data');
          }

          const airPayload = await airQualityResponse.json();
          const currentPm25 = Number(airPayload?.current?.pm2_5);
          const currentTime = String(airPayload?.current?.time ?? new Date().toISOString());
          const hourlyTimes: string[] = Array.isArray(airPayload?.hourly?.time) ? airPayload.hourly.time : [];
          const hourlyPm25: number[] = Array.isArray(airPayload?.hourly?.pm2_5) ? airPayload.hourly.pm2_5 : [];

          const currentIndex = hourlyTimes.findIndex((time) => time === currentTime);
          const previousDayIndex = currentIndex >= 24 ? currentIndex - 24 : -1;
          const previousDayValue =
            previousDayIndex >= 0 && Number.isFinite(hourlyPm25[previousDayIndex])
              ? Number(hourlyPm25[previousDayIndex])
              : null;

          if (!Number.isFinite(currentPm25)) {
            throw new Error('Invalid PM2.5 value');
          }

          setAirQuality({
            pm25: currentPm25,
            previousDayPm25: previousDayValue,
            updatedAt: currentTime,
            unit: 'ugm3',
            source: 'open-meteo',
          });
        }

        setWeather({
          temperature: currentTemperature,
          humidity: currentHumidity,
          windSpeed: currentWindSpeed,
          weatherCode: Number.isFinite(currentWeatherCode) ? currentWeatherCode : null,
          updatedAt: weatherTime,
          source: 'open-meteo',
        });
      } catch {
        setAirQuality((prev) => ({ ...prev, source: 'fallback' }));
        setWeather((prev) => ({ ...prev, source: 'fallback' }));
      }
    };

    void fetchEnvironmentData();

    return () => {
      controller.abort();
    };
  }, [selectedArea.latitude, selectedArea.longitude]);

  const pm25Status = getPm25Status(airQuality.pm25, airQuality.unit);
  const pm25ProgressWidthClass = getPm25ProgressWidthClass(airQuality.unit === 'aqi' ? airQuality.pm25 / 2 : airQuality.pm25);
  const weatherLabel = weather.weatherCode !== null ? WEATHER_CODE_LABELS[weather.weatherCode] ?? 'สภาพอากาศแปรปรวน' : 'ไม่ทราบสภาพอากาศ';
  const trendPercent =
    airQuality.previousDayPm25 && airQuality.previousDayPm25 > 0 && airQuality.unit === 'ugm3'
      ? Math.round(((airQuality.pm25 - airQuality.previousDayPm25) / airQuality.previousDayPm25) * 100)
      : null;
  const isImproving = trendPercent !== null && trendPercent < 0;

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
            {trendPercent !== null ? (
              <div className={`flex items-center gap-1 text-sm ${isImproving ? 'text-green-500' : 'text-red-500'}`}>
                {isImproving ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                <span>{trendPercent > 0 ? `+${trendPercent}%` : `${trendPercent}%`}</span>
              </div>
            ) : (
              <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>-</div>
            )}
          </div>

          <div className="mb-4">
            <div className={`text-5xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(airQuality.pm25)}{' '}
              <span className={`text-2xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {airQuality.unit === 'aqi' ? 'AQI' : 'µg/m³'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${pm25Status.dotClass}`}></div>
              <span className={`${pm25Status.textClass} text-sm font-medium`}>{pm25Status.label}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {airQuality.source !== 'fallback'
                ? `ข้อมูลจริง ${selectedArea.label} จาก ${
                    airQuality.source === 'aqicn'
                      ? 'AQICN/WAQI'
                      : airQuality.source === 'air4thai'
                        ? 'Air4Thai (PCD)'
                        : 'Open-Meteo'
                  } อัพเดท ${formatThaiDateTime(airQuality.updatedAt)}`
                : 'กำลังใช้ค่าประมาณชั่วคราว (รอเชื่อมต่อ API คุณภาพอากาศ)'}
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-200'}`}>
              <div className={`h-full bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 rounded-full ${pm25ProgressWidthClass}`}></div>
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
                {Math.round(weather.temperature)}°
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{weatherLabel}</div>
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
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(weather.humidity)}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="w-4 h-4 text-gray-400" />
              <div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>ลม</div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(weather.windSpeed)} km/h</div>
              </div>
            </div>
          </div>
          <div className={`text-xs mt-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            {weather.source !== 'fallback'
              ? `ข้อมูลจริง ${selectedArea.label} จาก ${weather.source === 'aqicn' ? 'AQICN/WAQI' : 'Open-Meteo'} อัพเดท ${formatThaiDateTime(weather.updatedAt)}`
              : 'กำลังใช้ค่าประมาณชั่วคราว (รอเชื่อมต่อ API สภาพอากาศ)'}
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
