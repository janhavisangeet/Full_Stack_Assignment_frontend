'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
  checked?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, onSelect, align = 'left' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={() => setOpen((v) => !v)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            [align === 'right' ? 'right' : 'left']: 0,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: 'var(--shadow-lg)',
            minWidth: 160,
            zIndex: 500,
            overflow: 'hidden',
          }}
          className="animate-slide-down"
        >
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => { onSelect(item.value); setOpen(false); }}
              style={{
                width: '100%',
                padding: '8px 14px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: item.color || 'var(--text-primary)',
                textAlign: 'left',
                transition: 'background 0.1s',
                fontFamily: 'inherit',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
            >
              {item.icon && <span style={{ flexShrink: 0 }}>{item.icon}</span>}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.checked && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
