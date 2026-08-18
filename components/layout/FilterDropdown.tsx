import React, { useState, useRef, useEffect } from 'react';
import { TaskPriority, TaskStatus, PRIORITY_LABELS, STATUS_LABELS } from '@/types';

interface FilterDropdownProps {
  selectedPriority: string | null;
  onPriorityChange: (p: string | null) => void;
  selectedStatus?: string | null;
  onStatusChange?: (s: string | null) => void;
}

export function FilterDropdown({
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const hasActiveFilters = selectedPriority !== null || (selectedStatus !== undefined && selectedStatus !== null);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, 
          background: hasActiveFilters ? 'var(--accent)' : 'var(--card)', 
          border: '1px solid var(--border)',
          borderRadius: 6, cursor: 'pointer', 
          color: hasActiveFilters ? 'white' : 'var(--text-primary)',
          transition: 'all 0.2s',
        }}
        aria-label="Filter"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 8,
            width: 200, background: 'var(--card)', borderRadius: 8,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            border: '1px solid var(--border)', zIndex: 100,
            padding: '12px',
          }}
          className="animate-fade-in"
        >
          {/* Priority Filter */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Priority
            </span>
            <select
              value={selectedPriority || 'all'}
              onChange={(e) => {
                const val = e.target.value;
                onPriorityChange(val === 'all' ? null : val);
              }}
              style={{
                width: '100%', padding: '6px 8px', fontSize: 12,
                border: '1px solid var(--border)', borderRadius: 4,
                background: 'var(--background)', color: 'var(--text-primary)',
                outline: 'none', fontFamily: 'inherit'
              }}
            >
              <option value="all">All Priorities</option>
              {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter (if provided) */}
          {onStatusChange !== undefined && (
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Status
              </span>
              <select
                value={selectedStatus || 'all'}
                onChange={(e) => {
                  const val = e.target.value;
                  onStatusChange(val === 'all' ? null : val);
                }}
                style={{
                  width: '100%', padding: '6px 8px', fontSize: 12,
                  border: '1px solid var(--border)', borderRadius: 4,
                  background: 'var(--background)', color: 'var(--text-primary)',
                  outline: 'none', fontFamily: 'inherit'
                }}
              >
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                onPriorityChange(null);
                if (onStatusChange) onStatusChange(null);
                setIsOpen(false);
              }}
              style={{
                width: '100%', padding: '6px 0', fontSize: 11, fontWeight: 600,
                color: 'var(--accent)', background: 'none', border: 'none',
                cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit',
                textAlign: 'center', marginTop: 4
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
