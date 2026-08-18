import React from 'react';
import { Task } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { formatDate, isOverdue } from '@/lib/utils';
import { useFields } from '@/lib/fields-context';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate);
  const { visibleFields } = useFields();

  const showMiddleRow = visibleFields.members || visibleFields.dueDate || visibleFields.priority;

  return (
    <div
      onClick={() => onClick(task)}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '12px',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s ease, transform 0.1s ease',
        marginBottom: 8,
      }}
      className="card-hover animate-fade-in"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(task)}
      aria-label={`Task: ${task.title}`}
    >
      {/* Task title and Actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.4,
            paddingRight: 8,
          }}
          className="truncate-2"
        >
          {task.title}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); /* TODO: quick edit menu */ }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="5" cy="12" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
          </svg>
        </button>
      </div>

      {/* Middle row: Assignee, Priority & Due Date */}
      {showMiddleRow && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {visibleFields.members && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {task.assignee ? (
                  <>
                    <Avatar name={task.assignee} size={20} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{task.assignee}</span>
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Unassigned</span>
                )}
              </div>
            )}
            
            {visibleFields.priority && (
              <PriorityBadge priority={task.priority} />
            )}
          </div>

          {visibleFields.dueDate && task.dueDate && (
            <span
              style={{
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
                color: overdue ? '#ef4444' : '#ef4444',
                background: overdue ? '#fef2f2' : '#fef2f2',
                padding: '2px 6px', borderRadius: 4,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      )}

      {/* Bottom row: Labels */}
      {visibleFields.labels && task.labels && task.labels.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {task.labels.slice(0, 3).map((label) => (
            <span
              key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11, padding: '3px 8px', borderRadius: 12,
                background: 'var(--background)', color: 'var(--text-primary)',
                fontWeight: 500,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              {label}
            </span>
          ))}
          {task.labels.length > 3 && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '2px 0' }}>
              +{task.labels.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
