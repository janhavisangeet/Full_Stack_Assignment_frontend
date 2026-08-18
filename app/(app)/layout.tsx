'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { getStoredToken } from '@/lib/utils';
import { SidebarProvider } from '@/lib/sidebar-context';
import { FieldsProvider } from '@/lib/fields-context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    setMounted(true);
  }, [router]);

  if (!mounted) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--background)',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid var(--accent)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <FieldsProvider>
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--background)' }}>
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
          <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </FieldsProvider>
    </SidebarProvider>
  );
}
