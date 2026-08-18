'use client';

import React from 'react';
import { Task, TaskStatus, STATUS_LABELS } from '@/types';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

const COLUMN_ORDER: TaskStatus[] = ['todo', 'doing', 'completed', 'on_hold'];

const COLUMN_COLORS: Record<TaskStatus, string> = {
  todo: '#6366f1',
  doing: '#f59e0b',
  completed: '#10b981',
  on_hold: '#9ca3af',
};

export function TaskBoard({ tasks, onTaskClick, onAddTask }: TaskBoardProps) {
  const tasksByStatus = COLUMN_ORDER.reduce<Record<TaskStatus, Task[]>>(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status);
      return acc;
    },
    { todo: [], doing: [], completed: [], on_hold: [] },
  );

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '20px 24px',
        overflowX: 'auto',
        flex: 1,
        alignItems: 'flex-start',
      }}
    >
      {COLUMN_ORDER.map((status) => {
        const columnTasks = tasksByStatus[status];
        const color = COLUMN_COLORS[status];
        return (
          <div
            key={status}
            style={{
              minWidth: 260,
              width: 260,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Column header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
                padding: '0 2px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                  <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                  <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                </svg>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {STATUS_LABELS[status]}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={() => onAddTask(status)}
                  title={`Add task to ${STATUS_LABELS[status]}`}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 4, borderRadius: 4,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <button
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 4, borderRadius: 4,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Task cards */}
            <div style={{ flex: 1 }}>
              {columnTasks.length === 0 ? (
                <div
                  style={{
                    border: '2px dashed var(--border)',
                    borderRadius: 8,
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: 12,
                  }}
                >
                  No tasks
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onClick={onTaskClick} />
                ))
              )}
            </div>

            {/* Add task link */}
            <button
              onClick={() => onAddTask(status)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: 12,
                padding: '8px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'inherit',
                marginTop: 4,
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Task
            </button>
          </div>
        );
      })}
    </div>
  );
}
