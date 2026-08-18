import React, { useState, useRef, useEffect } from 'react';
import { ViewMode } from '@/types';
import { useFields, FieldsState } from '@/lib/fields-context';

interface FieldsDropdownProps {
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean;
}

export function FieldsDropdown({ viewMode, onViewModeChange, showViewToggle }: FieldsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { visibleFields, toggleField } = useFields();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 6,
          cursor: 'pointer', fontSize: 13, fontWeight: 500,
          color: 'var(--text-primary)', fontFamily: 'inherit',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
        Fields
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 8,
            width: 240, background: 'var(--card)', borderRadius: 8,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            border: '1px solid var(--border)', zIndex: 100,
            padding: 8,
          }}
          className="animate-fade-in"
        >
          {showViewToggle && onViewModeChange && (
            <div style={{ display: 'flex', background: 'var(--background)', borderRadius: 6, padding: 4, marginBottom: 8 }}>
              {(['list', 'board'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  style={{
                    flex: 1, padding: '6px 0', border: 'none', borderRadius: 4,
                    background: viewMode === mode ? 'var(--card)' : 'transparent',
                    boxShadow: viewMode === mode ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  {mode === 'list' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  )}
                  <span style={{ textTransform: 'capitalize' }}>{mode}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { key: 'priority', label: 'Priority' },
              { key: 'members', label: 'Members' },
              { key: 'dueDate', label: 'Due Date' },
              { key: 'labels', label: 'Labels' },
              { key: 'status', label: 'Status' },
              { key: 'reporter', label: 'Reporter' },
            ].map((f) => {
              const isActive = visibleFields[f.key as keyof FieldsState];
              return (
                <button
                  key={f.key}
                  onClick={() => toggleField(f.key as keyof FieldsState)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', background: 'none', border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: 'var(--text-primary)',
                    borderRadius: 4,
                  }}
                  className="hover:bg-[var(--sidebar-item-hover)]"
                >
                  {f.label}
                  {isActive ? (
                    <div style={{ width: 16, height: 16, background: '#111', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : (
                    <div style={{ width: 16, height: 16, background: 'var(--border-light)', borderRadius: 4 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
