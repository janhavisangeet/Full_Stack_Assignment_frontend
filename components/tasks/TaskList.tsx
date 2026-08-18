'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, STATUS_LABELS } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { formatDate, isOverdue } from '@/lib/utils';
import { TaskContextMenu } from './TaskContextMenu';
import { useFields, FieldsState } from '@/lib/fields-context';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const STATUS_ORDER: TaskStatus[] = ['todo', 'doing', 'completed', 'on_hold'];

export function TaskList({ tasks, onTaskClick, onAddTask, onDeleteTask, onStatusChange }: TaskListProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const { visibleFields } = useFields();

  const tasksByStatus = STATUS_ORDER.reduce<Record<TaskStatus, Task[]>>(
    (acc, s) => { acc[s] = tasks.filter((t) => t.status === s); return acc; },
    { todo: [], doing: [], completed: [], on_hold: [] },
  );

  const toggleGroup = (status: string) =>
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));

  // Dynamically calculate grid layout columns based on visibleFields
  let gridColumns = '1fr';
  if (visibleFields.priority) gridColumns += ' 130px';
  if (visibleFields.members) gridColumns += ' 110px';
  if (visibleFields.dueDate) gridColumns += ' 130px';
  gridColumns += ' 60px'; // Actions always visible

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
      <div style={{ minWidth: 700 }}>


      {STATUS_ORDER.map((status) => {
        const groupTasks = tasksByStatus[status];
        if (groupTasks.length === 0 && status !== 'todo') return null;
        const isCollapsed = collapsed[status];

        return (
          <div key={status} style={{ marginBottom: 16 }}>
            {/* Group header */}
            <button
              onClick={() => toggleGroup(status)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 4px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                width: '100%', textAlign: 'left', fontFamily: 'inherit',
                borderRadius: 4, marginBottom: 8,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform 0.15s' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
              {STATUS_LABELS[status]}
            </button>

            {/* Column sub-header */}
            {!isCollapsed && groupTasks.length > 0 && (
              <div
                style={{
                  display: 'grid', gridTemplateColumns: gridColumns,
                  padding: '8px 12px', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)',
                  background: 'var(--card-hover)', borderRadius: '8px 8px 0 0',
                  border: '1px solid var(--border)', borderBottom: 'none',
                }}
              >
                <span>Task</span>
                {visibleFields.priority && <span>Priority</span>}
                {visibleFields.members && <span>Members</span>}
                {visibleFields.dueDate && <span>Due Date</span>}
                <span>Actions</span>
              </div>
            )}

            {/* Rows */}
            {!isCollapsed && (
              <>
                {groupTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate);
                  return (
                    <div
                      key={task._id}
                      style={{
                        display: 'grid', gridTemplateColumns: gridColumns,
                        padding: '12px', alignItems: 'center',
                        borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
                        background: 'var(--card)', cursor: 'pointer', transition: 'background 0.1s',
                      }}
                      onClick={() => onTaskClick(task)}
                      onMouseOver={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-item-hover)'}
                      onMouseOut={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--card)'}
                    >
                      {/* Task name */}
                      <span
                        style={{
                          fontSize: 13,
                          color: 'var(--text-primary)',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          paddingRight: 12,
                        }}
                      >
                        {task.title}
                      </span>
                      {/* Priority */}
                      {visibleFields.priority && (
                        <span onClick={(e) => e.stopPropagation()}>
                          <PriorityBadge priority={task.priority} />
                        </span>
                      )}
                      {/* Members */}
                      {visibleFields.members && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {task.assignee ? (
                            <Avatar name={task.assignee} size={22} />
                          ) : (
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>
                          )}
                        </span>
                      )}
                      {/* Due date */}
                      {visibleFields.dueDate && (
                        <span
                          style={{
                            fontSize: 12,
                            color: overdue && task.status !== 'completed' ? '#ef4444' : 'var(--text-secondary)',
                            fontWeight: overdue && task.status !== 'completed' ? 600 : 400,
                          }}
                        >
                          {task.dueDate ? formatDate(task.dueDate) : '—'}
                        </span>
                      )}
                      {/* Actions */}
                      <span
                        style={{ position: 'relative' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setMenuOpen(menuOpen === task._id ? null : task._id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-muted)', padding: '4px 8px', borderRadius: 4,
                            fontSize: 16, fontFamily: 'inherit',
                          }}
                          aria-label="Task actions"
                        >
                          ···
                        </button>
                        {menuOpen === task._id && (
                          <TaskContextMenu
                            task={task}
                            onClose={() => setMenuOpen(null)}
                            onStatusChange={onStatusChange}
                            onDelete={onDeleteTask}
                          />
                        )}
                      </span>
                    </div>
                  );
                })}

                {/* Add task row */}
                <button
                  onClick={() => { onAddTask(status); setMenuOpen(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                    padding: '12px', background: 'var(--card)', border: '1px solid var(--border)',
                    borderTop: 'none', borderRadius: '0 0 8px 8px', cursor: 'pointer',
                    fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: 'inherit',
                  }}
                  onMouseOver={(e) => { (e.currentTarget).style.color = 'var(--text-secondary)'; }}
                  onMouseOut={(e) => { (e.currentTarget).style.color = 'var(--text-muted)'; }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Task
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
}
