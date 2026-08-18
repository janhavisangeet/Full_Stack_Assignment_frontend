'use client';

import React from 'react';
import { TaskPriority, PRIORITY_LABELS } from '@/types';
import { priorityColors } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: TaskPriority;
  showLabel?: boolean;
}

const PRIORITY_ICONS: Record<TaskPriority, React.ReactNode> = {
  urgent: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  high: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  medium: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  low: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  no_priority: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
  ),
};

export function PriorityBadge({ priority, showLabel = true }: PriorityBadgeProps) {
  const colors = priorityColors[priority];
  return (
    <span
      className="badge"
      style={{
        color: colors.dot,
        background: 'transparent',
        padding: showLabel ? '2px 0' : '2px',
        gap: 4,
      }}
    >
      <span style={{ color: colors.dot, display: 'flex', alignItems: 'center' }}>
        {PRIORITY_ICONS[priority]}
      </span>
      {showLabel && (
        <span style={{ fontSize: 12, fontWeight: 500, color: colors.dot }}>
          {PRIORITY_LABELS[priority]}
        </span>
      )}
    </span>
  );
}
