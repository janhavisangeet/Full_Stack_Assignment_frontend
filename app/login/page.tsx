'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { saveAuth } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await authApi.guestLogin();
      saveAuth(token, user);
      router.push('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: '#111',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 19h20L12 2z" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Pyramid
        </span>
      </div>

      {/* Login Card */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '36px 32px',
          width: '100%',
          maxWidth: 420,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
            textAlign: 'center',
            letterSpacing: '-0.02em',
          }}
        >
          Let&apos;s get back on track
        </h1>
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          Enter your email below to login to your account.
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: 13,
              color: '#dc2626',
            }}
          >
            {error}
          </div>
        )}

        {/* Continue as Guest Button */}
        <button
          id="btn-guest-login"
          onClick={handleGuestLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '13px 24px',
            background: loading ? '#374151' : '#111111',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 12,
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
          }}
          onMouseOver={(e) => {
            if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#374151';
          }}
          onMouseOut={(e) => {
            if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#111111';
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
              Logging in...
            </>
          ) : (
            'Continue as Guest'
          )}
        </button>

        {/* Google Login (placeholder) */}
        <button
          id="btn-google-login"
          disabled
          title="Google OAuth is not configured in this demo"
          style={{
            width: '100%',
            padding: '13px 24px',
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: 0.7,
            fontFamily: 'inherit',
          }}
        >
          {/* Google G icon */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Login with Google
        </button>

        {/* Terms */}
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: 20,
            lineHeight: 1.5,
          }}
        >
          By clicking continue, you agree to our{' '}
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>{' '}
          and{' '}
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
