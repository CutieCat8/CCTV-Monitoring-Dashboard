import { useCallback, useEffect, useMemo, useState } from 'react';
import { HelpCircle, Wind, Car, RefreshCcw, Plus, Minus } from 'lucide-react';
import { useOutletContext } from 'react-router';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { CitizenArea } from '../components/CitizenLayout';
import { useTheme } from '../contexts/ThemeContext';

type IncidentType = 'accident' | 'congestion' | 'violation';
type MapMode = 'traffic' | 'aqi';

interface Incident {
  id: string;
  type: IncidentType;
  lat: number;
  lng: number;
  label: string;
  count?: number;
}

interface Air4ThaiStation {
  stationID: string;
  nameTH?: string;
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

interface WaqiMapStation {
  uid?: number;
  aqi?: number | string;
  lat?: number;
  lon?: number;
  station?: {
    name?: string;
    time?: string;
  };
}

interface WaqiMapResponse {
  status: 'ok' | 'error';
  data?: WaqiMapStation[];
}

interface WaqiFeedResponse {
  status: 'ok' | 'error';
  data?: {
    dompol?: string;
    iaqi?: {
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

interface AQIDetail {
  domPol: string | null;
  temperature: number | null;
  humidity: number | null;
  wind: number | null;
  updatedAt: string;
}

interface CitizenLayoutContext {
  selectedArea: CitizenArea;
}

interface AQIMarker {
  id: string;
  uid: number | null;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number | null;
  updatedAt: string;
  source: 'aqicn' | 'air4thai' | 'fallback';
}

const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN as string | undefined;
const AIR4THAI_PROXY_URL = 'https://r.jina.ai/http://air4thai.pcd.go.th/services/getNewAQI_JSON.php';
const CHIANG_MAI_AQI_FETCH_BOUNDS = {
  minLat: 18.0,
  maxLat: 19.5,
  minLng: 98.2,
  maxLng: 99.7,
};

const FALLBACK_AQI_POINTS = [
  { id: 'fallback-chang-moi', name: 'ช้างม่อย', lat: 18.7939, lng: 98.9948, offset: 0 },
  { id: 'fallback-tha-phae', name: 'ท่าแพ', lat: 18.7876, lng: 98.9931, offset: 8 },
  { id: 'fallback-si-phum', name: 'ศรีภูมิ', lat: 18.7957, lng: 98.9865, offset: -6 },
  { id: 'fallback-hai-ya', name: 'หายยา', lat: 18.7778, lng: 98.9886, offset: 14 },
  { id: 'fallback-suthep', name: 'สุเทพ', lat: 18.7899, lng: 98.9532, offset: -12 },
  { id: 'fallback-wat-ket', name: 'วัดเกต', lat: 18.7905, lng: 99.0109, offset: 10 },
  { id: 'fallback-pa-tan', name: 'ป่าตัน', lat: 18.8077, lng: 98.9995, offset: 16 },
  { id: 'fallback-chang-phueak', name: 'ช้างเผือก', lat: 18.8102, lng: 98.9807, offset: 20 },
];

const TRAFFIC_INCIDENTS: Incident[] = [
  { id: 't-1', type: 'accident', lat: 18.7934, lng: 98.9999, label: 'อุบัติเหตุ (รถชน 2 คัน)', count: 2 },
  { id: 't-2', type: 'congestion', lat: 18.7867, lng: 98.9917, label: 'รถติดหนัก - ประตูท่าแพ' },
  { id: 't-3', type: 'violation', lat: 18.8011, lng: 98.9878, label: 'จอดกีดขวาง', count: 1 },
  { id: 't-4', type: 'congestion', lat: 18.7752, lng: 98.9881, label: 'รถติด - ถนนมหิดล' },
  { id: 't-5', type: 'congestion', lat: 18.7968, lng: 99.0121, label: 'รถติด - สะพานนวรัฐ' },
];

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);

  return null;
}

function ZoomControls({ isDarkMode }: { isDarkMode: boolean }) {
  const map = useMap();

  return (
    <div className="absolute top-20 right-6 z-[500]">
      <div
        className={`overflow-hidden rounded-xl border shadow-md ${
          isDarkMode ? 'bg-neutral-950/90 border-neutral-700' : 'bg-white/95 border-gray-300'
        }`}
      >
        <button
          type="button"
          onClick={() => map.zoomIn()}
          className={`w-10 h-10 flex items-center justify-center border-b transition-colors ${
            isDarkMode ? 'border-neutral-700 text-white hover:bg-neutral-800' : 'border-gray-200 text-gray-900 hover:bg-gray-100'
          }`}
          aria-label="ซูมเข้า"
          title="ซูมเข้า"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => map.zoomOut()}
          className={`w-10 h-10 flex items-center justify-center transition-colors ${
            isDarkMode ? 'text-white hover:bg-neutral-800' : 'text-gray-900 hover:bg-gray-100'
          }`}
          aria-label="ซูมออก"
          title="ซูมออก"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
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

const toNumber = (value?: string) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const clampAqi = (value: number) => Math.max(0, Math.min(500, Math.round(value)));

const parseAqiValue = (value: number | string | undefined) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return clampAqi(value);
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized || normalized === '-' || normalized === 'n/a') {
      return null;
    }

