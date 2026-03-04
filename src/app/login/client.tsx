'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type AuthMethod = 'google' | 'email';

function getSafeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('..') || raw.includes('@')) {
    return '/my-fortune';
  }
  return raw;
}

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = getSafeRedirect(searchParams.get('redirect'));
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState<AuthMethod | null>(null);
  const [authError, setAuthError] = useState<string | null>(
    error === 'auth' ? 'Sign in failed. Please try again.' : null,
  );

  const supabase = createClient();

  async function handleGoogle() {
    setLoading('google');
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) {
      setAuthError('Sign in failed. Please try again.');
      setLoading(null);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading('email');
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
    if (error) {
      setAuthError('Failed to send email. Please try again.');
    } else {
      setEmailSent(true);
    }
    setLoading(null);
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="text-4xl">📧</div>
        <h1 className="text-xl font-bold text-foreground">Check your email</h1>
        <p className="text-sm text-foreground/60">
          We sent a login link to <span className="text-gold">{email}</span>.
        </p>
        <button
          onClick={() => setEmailSent(false)}
          className="text-sm text-foreground/40 underline underline-offset-2 transition-colors hover:text-foreground/60"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <div className="text-4xl">🥠</div>
        <h1 className="text-xl font-bold text-foreground">Sign In</h1>
        <p className="text-sm text-foreground/60">Start your personalized fortune journey</p>
      </div>

      {authError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {authError}
        </div>
      )}

      <div className="space-y-3">
        {/* Google Login */}
        <button
          onClick={handleGoogle}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {loading === 'google' ? (
            <span className="animate-spin text-lg">⏳</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M19.6 10.23c0-.68-.06-1.36-.18-2.01H10v3.8h5.38a4.6 4.6 0 01-2 3.02v2.5h3.24c1.89-1.74 2.98-4.3 2.98-7.31z" fill="#4285F4" />
              <path d="M10 20c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H1.08v2.6A9.99 9.99 0 0010 20z" fill="#34A853" />
              <path d="M4.42 11.91A6.01 6.01 0 014.1 10c0-.66.12-1.3.32-1.91V5.49H1.08A9.99 9.99 0 000 10c0 1.61.39 3.14 1.08 4.49l3.34-2.58z" fill="#FBBC05" />
              <path d="M10 3.96c1.47 0 2.78.5 3.82 1.5l2.86-2.87C14.96.99 12.7 0 10 0A9.99 9.99 0 001.08 5.49l3.34 2.6C5.2 5.73 7.4 3.96 10 3.96z" fill="#EA4335" />
            </svg>
          )}
          Continue with Google
        </button>

        {/* Email Toggle */}
        {!showEmail && (
          <button
            onClick={() => setShowEmail(true)}
            className="w-full py-2 text-sm text-foreground/40 transition-colors hover:text-foreground/60"
          >
            Sign in with email
          </button>
        )}

        {/* Email Magic Link */}
        {showEmail && (
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-gold/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading !== null || !email.trim()}
              className="w-full rounded-xl border border-gold/30 bg-gold/20 px-4 py-3 font-medium text-gold transition-colors hover:bg-gold/30 disabled:opacity-50"
            >
              {loading === 'email' ? 'Sending...' : 'Send login link'}
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-xs text-foreground/30">
        By signing in you agree to our{' '}
        <a href="/terms" className="underline underline-offset-2">Terms</a> and{' '}
        <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
      </p>
    </div>
  );
}
