import { cameras, type Camera } from '../data/cameras';

interface CameraListProps {
  selectedCamera: number;
  onSelectCamera: (id: number) => void;
}

function Group({
  label,
  items,
  selectedCamera,
  onSelectCamera,
}: {
  label: string;
  items: Camera[];
  selectedCamera: number;
  onSelectCamera: (id: number) => void;
}) {
  return (
    <section className="pb-4">
      <h3 className="px-6 pt-4 pb-2 text-[11px] uppercase tracking-[0.14em] text-neutral-400">
        {label} <span className="ml-1 tabular-nums">{items.length}</span>
      </h3>
      {items.map((camera) => {
        const active = selectedCamera === camera.id;
        const live = camera.status === 'live';
        return (
          <button
            key={camera.id}
            onClick={() => onSelectCamera(camera.id)}
            className={`group relative w-full text-left pl-6 pr-4 py-2.5 flex items-center gap-3 transition-colors ${
              active ? 'bg-white' : 'hover:bg-white/60'
            }`}
          >
            <span
              className={`absolute left-0 top-2 bottom-2 w-[2px] rounded-full transition-opacity ${
                active ? 'bg-neutral-900 opacity-100' : 'opacity-0'
              }`}
            />
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${live ? 'bg-emerald-500' : 'bg-neutral-300'}`}
            />
            <span className="min-w-0">
              <span
                className={`block truncate text-[13px] leading-snug ${
                  active ? 'text-neutral-900' : live ? 'text-neutral-600' : 'text-neutral-400'
                }`}
              >
                {camera.name}
              </span>
              <span className="block truncate text-[11px] text-neutral-400">{camera.location}</span>
            </span>
          </button>
        );
      })}
    </section>
  );
}

export function CameraList({ selectedCamera, onSelectCamera }: CameraListProps) {
  const live = cameras.filter((c) => c.status === 'live');
  const offline = cameras.filter((c) => c.status !== 'live');

  return (
    <aside className="w-64 shrink-0 bg-[#fafaf8] border-r border-neutral-200/70 flex flex-col">
      <header className="px-6 pt-7 pb-3">
        <h2 className="text-base font-light tracking-tight text-neutral-900">Cameras</h2>
      </header>

      <div className="flex-1 overflow-y-auto">
        <Group label="Live" items={live} selectedCamera={selectedCamera} onSelectCamera={onSelectCamera} />
        <Group label="Offline" items={offline} selectedCamera={selectedCamera} onSelectCamera={onSelectCamera} />
      </div>
    </aside>
  );
}
