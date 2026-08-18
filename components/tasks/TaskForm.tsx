'use client';

import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus, STATUS_LABELS, PRIORITY_LABELS, LABEL_OPTIONS, CreateTaskPayload } from '@/types';
import { Button } from '@/components/ui/Button';
import { toInputDate } from '@/lib/utils';

interface TaskFormProps {
  initialData?: Partial<Task>;
  defaultStatus?: TaskStatus;
  onSubmit: (data: CreateTaskPayload) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const PRIORITIES: TaskPriority[] = ['no_priority', 'urgent', 'high', 'medium', 'low'];
const STATUSES: TaskStatus[] = ['todo', 'doing', 'completed', 'on_hold'];

export function TaskForm({ initialData, defaultStatus = 'todo', onSubmit, onCancel, isEditing }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'no_priority');
  const [dueDate, setDueDate] = useState(toInputDate(initialData?.dueDate) || '');
  const [assignee, setAssignee] = useState(initialData?.assignee || '');
  const [labels, setLabels] = useState<string[]>(initialData?.labels || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLabel = (label: string) =>
    setLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    setError(null);
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
        assignee: assignee.trim() || undefined,
        labels,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    fontSize: 13,
    border: '1px solid var(--border)',
    borderRadius: 6,
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: 4,
    display: 'block',
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6,
          padding: '8px 12px', marginBottom: 14, fontSize: 13, color: '#dc2626',
        }}>
          {error}
        </div>
      )}

      {/* Title */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="task-title" style={labelStyle}>Title *</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          required
          maxLength={200}
          style={fieldStyle}
          autoFocus
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="task-desc" style={labelStyle}>Description</label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description..."
          rows={3}
          style={{ ...fieldStyle, resize: 'vertical' }}
        />
      </div>

      {/* Status + Priority row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label htmlFor="task-status" style={labelStyle}>Status</label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            style={fieldStyle}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="task-priority" style={labelStyle}>Priority</label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            style={fieldStyle}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date + Assignee row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div>
          <label htmlFor="task-due" style={labelStyle}>Due Date</label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={fieldStyle}
          />
        </div>
        <div>
          <label htmlFor="task-assignee" style={labelStyle}>Assignee</label>
          <input
            id="task-assignee"
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Name or initials"
            style={fieldStyle}
          />
        </div>
      </div>

      {/* Labels */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Labels</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {LABEL_OPTIONS.map((label) => {
            const selected = labels.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleLabel(label)}
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 4,
                  border: selected ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: selected ? 'var(--accent-light)' : 'transparent',
                  color: selected ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: selected ? 600 : 400,
                  transition: 'all 0.1s',
                  fontFamily: 'inherit',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
