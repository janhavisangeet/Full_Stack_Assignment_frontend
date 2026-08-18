'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme } from '@/components/theme/ThemeProvider';
import { getStoredUser, clearAuth } from '@/lib/utils';
import { ACCENT_COLORS, ACCENT_HEX, AccentColor } from '@/types';
import { useSidebar } from '@/lib/sidebar-context';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, accent, setTheme, setAccent } = useTheme();
  const user = getStoredUser();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [themeSubmenu, setThemeSubmenu] = useState(false);
  const [colorSubmenu, setColorSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { mobileOpen, setMobileOpen } = useSidebar();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
        setThemeSubmenu(false);
        setColorSubmenu(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileMenuOpen]);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  const navItems = [
    {
      label: 'Tasks',
      href: '/tasks',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      label: 'Projects',
      href: '/projects',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7v13a1 1 0 001 1h16a1 1 0 001-1V9a1 1 0 00-1-1h-9l-2-2H4a1 1 0 00-1 1z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 190 }}
          onClick={() => setMobileOpen(false)}
          className="md:block hidden"
        />
      )}

      <aside
        className={`md-drawer ${mobileOpen ? 'open' : ''} md-border-none`}
        style={{
          width: collapsed ? 60 : 240,
          minWidth: collapsed ? 60 : 240,
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          transition: 'width 0.2s ease, min-width 0.2s ease, left 0.3s ease',
          zIndex: 10,
          overflow: 'visible',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: collapsed ? '14px 10px' : '14px 16px',
            borderBottom: '1px solid var(--sidebar-border)',
            gap: 8,
            minHeight: 56,
          }}
        >
          {!collapsed && (
            <div
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, flex: 1, cursor: 'pointer' }}
              onClick={() => setProfileMenuOpen((v) => !v)}
            >
              <Avatar name={user?.name || 'Guest'} size={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0
                }}>
                  {user?.name || 'Guest'}
                </p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          )}
          {collapsed && (
            <div onClick={() => setProfileMenuOpen((v) => !v)} style={{ cursor: 'pointer' }}>
              <Avatar name={user?.name || 'G'} size={28} />
            </div>
          )}

          {/* Toggle Collapse - Hidden on Mobile */}
          <button
            onClick={onToggle}
            className="hidden md:flex"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 4, borderRadius: 4,
              alignItems: 'center', flexShrink: 0,
            }}
            aria-label="Toggle sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </button>
        </div>

        {/* Profile Dropdown */}
        {profileMenuOpen && (
          <div
            ref={menuRef}
            style={{
              position: 'absolute',
              top: 56,
              left: collapsed ? 64 : 16,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              boxShadow: 'var(--shadow-lg)',
              minWidth: 200,
              zIndex: 100,
              overflow: 'visible',
            }}
            className="animate-slide-down"
          >
            {/* User info */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Avatar name={user?.name || 'Guest'} size={36} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{user?.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                    {user?.isGuest ? 'Guest User' : 'Registered User'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div style={{ padding: '6px 0' }}>


              {/* Change Theme */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => { setThemeSubmenu(true); setColorSubmenu(false); }}
                onMouseLeave={() => setThemeSubmenu(false)}
              >
                <button
                  style={{
                    width: '100%', padding: '8px 16px', background: 'none', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 13, color: 'var(--text-primary)', textAlign: 'left', fontFamily: 'inherit',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  Change Theme
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                {themeSubmenu && (
                  <div
                    style={{
                      position: 'absolute', left: '100%', top: 0,
                      background: 'var(--card)', border: '1px solid var(--border)',
                      borderRadius: 8, boxShadow: 'var(--shadow-lg)', minWidth: 140, zIndex: 110,
                    }}
                    className="animate-slide-down"
                  >
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', padding: '8px 14px 4px', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Theme</p>
                    {(['light', 'dark'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setTheme(t); setProfileMenuOpen(false); setThemeSubmenu(false); }}
                        style={{
                          width: '100%', padding: '7px 14px', background: 'none', border: 'none',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                          fontSize: 13, color: 'var(--text-primary)', textAlign: 'left', fontFamily: 'inherit',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
                        onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        {t === 'light' ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                        )}
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                        {theme === t && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Mode */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => { setColorSubmenu(true); setThemeSubmenu(false); }}
                onMouseLeave={() => setColorSubmenu(false)}
              >
                <button
                  style={{
                    width: '100%', padding: '8px 16px', background: 'none', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 13, color: 'var(--text-primary)', textAlign: 'left', fontFamily: 'inherit',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--accent)' }} />
                  Color Mode
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto' }}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                {colorSubmenu && (
                  <div
                    style={{
                      position: 'absolute', left: '100%', top: 0,
                      background: 'var(--card)', border: '1px solid var(--border)',
                      borderRadius: 8, boxShadow: 'var(--shadow-lg)', minWidth: 150, zIndex: 110,
                    }}
                    className="animate-slide-down"
                  >
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', padding: '8px 14px 4px', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Color Mode</p>
                    {ACCENT_COLORS.map((a) => (
                      <button
                        key={a}
                        onClick={() => { setAccent(a as AccentColor); setProfileMenuOpen(false); setColorSubmenu(false); }}
                        style={{
                          width: '100%', padding: '7px 14px', background: 'none', border: 'none',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                          fontSize: 13, color: 'var(--text-primary)', textAlign: 'left', fontFamily: 'inherit',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
                        onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        <div style={{ width: 14, height: 14, borderRadius: 3, background: ACCENT_HEX[a] }} />
                        {a.charAt(0).toUpperCase() + a.slice(1)}
                        {accent === a && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings */}
              <button
                onClick={() => { setProfileMenuOpen(false); router.push('/settings'); }}
                style={{
                  width: '100%', padding: '8px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 13, color: 'var(--text-primary)', textAlign: 'left', fontFamily: 'inherit',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'var(--sidebar-item-hover)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
                Settings
              </button>

              <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

              <button
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '8px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 13, color: '#ef4444', textAlign: 'left', fontFamily: 'inherit',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#fef2f2')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '12px 10px', overflowY: 'auto' }}>
          {!collapsed && (
            <p style={{
              fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: '0 8px 4px',
              margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              Workspace
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </p>
          )}
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: collapsed ? 0 : 10,
                  padding: collapsed ? '9px' : '8px 10px',
                  borderRadius: 6,
                  textDecoration: 'none',
                  marginBottom: 2,
                  background: isActive ? 'var(--sidebar-item-active)' : 'transparent',
                  color: isActive ? 'var(--sidebar-item-active-text)' : 'var(--text-secondary)',
                  transition: 'all 0.1s ease',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                onMouseOver={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-item-hover)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background = isActive ? 'var(--sidebar-item-active)' : 'transparent';
                }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
