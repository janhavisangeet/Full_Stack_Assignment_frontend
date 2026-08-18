import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, STATUS_LABELS, PRIORITY_LABELS } from '@/types';

interface TaskContextMenuProps {
  task: Task;
  onClose: () => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onPriorityChange?: (id: string, priority: TaskPriority) => void;
  onDelete?: (id: string) => void;
}

export function TaskContextMenu({ task, onClose, onStatusChange, onPriorityChange, onDelete }: TaskContextMenuProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const menuItems = [
    { id: 'status', label: 'Status' },
    { id: 'priority', label: 'Priority' },
    { id: 'members', label: 'Members' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'teams', label: 'Teams' },
    { id: 'labels', label: 'Labels' },
    { id: 'reporter', label: 'Reporter' },
  ];

  return (
    <div
      style={{
        position: 'absolute', right: 0, top: '100%', marginTop: 4,
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 8, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        zIndex: 200, width: 180, padding: 4,
      }}
      className="animate-slide-down"
      onMouseLeave={() => setActiveSubmenu(null)}
    >
      {menuItems.map((item) => (
        <div
          key={item.id}
          style={{ position: 'relative' }}
          onMouseEnter={() => setActiveSubmenu(item.id)}
        >
          <button
            style={{
              width: '100%', padding: '8px 12px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)',
              textAlign: 'left', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderRadius: 4,
            }}
            className="hover:bg-[var(--sidebar-item-hover)]"
          >
            {item.label}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Submenus */}
          {activeSubmenu === item.id && (
            <div
              style={{
                position: 'absolute', right: '100%', top: 0, marginRight: 4,
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 8, boxShadow: 'var(--shadow-lg)',
                zIndex: 201, width: 160, padding: 4,
              }}
              className="animate-fade-in"
            >
              {item.id === 'status' && (
                <>
                  {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => { onStatusChange?.(task._id, s); onClose(); }}
                      style={{
                        width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)',
                        textAlign: 'left', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}
                      className="hover:bg-[var(--sidebar-item-hover)]"
                    >
                      {STATUS_LABELS[s]}
                      {task.status === s && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>}
                    </button>
                  ))}
                </>
              )}
              {item.id === 'priority' && (
                <>
                  {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => { onPriorityChange?.(task._id, p); onClose(); }}
                      style={{
                        width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)',
                        textAlign: 'left', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}
                      className="hover:bg-[var(--sidebar-item-hover)]"
                    >
                      {PRIORITY_LABELS[p]}
                      {task.priority === p && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>}
                    </button>
                  ))}
                </>
              )}
              {/* Other submenus placeholder */}
              {['members', 'dueDate', 'teams', 'labels', 'reporter'].includes(item.id) && (
                <div style={{ padding: '8px 12px', fontSize: 13, color: 'var(--text-muted)' }}>
                  Coming soon...
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
      <button
        onClick={() => { onDelete?.(task._id); onClose(); }}
        style={{
          width: '100%', padding: '8px 12px', background: 'none', border: 'none',
          cursor: 'pointer', fontSize: 13, color: '#ef4444',
          textAlign: 'left', fontFamily: 'inherit', borderRadius: 4,
        }}
        className="hover:bg-[#fef2f2]"
      >
        Delete Task
      </button>
    </div>
  );
}