    const numeric = Number(normalized);
    if (Number.isFinite(numeric)) {
      return clampAqi(numeric);
    }
  }

  return null;
};

const normalizeWaqiTime = (value: string | undefined) => {
  if (!value?.trim()) {
    return new Date().toISOString();
  }

  const candidate = value.replace(' ', 'T');
  const withTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(candidate) ? candidate : `${candidate}+07:00`;
  const parsed = new Date(withTimezone);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

const isInsideCityBounds = (lat: number, lng: number) => {
  return (
    lat >= CHIANG_MAI_AQI_FETCH_BOUNDS.minLat &&
    lat <= CHIANG_MAI_AQI_FETCH_BOUNDS.maxLat &&
    lng >= CHIANG_MAI_AQI_FETCH_BOUNDS.minLng &&
    lng <= CHIANG_MAI_AQI_FETCH_BOUNDS.maxLng
  );
};

const createBoundsQuery = () => {
  const minLat = CHIANG_MAI_AQI_FETCH_BOUNDS.minLat;
  const minLng = CHIANG_MAI_AQI_FETCH_BOUNDS.minLng;
  const maxLat = CHIANG_MAI_AQI_FETCH_BOUNDS.maxLat;
  const maxLng = CHIANG_MAI_AQI_FETCH_BOUNDS.maxLng;
  return `${minLat},${minLng},${maxLat},${maxLng}`;
};

const formatThaiDateSafe = (dateValue: string, options: Intl.DateTimeFormatOptions) => {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return '-';
  }

  try {
    return new Intl.DateTimeFormat('th-TH', options).format(parsed);
  } catch {
    return '-';
  }
};

const getAqiLevel = (aqi: number) => {
  if (aqi <= 50) return { label: 'ดี', markerClass: 'aqi-level-good', panelClass: 'aqi-panel-good' };
  if (aqi <= 100) return { label: 'ปานกลาง', markerClass: 'aqi-level-moderate', panelClass: 'aqi-panel-moderate' };
  if (aqi <= 150) return { label: 'ไม่ดีต่อกลุ่มเสี่ยง', markerClass: 'aqi-level-sensitive', panelClass: 'aqi-panel-sensitive' };
  if (aqi <= 200) return { label: 'มีผลกระทบต่อสุขภาพ', markerClass: 'aqi-level-unhealthy', panelClass: 'aqi-panel-unhealthy' };
  if (aqi <= 300) return { label: 'อันตรายต่อสุขภาพ', markerClass: 'aqi-level-very-unhealthy', panelClass: 'aqi-panel-very-unhealthy' };
  return { label: 'เสี่ยงอันตราย', markerClass: 'aqi-level-hazardous', panelClass: 'aqi-panel-hazardous' };
};

