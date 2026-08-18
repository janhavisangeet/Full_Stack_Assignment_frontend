'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus, STATUS_LABELS, PRIORITY_LABELS, UpdateTaskPayload } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Button } from '@/components/ui/Button';
import { formatDate, statusColors, toInputDate } from '@/lib/utils';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const PRIORITIES: TaskPriority[] = ['no_priority', 'urgent', 'high', 'medium', 'low'];
const STATUSES: TaskStatus[] = ['todo', 'doing', 'completed', 'on_hold'];

export function TaskDetail({ task, onClose, onUpdate, onDelete }: TaskDetailProps) {
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleting, setDeleting] = useState(false);

  const sc = statusColors[task.status];

  const handlePriorityChange = async (priority: TaskPriority) => {
    setPriorityOpen(false);
    await onUpdate(task._id, { priority });
  };

  const handleStatusChange = async (status: TaskStatus) => {
    setStatusOpen(false);
    await onUpdate(task._id, { status });
  };

  const startEdit = (field: string, value: string) => {
    setEditing(field);
    setEditValue(value);
  };

  const saveEdit = async (field: string) => {
    if (field === 'title' && !editValue.trim()) return;
    await onUpdate(task._id, { [field]: editValue.trim() || undefined } as UpdateTaskPayload);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await onDelete(task._id);
  };

  const handleDueDateChange = async (date: string) => {
    await onUpdate(task._id, { dueDate: date || undefined });
  };

  return (
    <div
      style={{
        width: 400,
        minWidth: 340,
        borderLeft: '1px solid var(--border)',
        background: 'var(--card)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
      className="animate-slide-right md-w-full md-border-none"
    >
      {/* Header icons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <button
          onClick={() => handleDelete()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 6, borderRadius: 4, display: 'flex', alignItems: 'center' }}
          title="Delete task"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
          </svg>
        </button>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 4, display: 'flex', alignItems: 'center' }}
          aria-label="Close detail panel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
        {/* Title */}
        {editing === 'title' ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveEdit('title')}
            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit('title'); if (e.key === 'Escape') setEditing(null); }}
            style={{
              width: '100%',
              fontSize: 18,
              fontWeight: 700,
              border: '2px solid var(--accent)',
              borderRadius: 6,
              padding: '4px 8px',
              background: 'var(--input-bg)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'inherit',
              marginBottom: 8,
            }}
          />
        ) : (
          <h2
            onClick={() => startEdit('title', task.title)}
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 8px',
              cursor: 'text',
              lineHeight: 1.3,
              borderRadius: 4,
              padding: '2px',
            }}
            title="Click to edit title"
          >
            {task.title}
          </h2>
        )}

        {/* Description */}
        {editing === 'description' ? (
          <textarea
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => saveEdit('description')}
            rows={3}
            style={{
              width: '100%',
              fontSize: 13,
              border: '2px solid var(--accent)',
              borderRadius: 6,
              padding: '6px 8px',
              background: 'var(--input-bg)',
              color: 'var(--text-secondary)',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              marginBottom: 20,
            }}
          />
        ) : (
          <p
            onClick={() => startEdit('description', task.description || '')}
            style={{
              fontSize: 13,
              color: task.description ? 'var(--text-secondary)' : 'var(--text-muted)',
              marginBottom: 20,
              cursor: 'text',
              lineHeight: 1.5,
              borderRadius: 4,
              padding: '2px',
            }}
            title="Click to edit description"
          >
            {task.description || 'Add a description...'}
          </p>
        )}

        {/* Properties section */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Properties
          </p>

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', position: 'relative' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 90 }}>Status</span>
            <button
              onClick={() => { setStatusOpen((v) => !v); setPriorityOpen(false); }}
              style={{
                background: sc.bg, color: sc.text.replace('text-', ''),
                border: 'none', borderRadius: 4, padding: '3px 8px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {STATUS_LABELS[task.status]}
            </button>
            {statusOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%',
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 8, boxShadow: 'var(--shadow-lg)',
                zIndex: 200, minWidth: 140, overflow: 'hidden',
              }} className="animate-slide-down">
                {STATUSES.map((s) => (
                  <button key={s} onClick={() => handleStatusChange(s)}
                    style={{
                      width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: 12, color: 'var(--text-primary)',
                      textAlign: 'left', fontFamily: 'inherit',
                      fontWeight: task.status === s ? 600 : 400,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    {STATUS_LABELS[s]} {task.status === s && '✓'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', position: 'relative' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 90 }}>Priority</span>
            <button
              onClick={() => { setPriorityOpen((v) => !v); setStatusOpen(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', fontFamily: 'inherit' }}
            >
              <PriorityBadge priority={task.priority} />
            </button>
            {priorityOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%',
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 8, boxShadow: 'var(--shadow-lg)',
                zIndex: 200, minWidth: 160, overflow: 'hidden',
              }} className="animate-slide-down">
                {PRIORITIES.map((p) => (
                  <button key={p} onClick={() => handlePriorityChange(p)}
                    style={{
                      width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: 12, color: 'var(--text-primary)',
                      textAlign: 'left', fontFamily: 'inherit',
                      fontWeight: task.priority === p ? 600 : 400,
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    {PRIORITY_LABELS[p]} {task.priority === p && '✓'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Assignee */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 90 }}>Members</span>
            {editing === 'assignee' ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit('assignee')}
                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit('assignee'); if (e.key === 'Escape') setEditing(null); }}
                style={{
                  fontSize: 12, border: '1px solid var(--accent)', borderRadius: 4,
                  padding: '4px 8px', background: 'var(--input-bg)', color: 'var(--text-primary)',
                  outline: 'none', fontFamily: 'inherit', width: 130,
                }}
              />
            ) : (
              <button
                onClick={() => startEdit('assignee', task.assignee || '')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}
              >
                {task.assignee ? (
                  <><Avatar name={task.assignee} size={22} /><span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{task.assignee}</span></>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>+ Add member</span>
                )}
              </button>
            )}
          </div>

          {/* Due Date */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', width: 90 }}>Dates</span>
            <input
              type="date"
              value={toInputDate(task.dueDate)}
              onChange={(e) => handleDueDateChange(e.target.value)}
              style={{
                fontSize: 12, border: '1px solid var(--border)', borderRadius: 4,
                padding: '4px 8px', background: 'var(--input-bg)', color: 'var(--text-primary)',
                outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
              }}
            />
          </div>
        </div>

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Labels
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {task.labels.map((label) => (
                <span
                  key={label}
                  style={{
                    fontSize: 11, padding: '3px 8px', borderRadius: 4,
                    border: '1px solid var(--border)', background: 'var(--background)',
                    color: 'var(--text-secondary)', fontWeight: 500,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 4px' }}>
            Created: {formatDate(task.createdAt)}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
            Updated: {formatDate(task.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
