import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ViewMode } from '@/types';
import { useSidebar } from '@/lib/sidebar-context';
import { FieldsDropdown } from './FieldsDropdown';
import { FilterDropdown } from './FilterDropdown';

interface HeaderProps {
  title: string;
  onAddTask?: () => void;
  addLabel?: string;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  breadcrumb?: string[];
  selectedPriority?: string | null;
  onPriorityChange?: (p: string | null) => void;
  selectedStatus?: string | null;
  onStatusChange?: (s: string | null) => void;
}

export function Header({
  title,
  onAddTask,
  addLabel = 'Add Task',
  viewMode,
  onViewModeChange,
  showViewToggle = false,
  searchValue = '',
  onSearchChange,
  breadcrumb,
  selectedPriority = null,
  onPriorityChange,
  selectedStatus = null,
  onStatusChange,
}: HeaderProps) {
  const { setMobileOpen } = useSidebar();
  const [isSearching, setIsSearching] = useState(!!searchValue);

  return (
    <header
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--card)',
        minHeight: 70,
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      {/* Left: Hamburger + Title / Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hamburger Menu (Mobile Only) */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:block hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: 0, display: 'flex' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {breadcrumb ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: i === breadcrumb.length - 1 ? 600 : 400,
                    color: i === breadcrumb.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{title}</h1>
        )}
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          {isSearching && onSearchChange !== undefined && (
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              style={{
                padding: '6px 12px',
                fontSize: 13,
                border: '1px solid var(--border)',
                borderRadius: 6,
                background: 'var(--background)',
                color: 'var(--text-primary)',
                outline: 'none',
                width: 180,
                fontFamily: 'inherit',
                marginRight: 4,
              }}
              autoFocus
            />
          )}
          <button
            onClick={() => {
              if (isSearching && onSearchChange) {
                onSearchChange(''); // Reset search when closing
              }
              setIsSearching(!isSearching);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', color: 'var(--text-primary)' }}
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>

        {/* Fields + View toggle */}
        <FieldsDropdown viewMode={viewMode} onViewModeChange={onViewModeChange} showViewToggle={showViewToggle} />

        {/* Filter button */}
        {onPriorityChange && (
          <FilterDropdown
            selectedPriority={selectedPriority}
            onPriorityChange={onPriorityChange}
            selectedStatus={selectedStatus}
            onStatusChange={onStatusChange}
          />
        )}

        {/* Add button */}
        {onAddTask && (
          <Button
            id="btn-add-task"
            variant="primary"
            size="sm"
            onClick={onAddTask}
            style={{ gap: 4 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {addLabel}
          </Button>
        )}
      </div>
    </header>
  );
}
