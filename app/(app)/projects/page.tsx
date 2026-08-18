'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Project, CreateProjectPayload, UpdateProjectPayload } from '@/types';
import { projectsApi } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Button } from '@/components/ui/Button';
import { formatDate, toInputDate } from '@/lib/utils';
import { TaskPriority, PRIORITY_LABELS } from '@/types';
import { useFields, FieldsState } from '@/lib/fields-context';

const PROJECT_STATUSES = ['todo', 'doing', 'completed'] as const;
const PROJECT_STATUS_LABELS = {
  todo: 'To Do',
  doing: 'Doing',
  completed: 'Completed',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const { visibleFields } = useFields();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('no_priority');
  const [lead, setLead] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<string>('todo');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const filteredProjects = projects.filter((p) => {
    if (searchValue) {
      const query = searchValue.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    if (filterPriority && p.priority !== filterPriority) {
      return false;
    }
    return true;
  });

  const openCreate = (defaultStatusVal: string = 'todo') => {
    setEditingProject(null);
    setName(''); setDescription(''); setPriority('no_priority'); setLead(''); setDueDate('');
    setStatus(defaultStatusVal);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setName(project.name); setDescription(project.description || '');
    setPriority(project.priority || 'no_priority'); setLead(project.lead || '');
    setDueDate(toInputDate(project.dueDate));
    setStatus(project.status || 'todo');
    setFormError(null);
    setShowModal(true);
    setMenuOpen(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setFormError('Project name is required'); return; }
    setFormLoading(true); setFormError(null);
    try {
      const payload: CreateProjectPayload = {
        name: name.trim(), description: description.trim() || undefined,
        priority, lead: lead.trim() || undefined, dueDate: dueDate || undefined,
        status,
      };
      if (editingProject) {
        const updated = await projectsApi.update(editingProject._id, payload as UpdateProjectPayload);
        setProjects((prev) => prev.map((p) => (p._id === editingProject._id ? updated : p)));
      } else {
        const created = await projectsApi.create(payload);
        setProjects((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await projectsApi.delete(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
    setMenuOpen(null);
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', fontSize: 13,
    border: '1px solid var(--border)', borderRadius: 6,
    background: 'var(--input-bg)', color: 'var(--text-primary)',
    outline: 'none', fontFamily: 'inherit',
  };

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--background)' }}>
      <Header
        title="Projects"
        onAddTask={openCreate}
        addLabel=" Add Project"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        selectedPriority={filterPriority}
        onPriorityChange={setFilterPriority}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
        <div style={{ minWidth: 700 }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
            {error} <button onClick={loadProjects} style={{ marginLeft: 8, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontFamily: 'inherit' }}>Retry</button>
          </div>
        )}

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: (() => {
            let cols = '1fr';
            if (visibleFields.priority) cols += ' 130px';
            if (visibleFields.members) cols += ' 130px';
            if (visibleFields.dueDate) cols += ' 130px';
            cols += ' 60px';
            return cols;
          })(),
          padding: '6px 12px', fontSize: 12, fontWeight: 600,
          color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', marginBottom: 4,
        }}>
          <span>Projects</span>
          {visibleFields.priority && <span>Priority</span>}
          {visibleFields.members && <span>Lead</span>}
          {visibleFields.dueDate && <span>Due Date</span>}
          <span>Actions</span>
        </div>

        {PROJECT_STATUSES.map((statusKey) => {
          const statusProjects = filteredProjects.filter((p) => (p.status || 'todo') === statusKey);
          
          return (
            <div key={statusKey} style={{ marginBottom: 24 }}>
              {/* Group header */}
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 4px',
                  background: 'none', border: 'none', cursor: 'default',
                  fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                  width: '100%', textAlign: 'left', fontFamily: 'inherit',
                  borderRadius: 4, marginBottom: 8,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M6 9l6 6 6-6" />
                </svg>
                {PROJECT_STATUS_LABELS[statusKey]}
              </button>

              {statusProjects.length === 0 ? (
                <div style={{
                  padding: '16px', background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 8, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center'
                }}>
                  No projects in {PROJECT_STATUS_LABELS[statusKey]}
                </div>
              ) : (
                <>
                  {statusProjects.map((project) => {
                    const projectGridColumns = (() => {
                      let cols = '1fr';
                      if (visibleFields.priority) cols += ' 130px';
                      if (visibleFields.members) cols += ' 130px';
                      if (visibleFields.dueDate) cols += ' 130px';
                      cols += ' 60px';
                      return cols;
                    })();

                    return (
                      <div
                        key={project._id}
                        style={{
                          display: 'grid', gridTemplateColumns: projectGridColumns,
                          padding: '12px 16px', alignItems: 'center',
                          borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
                          background: 'var(--card)', transition: 'background 0.1s', position: 'relative',
                          cursor: 'pointer',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
                        onMouseOut={(e) => (e.currentTarget.style.background = 'var(--card)')}
                        onClick={() => openEdit(project)}
                      >
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', paddingRight: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {project.name}
                        </span>
                        
                        {visibleFields.priority && (
                          <span>
                            <PriorityBadge priority={(project.priority || 'no_priority') as TaskPriority} />
                          </span>
                        )}
                        
                        {visibleFields.members && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {project.lead ? (
                              <><Avatar name={project.lead} size={22} /><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{project.lead}</span></>
                            ) : (
                              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                            )}
                          </span>
                        )}
                        
                        {visibleFields.dueDate && (
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            {project.dueDate ? formatDate(project.dueDate) : '—'}
                          </span>
                        )}
                        
                        <span style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project._id ? null : project._id); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px 8px', fontSize: 16, fontFamily: 'inherit' }}
                          >
                            ···
                          </button>
                          {menuOpen === project._id && (
                            <div style={{
                              position: 'absolute', right: 0, top: '100%',
                              background: 'var(--card)', border: '1px solid var(--border)',
                              borderRadius: 8, boxShadow: 'var(--shadow-lg)', zIndex: 200, minWidth: 130, overflow: 'hidden',
                            }} className="animate-slide-down">
                              <button onClick={(e) => { e.stopPropagation(); openEdit(project); }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-primary)', textAlign: 'left', fontFamily: 'inherit' }}
                                onMouseOver={(e) => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
                                onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                              >
                                ✏️ Edit
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(project._id); }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#ef4444', textAlign: 'left', fontFamily: 'inherit' }}
                                onMouseOver={(e) => (e.currentTarget.style.background = '#fef2f2')}
                                onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          )}
                        </span>
                      </div>
                    );
                  })}
                  
                  <button
                    onClick={() => openCreate(statusKey)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                      padding: '12px 16px', background: 'var(--card)', border: '1px solid var(--border)',
                      borderTop: 'none', borderRadius: '0 0 8px 8px', cursor: 'pointer',
                      fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: 'inherit',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Project
                  </button>
                </>
              )}
            </div>
          );
        })}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProject ? 'Edit Project' : 'Create Project'} width={480}>
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          {formError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '8px 12px', marginBottom: 14, fontSize: 13, color: '#dc2626' }}>
              {formError}
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" required style={fieldStyle} autoFocus />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project description" rows={2} style={{ ...fieldStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={fieldStyle}>
                {(['no_priority', 'urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((p) => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={fieldStyle}>
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Lead</label>
              <input value={lead} onChange={(e) => setLead(e.target.value)} placeholder="Lead name" style={fieldStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={fieldStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={formLoading}>{editingProject ? 'Update Project' : 'Create Project'}</Button>
          </div>
        </form>
      </Modal>

      {/* Close menus on outside click */}
      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 100 }} onClick={() => setMenuOpen(null)} />}
    </div>
  );
}
