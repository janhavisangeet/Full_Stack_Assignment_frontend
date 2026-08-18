'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Task, TaskStatus, TaskPriority, STATUS_LABELS, PRIORITY_LABELS, LABEL_OPTIONS } from '@/types';
import { tasksApi } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        // Note: this api call might not exist yet, we'll need to make sure the backend supports getById
        // Assuming tasksApi.getById(id) exists, or we fetch all and find it.
        // Let's implement a fallback if getById doesn't exist.
        let data;
        if ((tasksApi as any).getById) {
            data = await (tasksApi as any).getById(id);
        } else {
            const allTasks = await tasksApi.getAll();
            data = allTasks.find(t => t._id === id);
            if (!data) throw new Error('Task not found');
        }
        setTask(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTask();
  }, [id]);

  if (loading) return <div style={{ padding: 24, color: 'var(--text-muted)' }}>Loading task...</div>;
  if (error || !task) return <div style={{ padding: 24, color: '#ef4444' }}>{error || 'Task not found'}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--background)' }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--card)'
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{task.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ background: 'none', border: '1px solid var(--border)', padding: 8, borderRadius: 6, color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </button>
          <button style={{ background: 'none', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 6, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            1
          </button>
          <button style={{ background: 'none', border: '1px solid var(--border)', padding: 8, borderRadius: 6, color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
          <button style={{ background: 'none', border: '1px solid var(--border)', padding: 8, borderRadius: 6, color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
          </button>
          <button style={{ background: 'none', border: '1px solid var(--border)', padding: 8, borderRadius: 6, color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          </button>
          <button onClick={() => router.push('/tasks')} style={{ background: 'none', border: '1px solid var(--border)', padding: 8, borderRadius: 6, color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Left Side: Details & Subtasks */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
            {task.description || 'No description provided.'}
          </p>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Properties</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, background: 'var(--card)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 20, color: 'var(--text-primary)' }}>
                Designer <span style={{ color: '#ef4444', marginLeft: 4 }}>31 Jul</span>
              </span>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Labels</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {task.labels?.map(l => (
                <span key={l} style={{ fontSize: 13, background: 'var(--card)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 4, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  {l}
                </span>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: 'rotate(0)' }}><path d="M6 9l6 6 6-6" /></svg>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Subtasks</h3>
            </div>
            
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 50px', padding: '10px 16px', background: 'var(--background)', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <span>Task</span><span>Priority</span><span>Members</span><span>Due Date</span><span>Actions</span>
              </div>
              
              {/* Fake Subtasks for UI layout match */}
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px 50px', padding: '12px 16px', alignItems: 'center', borderBottom: '1px solid var(--border-light)', fontSize: 13 }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Subtask {i}</span>
                  <span style={{ color: i === 1 ? '#ef4444' : i === 2 ? 'var(--text-muted)' : '#f59e0b' }}>
                    {i === 1 ? 'High' : i === 2 ? 'Low' : 'Medium'}
                  </span>
                  <span><Avatar name={task.assignee || 'User'} size={22} /></span>
                  <span style={{ color: 'var(--text-muted)' }}>12 Sep 2026</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>...</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>+ Add Subtasks</div>
            </div>
          </div>

          {/* Subtasks comments/updates */}
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Subtasks</h3>
            
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar name="Ankit Dutta" size={24} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Ankit Dutta</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>just now</span>
                </div>
                <div style={{ display: 'flex', gap: 8, color: 'var(--text-muted)' }}>
                  <span>☺</span><span>...</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: '0 0 16px' }}>dsds</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={task.assignee || 'User'} size={24} />
                <div style={{ flex: 1, position: 'relative' }}>
                  <input type="text" placeholder="Leave a reply..." style={{ width: '100%', padding: '8px 12px', paddingRight: 60, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                  <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8, color: 'var(--text-muted)' }}>
                    <span>@</span><span>▶</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Add a comment..." style={{ width: '100%', padding: '12px', paddingRight: 60, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 12, color: 'var(--text-muted)' }}>
                <span>@</span><span>📎</span><span>▶</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Details & Updates */}
        <div style={{ width: 320, borderLeft: '1px solid var(--border)', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: 16 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Details</h3>
                <div style={{ display: 'flex', gap: 8, color: 'var(--text-muted)' }}>
                  <span>+</span><span>⚙</span>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px 8px', fontSize: 13, alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} /> {STATUS_LABELS[task.status]}
                </span>
                
                <span style={{ color: 'var(--text-muted)' }}>Priority</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg> {PRIORITY_LABELS[task.priority]} ▾
                </span>
                
                <span style={{ color: 'var(--text-muted)' }}>Members</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Add members
                </span>
                
                <span style={{ color: 'var(--text-muted)' }}>Dates</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)' }}>
                  <span style={{ background: 'var(--background)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    📅 Jan 10
                  </span>
                  →
                  <span style={{ background: 'var(--background)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    📅 End
                  </span>
                </span>

                <span style={{ color: 'var(--text-muted)' }}>Labels</span>
                <span style={{ color: 'var(--text-primary)' }}>+</span>

                <span style={{ color: 'var(--text-muted)' }}>Teams</span>
                <span style={{ color: 'var(--text-primary)' }}>+</span>

                <span style={{ color: 'var(--text-muted)' }}>Reporter</span>
                <span><Avatar name={task.assignee || 'User'} size={24} /></span>
              </div>
            </div>
          </div>
          
          <div style={{ padding: '0 16px 16px', flex: 1, overflowY: 'auto' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>Updates</h3>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <Avatar name={task.assignee || 'User'} size={28} />
                <div>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                    <span style={{ fontWeight: 600 }}>{task.assignee || 'User'}</span> updated the Priority to Urgent
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Aug 2026</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
