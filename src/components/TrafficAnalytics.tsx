import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cameras } from '../data/cameras';
import { generateTrafficData } from '../data/trafficData';

interface TrafficAnalyticsProps {
  selectedCamera: number;
}

const ranges = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
] as const;

export function TrafficAnalytics({ selectedCamera }: TrafficAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'today' | 'week'>('today');
  const camera = cameras.find((c) => c.id === selectedCamera) ?? cameras[0];
  const trafficData = generateTrafficData(selectedCamera);

  const totalVehicles = trafficData.reduce((sum, point) => sum + point.vehicles, 0);
  const avgPerHour = Math.floor(totalVehicles / trafficData.length);
  const peakHour = trafficData.reduce((max, point) => (point.vehicles > max.vehicles ? point : max));

  const stats = [
    { label: 'Total vehicles', value: totalVehicles.toLocaleString(), note: 'Last 24 hours' },
    { label: 'Average per hour', value: avgPerHour.toLocaleString(), note: 'All day' },
    { label: 'Peak hour', value: peakHour.hour, note: `${peakHour.vehicles.toLocaleString()} vehicles` },
  ];

  return (
    <section>
      <header className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-base font-light tracking-tight text-neutral-900">Traffic volume</h2>
          <p className="text-xs text-neutral-400 mt-1">{camera.name}</p>
        </div>

        <div className="flex items-center gap-5">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setTimeRange(r.key)}
              className={`pb-1 text-xs border-b transition-colors ${
                timeRange === r.key
                  ? 'text-neutral-900 border-neutral-900'
                  : 'text-neutral-400 border-transparent hover:text-neutral-600'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      <dl className="grid grid-cols-3 mb-8">
        {stats.map((s, i) => (
          <div key={s.label} className={`${i > 0 ? 'pl-8 border-l border-neutral-200/80' : ''}`}>
            <dt className="text-xs text-neutral-400">{s.label}</dt>
            <dd className="mt-2 text-3xl font-extralight tracking-tight tabular-nums text-neutral-900">
              {s.value}
            </dd>
            <p className="text-xs text-neutral-400 mt-1">{s.note}</p>
          </div>
        ))}
      </dl>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={trafficData} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="#e8e8e4" />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 11, fill: '#a3a3a3' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} width={36} />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            contentStyle={{
              background: '#fff',
              border: '1px solid #e8e8e4',
              borderRadius: 8,
              boxShadow: 'none',
              fontSize: 12,
            }}
          />
          <Bar dataKey="vehicles" radius={[2, 2, 0, 0]}>
            {trafficData.map((point) => (
              <Cell key={point.hour} fill={point.hour === peakHour.hour ? '#171717' : '#d6d6d1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
