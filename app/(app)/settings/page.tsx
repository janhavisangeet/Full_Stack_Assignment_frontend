'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { getStoredUser, clearAuth, saveUser } from '@/lib/utils';
import { ACCENT_COLORS, ACCENT_HEX, AccentColor, ThemeMode } from '@/types';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function SettingsPage() {
  const { theme, accent, setTheme, setAccent } = useTheme();
  const [user, setUser] = useState<{ _id: string; name: string; isGuest: boolean; email?: string; title?: string; username?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'color'>('profile');
  const router = useRouter();

  // Profile fields state
  const [nameVal, setNameVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [titleVal, setTitleVal] = useState('');
  const [usernameVal, setUsernameVal] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const u = await authApi.getMe();
        setUser(u);
        setNameVal(u.name || '');
        setEmailVal(u.email || '');
        setTitleVal(u.title || '');
        setUsernameVal(u.username || '');
        saveUser(u);
      } catch (err) {
        const stored = getStoredUser();
        if (stored) {
          setUser(stored);
          setNameVal(stored.name || '');
          setEmailVal((stored as any).email || '');
          setTitleVal((stored as any).title || '');
          setUsernameVal((stored as any).username || '');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSaveField = async (field: 'name' | 'email' | 'title' | 'username', value: string) => {
    if (!user) return;
    
    // Optimistically update local state & localStorage
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
    saveUser(updatedUser);

    setIsSaving(true);
    try {
      const u = await authApi.updateProfile({ [field]: value });
      setUser(u);
      saveUser(u);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailSave = () => {
    setIsEditingEmail(false);
    handleSaveField('email', emailVal);
  };

  const handleLeaveWorkspace = () => {
    if (confirm('Are you sure you want to leave the workspace and sign out?')) {
      clearAuth();
      window.location.href = '/login';
    }
  };

  const profileInputStyle: React.CSSProperties = {
    width: 200,
    padding: '8px 12px',
    fontSize: 13,
    border: 'none',
    borderRadius: 6,
    background: 'var(--background)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const leaveButtonStyle: React.CSSProperties = {
    background: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 6,
    fontWeight: 500,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.2s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--background)' }}>
      <Header title="Settings" />

      <div className="md-flex-col" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Settings Sidebar */}
        <div className="md-w-full md-border-none" style={{ width: 240, borderRight: '1px solid var(--border)', background: 'var(--card)', padding: '20px 16px', flexShrink: 0 }}>
          <button
            onClick={() => router.push('/tasks')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
              marginBottom: 24, fontFamily: 'inherit', padding: 0
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to app
          </button>

          <div style={{ marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search" style={{
                width: '100%', padding: '6px 12px 6px 32px', fontSize: 13, border: 'none',
                borderRadius: 6, background: 'var(--background)', color: 'var(--text-primary)',
                outline: 'none', fontFamily: 'inherit'
              }} />
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { id: 'profile', label: 'Profile', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" /></svg> },
              { id: 'theme', label: 'Theme', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg> },
              { id: 'color', label: 'Color', icon: <div style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--accent)' }} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                  borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 13, fontWeight: 500,
                  background: activeTab === item.id ? 'var(--sidebar-item-active)' : 'transparent',
                  color: activeTab === item.id ? 'var(--sidebar-item-active-text)' : 'var(--text-primary)',
                }}
              >
                <span style={{ color: activeTab === item.id ? 'var(--accent)' : 'var(--text-muted)' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="md-p-4" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 560 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 32 }}>
              {activeTab === 'profile' ? 'Profile' : activeTab === 'theme' ? 'Theme' : 'Color Mode'}
            </h2>

            {activeTab === 'profile' && (
              <div className="animate-fade-in">
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '24px 32px', marginBottom: 24 }}>
                  {/* Profile Picture */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border-light)', marginBottom: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Profile picture</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <Avatar name={nameVal || 'G'} size={48} />
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border-light)', marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Email</span>
                    </div>
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                      {isEditingEmail ? (
                        <input
                          type="email"
                          value={emailVal}
                          onChange={(e) => setEmailVal(e.target.value)}
                          onBlur={handleEmailSave}
                          style={profileInputStyle}
                          autoFocus
                        />
                      ) : (
                        <>
                          <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{emailVal || 'dexter@gmail.com'}</span>
                          <button
                            onClick={() => setIsEditingEmail(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'var(--text-muted)' }}
                            aria-label="Edit Email"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border-light)', marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Full name</span>
                    </div>
                    <div style={{ flex: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <input
                        type="text"
                        value={nameVal}
                        onChange={(e) => setNameVal(e.target.value)}
                        onBlur={() => handleSaveField('name', nameVal)}
                        style={profileInputStyle}
                        placeholder="Dexter"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border-light)', marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Title</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>Your job title or role</span>
                    </div>
                    <div style={{ flex: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <input
                        type="text"
                        value={titleVal}
                        onChange={(e) => setTitleVal(e.target.value)}
                        onBlur={() => handleSaveField('title', titleVal)}
                        style={profileInputStyle}
                        placeholder="Designer"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Username</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>One word, like a nickname or first name</span>
                    </div>
                    <div style={{ flex: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <input
                        type="text"
                        value={usernameVal}
                        onChange={(e) => setUsernameVal(e.target.value)}
                        onBlur={() => handleSaveField('username', usernameVal)}
                        style={profileInputStyle}
                        placeholder="Dexuser"
                      />
                    </div>
                  </div>
                </div>

                {/* Workspace Access */}
                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Workspace access</h3>
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Remove yourself from the workspace</span>
                    <button style={leaveButtonStyle} onClick={handleLeaveWorkspace}>Leave Workspace</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="animate-fade-in" style={{ display: 'flex', gap: 24 }}>
                {(['light', 'dark'] as ThemeMode[]).map((t) => (
                  <div
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{
                      flex: 1,
                      border: theme === t ? '2px solid var(--accent)' : '2px solid transparent',
                      borderRadius: 12,
                      padding: 4,
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <div style={{
                      height: 120,
                      background: t === 'light' ? '#f8fafc' : '#0f172a',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span style={{ color: t === 'light' ? '#334155' : '#e2e8f0', fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>{t}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'color' && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {ACCENT_COLORS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAccent(a as AccentColor)}
                    style={{
                      background: 'var(--card)',
                      border: accent === a ? '2px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: 8,
                      padding: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: ACCENT_HEX[a as AccentColor] }} />
                    <span style={{ textTransform: 'capitalize' }}>{a}</span>
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
