import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';

export interface FilterOption {
  key: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  value: string;
  options: FilterOption[];
  onChange: (key: string) => void;
  ariaLabel: string;
}

export function FilterDropdown({ value, options, onChange, ariaLabel }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedIndex = Math.max(0, options.findIndex((o) => o.key === value));
  const selected = options[selectedIndex];

  const openMenu = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (key: string) => {
    onChange(key);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(options[active].key);
        break;
      case 'Escape':
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className="group flex items-center gap-2 py-1 text-sm text-neutral-900 focus:outline-none"
      >
        <span className="border-b border-transparent group-hover:border-neutral-300 group-focus-visible:border-neutral-900 transition-colors">
          {selected.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            style={{ transformOrigin: 'top left' }}
            className="absolute left-0 top-full mt-2 z-30 w-64 p-1.5 rounded-xl bg-white ring-1 ring-black/5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)]"
          >
            {options.map((o, i) => {
              const isSelected = o.key === value;
              return (
                <li
                  key={o.key}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(o.key)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    active === i ? 'bg-neutral-100' : ''
                  } ${isSelected ? 'text-neutral-900' : 'text-neutral-500'}`}
                >
                  <span className="flex-1">{o.label}</span>
                  {o.count !== undefined && (
                    <span className="text-xs tabular-nums text-neutral-400">{o.count}</span>
                  )}
                  <Check
                    className={`w-3.5 h-3.5 text-neutral-900 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                    strokeWidth={2}
                  />
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
