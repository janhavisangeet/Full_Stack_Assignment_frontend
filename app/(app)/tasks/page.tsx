'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, ViewMode, CreateTaskPayload, UpdateTaskPayload } from '@/types';
import { tasksApi } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [searchValue, setSearchValue] = useState('');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const router = useRouter();

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Create task
  const handleCreateTask = async (payload: CreateTaskPayload) => {
    const newTask = await tasksApi.create(payload);
    setTasks((prev) => [newTask, ...prev]);
    setShowCreateModal(false);
  };

  // Update task
  const handleUpdateTask = async (id: string, payload: UpdateTaskPayload) => {
    const updated = await tasksApi.update(id, payload);
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
  };
  // Delete task
  const handleDeleteTask = async (id: string) => {
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  // Navigate to Task Detail page
  const handleTaskClick = (task: Task) => {
    router.push(`/tasks/${task._id}`);
  };

  // Open create modal with a pre-selected status
  const openCreateForStatus = (status: TaskStatus) => {
    setDefaultStatus(status);
    setShowCreateModal(true);
  };

  // Filter tasks by search, priority, and status
  const filteredTasks = tasks.filter((t) => {
    if (searchValue) {
      const query = searchValue.toLowerCase();
      const matchesSearch = t.title.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    if (filterPriority && t.priority !== filterPriority) {
      return false;
    }
    if (filterStatus && t.status !== filterStatus) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36, height: 36, border: '3px solid var(--accent)',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
          }} />
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading tasks...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div style={{ textAlign: 'center', maxWidth: 320 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Failed to load tasks</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{error}</p>
          <button
            onClick={loadTasks}
            style={{
              padding: '8px 16px', background: 'var(--accent)', color: 'white',
              border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--background)' }}>
      <Header
        title="Tasks"
        onAddTask={() => { setDefaultStatus('todo'); setShowCreateModal(true); }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewToggle
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        selectedPriority={filterPriority}
        onPriorityChange={setFilterPriority}
        selectedStatus={filterStatus}
        onStatusChange={setFilterStatus}
      />

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Task view */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {filteredTasks.length === 0 && !loading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', maxWidth: 280 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {searchValue ? 'No tasks found' : 'No tasks yet'}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                  {searchValue ? `No tasks match "${searchValue}"` : 'Create your first task to get started.'}
                </p>
                {!searchValue && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    style={{
                      padding: '8px 16px', background: 'var(--accent)', color: 'white',
                      border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                    }}
                  >
                    + Add Task
                  </button>
                )}
              </div>
            </div>
          ) : viewMode === 'board' ? (
            <TaskBoard
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              onAddTask={openCreateForStatus}
            />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              onAddTask={openCreateForStatus}
              onDeleteTask={handleDeleteTask}
              onStatusChange={(id, status) => handleUpdateTask(id, { status })}
            />
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Task"
        width={540}
      >
        <TaskForm
          defaultStatus={defaultStatus}
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
}