const createAqiMarkerIcon = (aqi: number, isSelected: boolean) => {
  const level = getAqiLevel(aqi);
  const selectedClass = isSelected ? 'aqi-pin-selected' : '';

  return L.divIcon({
    className: 'aqi-pin-wrapper',
    html: `<div class="aqi-pin ${level.markerClass} ${selectedClass}"><div class="aqi-pin-label">${aqi}</div></div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};

const getIncidentColor = (type: IncidentType) => {
  switch (type) {
    case 'accident':
      return '#dc2626';
    case 'congestion':
      return '#f97316';
    case 'violation':
      return '#eab308';
  }
};

export function CitizenMap() {
  const { isDarkMode } = useTheme();
  const { selectedArea } = useOutletContext<CitizenLayoutContext>();
  const [mapMode, setMapMode] = useState<MapMode>('traffic');
  const [aqiMarkers, setAqiMarkers] = useState<AQIMarker[]>([]);
  const [selectedAqiMarkerId, setSelectedAqiMarkerId] = useState('');
  const [selectedAqiDetail, setSelectedAqiDetail] = useState<AQIDetail | null>(null);
  const [isAqiLoading, setIsAqiLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [aqiError, setAqiError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<string>('');
  const [filters, setFilters] = useState({
    accident: true,
    congestion: true,
    violation: true,
  });

  const visibleIncidents = useMemo(
    () => TRAFFIC_INCIDENTS.filter((incident) => filters[incident.type]),
    [filters]
  );

  const trafficStats = {
    accident: TRAFFIC_INCIDENTS.filter((i) => i.type === 'accident').length,
    congestion: TRAFFIC_INCIDENTS.filter((i) => i.type === 'congestion').length,
    violation: TRAFFIC_INCIDENTS.filter((i) => i.type === 'violation').length,
  };

  const fetchAqiData = useCallback(
    async (signal?: AbortSignal) => {
      setIsAqiLoading(true);
      setAqiError(null);

      try {
        const safeToken = WAQI_TOKEN?.trim();
        if (safeToken) {
          const bounds = createBoundsQuery();
          const waqiMapUrl = `https://api.waqi.info/map/bounds/?latlng=${encodeURIComponent(bounds)}&networks=all&token=${encodeURIComponent(safeToken)}`;
          const response = await fetch(waqiMapUrl, { signal });

          if (!response.ok) {
            throw new Error('AQICN endpoint request failed');
          }

          const payload: WaqiMapResponse = await response.json();
          const stations = payload.data ?? [];

          if (payload.status === 'ok' && stations.length > 0) {
            const waqiMarkers = stations
              .map((station, index): AQIMarker | null => {
                const lat = Number(station.lat);
                const lng = Number(station.lon);
                const aqi = parseAqiValue(station.aqi);

                if (!Number.isFinite(lat) || !Number.isFinite(lng) || aqi === null) {
                  return null;
                }

                return {
                  id: `waqi-${station.uid ?? index}`,
                  uid: Number.isFinite(Number(station.uid)) ? Number(station.uid) : null,
                  name: station.station?.name?.trim() || `สถานี AQI ${index + 1}`,
                  lat,
                  lng,
                  aqi,
                  pm25: null,
                  updatedAt: normalizeWaqiTime(station.station?.time),
                  source: 'aqicn',
                };
              })
              .filter((marker): marker is AQIMarker => marker !== null)
              .sort((a, b) => b.aqi - a.aqi);

            if (waqiMarkers.length > 0) {
              const uniqueMarkers = Array.from(new Map(waqiMarkers.map((marker) => [marker.id, marker])).values());
              setAqiMarkers(uniqueMarkers);
              setSelectedAqiMarkerId((prev) => prev || uniqueMarkers[0].id);
              setLastFetchedAt(new Date().toISOString());
              return;
            }
          }
        }

        const air4ThaiResponse = await fetch(AIR4THAI_PROXY_URL, { signal });
        if (air4ThaiResponse.ok) {
          const rawPayload = await air4ThaiResponse.text();
          const parsed = parseJinaWrappedJson<Air4ThaiStationsResponse>(rawPayload);
          const chiangMaiStations = (parsed?.stations ?? []).filter((station) => {
            const lat = toNumber(station.lat);
            const lng = toNumber(station.long);
            const aqi = toNumber(station.AQILast?.PM25?.aqi);
            if (lat === null || lng === null || aqi === null || aqi < 0) {
              return false;
            }

            const isTaggedChiangMai = (station.areaTH ?? '').includes('เชียงใหม่') || (station.nameTH ?? '').includes('เชียงใหม่');
            return isTaggedChiangMai || isInsideCityBounds(lat, lng);
          });

          if (chiangMaiStations.length > 0) {
            const air4ThaiMarkers: AQIMarker[] = chiangMaiStations
              .map((station) => {
                const lat = toNumber(station.lat) ?? 0;
                const lng = toNumber(station.long) ?? 0;
                const aqi = toNumber(station.AQILast?.PM25?.aqi) ?? 0;
                const pm25 = toNumber(station.AQILast?.PM25?.value);
                const dateText = station.AQILast?.date ?? '';
                const timeText = station.AQILast?.time ?? '00:00';

                return {
                  id: station.stationID,
                  uid: null,
                  name: station.nameTH?.trim() || station.areaTH?.trim() || station.stationID,
                  lat,
                  lng,
                  aqi: clampAqi(aqi),
                  pm25,
                  updatedAt: dateText ? `${dateText}T${timeText}:00+07:00` : new Date().toISOString(),
                  source: 'air4thai' as const,
                };
              })
              .sort((a, b) => b.aqi - a.aqi);

            const dedupedMarkers = Array.from(new Map(air4ThaiMarkers.map((marker) => [marker.id, marker])).values());

            setAqiMarkers(dedupedMarkers);
            setSelectedAqiMarkerId((prev) => prev || dedupedMarkers[0].id);
            setAqiError('ไม่พบข้อมูลจาก AQICN ชั่วคราว จึงแสดงข้อมูลสำรองจาก Air4Thai');
            setLastFetchedAt(new Date().toISOString());
            return;
          }
        }

        throw new Error('No AQI stations available');
      } catch {
        const fallbackMarkers: AQIMarker[] = FALLBACK_AQI_POINTS.map((point) => ({
          id: point.id,
          uid: null,
          name: point.name,
          lat: point.lat,
          lng: point.lng,
          aqi: clampAqi(165 + point.offset),
          pm25: null,
          updatedAt: new Date().toISOString(),
          source: 'fallback',
        }));

        setAqiMarkers(fallbackMarkers);
        setSelectedAqiMarkerId((prev) => prev || fallbackMarkers[0].id);
        setAqiError('ไม่สามารถโหลดข้อมูลจริงได้ในขณะนี้ แสดงข้อมูลสำรองชั่วคราว');
        setLastFetchedAt(new Date().toISOString());
      } finally {
        setIsAqiLoading(false);
      }
    },
    [selectedArea.latitude, selectedArea.longitude]
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchAqiData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchAqiData]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void fetchAqiData();
    }, 5 * 60 * 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [fetchAqiData]);

  const selectedAqiMarker =
    aqiMarkers.find((marker) => marker.id === selectedAqiMarkerId) ?? aqiMarkers[0] ?? null;
  const selectedAqiLevel = selectedAqiMarker ? getAqiLevel(selectedAqiMarker.aqi) : null;

  useEffect(() => {
    if (!selectedAqiMarker || selectedAqiMarker.source !== 'aqicn' || !selectedAqiMarker.uid || !WAQI_TOKEN?.trim()) {
      setSelectedAqiDetail(null);
      return;
    }

    const controller = new AbortController();

    const fetchStationDetail = async () => {
      setIsDetailLoading(true);
      try {
        const response = await fetch(
          `https://api.waqi.info/feed/@${selectedAqiMarker.uid}/?token=${encodeURIComponent(WAQI_TOKEN.trim())}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error('Unable to fetch station detail');
        }

        const payload: WaqiFeedResponse = await response.json();
        if (payload.status !== 'ok' || !payload.data) {
          throw new Error('Invalid AQICN station detail payload');
        }

        setSelectedAqiDetail({
          domPol: payload.data.dompol ?? null,
          temperature: Number.isFinite(Number(payload.data.iaqi?.t?.v)) ? Number(payload.data.iaqi?.t?.v) : null,
          humidity: Number.isFinite(Number(payload.data.iaqi?.h?.v)) ? Number(payload.data.iaqi?.h?.v) : null,
          wind: Number.isFinite(Number(payload.data.iaqi?.w?.v)) ? Number(payload.data.iaqi?.w?.v) : null,
          updatedAt: payload.data.time?.iso ?? payload.data.time?.s ?? selectedAqiMarker.updatedAt,
        });
      } catch {
        setSelectedAqiDetail(null);
      } finally {
        setIsDetailLoading(false);
      }
    };

    void fetchStationDetail();

    return () => {
      controller.abort();
    };
  }, [selectedAqiMarker]);

  const lastUpdatedLabel = selectedAqiMarker
    ? formatThaiDateSafe(selectedAqiMarker.updatedAt, {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short',
      })
    : '-';

  const fetchedAtLabel = lastFetchedAt
    ? formatThaiDateSafe(lastFetchedAt, {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  return (
    <div className="h-full flex flex-col">
      <div className={`p-6 border-b ${isDarkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
        <h1 className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>แผนที่เมือง</h1>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {mapMode === 'traffic'
            ? 'แสดงจุดเหตุการณ์และสถานะการจราจร'
            : 'ดัชนีคุณภาพอากาศแบบเรียลไทม์จาก AQICN พร้อมข้อมูลสถานีรายจุด'}
        </p>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <MapContainer center={[selectedArea.latitude, selectedArea.longitude]} zoom={13} className="absolute inset-0 z-0" zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <RecenterMap lat={selectedArea.latitude} lng={selectedArea.longitude} />
          <ZoomControls isDarkMode={isDarkMode} />

          {mapMode === 'traffic' &&
            visibleIncidents.map((incident) => (
              <CircleMarker
                key={incident.id}
                center={[incident.lat, incident.lng]}
                radius={11}
                pathOptions={{
                  color: '#ffffff',
                  weight: 2,
                  fillColor: getIncidentColor(incident.type),
                  fillOpacity: 0.9,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{incident.label}</div>
                    {incident.count ? <div>จำนวนเหตุ: {incident.count}</div> : null}
                  </div>
                </Popup>
              </CircleMarker>
            ))}

          {mapMode === 'aqi' &&
            aqiMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={createAqiMarkerIcon(marker.aqi, marker.id === selectedAqiMarkerId)}
                eventHandlers={{
                  click: () => setSelectedAqiMarkerId(marker.id),
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">{marker.name}</div>
                    <div>AQI: {marker.aqi}</div>
                    {marker.pm25 !== null ? <div>PM2.5: {marker.pm25.toFixed(1)} µg/m³</div> : null}
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        <div className={`absolute top-6 left-6 z-[500] rounded-xl border p-1 backdrop-blur-sm ${isDarkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white/90 border-gray-300'}`}>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMapMode('traffic')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                mapMode === 'traffic'
                  ? 'bg-orange-600 text-white'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-neutral-800'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>จราจร</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('aqi')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                mapMode === 'aqi'
                  ? 'bg-red-600 text-white'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-neutral-800'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>AQI</span>
            </button>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-[500]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (mapMode === 'aqi') {
                  void fetchAqiData();
                }
              }}
              disabled={mapMode !== 'aqi' || isAqiLoading}
              className={`flex items-center gap-2 backdrop-blur-sm border px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-neutral-950/80 border-neutral-800 text-white hover:bg-neutral-900/80' : 'bg-white/90 border-gray-300 text-gray-900 hover:bg-gray-50'}`}
              title="รีเฟรชข้อมูล AQI"
              aria-label="รีเฟรชข้อมูล AQI"
            >
              <RefreshCcw className={`w-4 h-4 ${isAqiLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm">รีเฟรช</span>
            </button>
          </div>
        </div>

        {mapMode === 'traffic' && (
          <div className={`absolute top-24 left-6 z-[500] backdrop-blur-sm rounded-xl p-5 border w-72 ${isDarkMode ? 'bg-neutral-950/85 border-neutral-800' : 'bg-white/90 border-gray-300'}`}>
            <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ตัวกรองเหตุการณ์</h3>
            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={filters.accident} onChange={() => setFilters((prev) => ({ ...prev, accident: !prev.accident }))} />
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>อุบัติเหตุ ({trafficStats.accident})</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={filters.congestion} onChange={() => setFilters((prev) => ({ ...prev, congestion: !prev.congestion }))} />
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>รถติด ({trafficStats.congestion})</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={filters.violation} onChange={() => setFilters((prev) => ({ ...prev, violation: !prev.violation }))} />
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>การฝ่าฝืน ({trafficStats.violation})</span>
              </label>
            </div>
          </div>
        )}

        {mapMode === 'aqi' && selectedAqiMarker && selectedAqiLevel && (
          <div className={`absolute top-24 left-6 z-[500] w-[390px] rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-neutral-950/90 border-neutral-700' : 'bg-white/95 border-gray-300 shadow-xl'}`}>
            <div className={`px-4 py-3 ${selectedAqiLevel.panelClass}`}>
              <div className="text-xl font-bold">AQI {selectedAqiMarker.aqi}</div>
              <div className="text-sm font-medium">{selectedAqiLevel.label}</div>
            </div>
            <div className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="font-semibold">{selectedAqiMarker.name}</div>
              <div className="mt-1">อัปเดต {lastUpdatedLabel}</div>
              <div className="mt-1 text-xs opacity-80">
                แหล่งข้อมูล: {selectedAqiMarker.source === 'aqicn'
                  ? 'AQICN (WAQI Network)'
                  : selectedAqiMarker.source === 'air4thai'
                    ? 'Air4Thai (PCD)'
                    : 'ค่าประมาณชั่วคราว'}
              </div>
              {selectedAqiMarker.pm25 !== null && <div className="mt-1 text-xs opacity-80">PM2.5: {selectedAqiMarker.pm25.toFixed(1)} µg/m³</div>}
              {isDetailLoading ? (
                <div className="mt-2 text-xs opacity-80">กำลังโหลดรายละเอียดสถานี...</div>
              ) : (
                <>
                  {selectedAqiDetail?.domPol && <div className="mt-2 text-xs opacity-85">มลพิษหลัก: {selectedAqiDetail.domPol.toUpperCase()}</div>}
                  <div className="mt-1 flex items-center gap-3 text-xs opacity-85">
                    {selectedAqiDetail?.temperature !== null && selectedAqiDetail?.temperature !== undefined && (
                      <span>อุณหภูมิ {selectedAqiDetail.temperature.toFixed(1)}°C</span>
                    )}
                    {selectedAqiDetail?.humidity !== null && selectedAqiDetail?.humidity !== undefined && (
                      <span>ชื้นสัมพัทธ์ {selectedAqiDetail.humidity.toFixed(0)}%</span>
                    )}
                    {selectedAqiDetail?.wind !== null && selectedAqiDetail?.wind !== undefined && (
                      <span>ลม {selectedAqiDetail.wind.toFixed(1)} m/s</span>
                    )}
                  </div>
                </>
              )}
              <div className="mt-2 text-xs opacity-80">จำนวนสถานีที่พบ: {aqiMarkers.length} จุด</div>
              <div className="mt-1 text-xs opacity-70">อัปเดตข้อมูลล่าสุดเมื่อ {fetchedAtLabel} น.</div>
            </div>
          </div>
        )}

        {mapMode === 'aqi' && aqiError && (
          <div className={`absolute top-[420px] left-6 z-[500] w-[390px] rounded-xl border px-4 py-3 text-xs ${isDarkMode ? 'bg-neutral-950/90 border-neutral-700 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
            {aqiError}
          </div>
        )}

        <div className={`absolute bottom-6 left-6 z-[500] text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} bg-black/35 rounded-md px-3 py-1`}>{selectedArea.label}</div>

        {mapMode === 'aqi' && (
          <div className="absolute bottom-0 left-0 right-0 z-[500]">
            <div className="grid grid-cols-6 text-[11px] font-semibold text-center">
              <div className="bg-[#00e400] text-black py-2">ดี 0-50</div>
              <div className="bg-[#ffff00] text-black py-2">ปานกลาง 51-100</div>
              <div className="bg-[#ff7e00] text-white py-2">เริ่มมีผล 101-150</div>
              <div className="bg-[#ff0000] text-white py-2">มีผล 151-200</div>
              <div className="bg-[#8f3f97] text-white py-2">อันตราย 201-300</div>
              <div className="bg-[#7e0023] text-white py-2">วิกฤต 301+</div>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 right-6 z-[500]">
          <button
            className={`w-10 h-10 backdrop-blur-sm border rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-neutral-950/85 border-neutral-800 hover:bg-neutral-900/85' : 'bg-white/90 border-gray-300 hover:bg-gray-50'}`}
            aria-label="ช่วยเหลือการใช้งานแผนที่"
            title="ช่วยเหลือการใช้งานแผนที่"
          >
            <HelpCircle className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
