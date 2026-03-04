'use client';

import { useState, useSyncExternalStore } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DailyCheckInProps {
  onSubmit?: () => void;
}

const PROMPTS = [
  'Is there anything weighing on your mind today?',
  'What have you been putting your energy into lately?',
  'How have you been feeling recently?',
  'What kind of day are you hoping for today?',
  'What has been on your mind the most lately?',
];

function getTodayKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return `premium_checkin_${today}`;
}

const noop = () => () => {};
const getCheckedIn = () => {
  try { return localStorage.getItem(getTodayKey()) === '1'; } catch { return false; }
};
const getServerCheckedIn = () => true; // SSR: assume checked in (hide widget)

export default function DailyCheckIn({ onSubmit }: DailyCheckInProps) {
  const alreadyCheckedIn = useSyncExternalStore(noop, getCheckedIn, getServerCheckedIn);
  const [dismissed, setDismissed] = useState(false);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prompt = PROMPTS[new Date().getDate() % PROMPTS.length];

  if (alreadyCheckedIn || dismissed || saved) return null;

  function markDone() {
    try {
      localStorage.setItem(getTodayKey(), '1');
    } catch { /* Safari private mode */ }
  }

  async function handleSubmit() {
    if (!text.trim()) return;

    setSaving(true);
    setError(null);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Please sign in to continue.');
      setSaving(false);
      return;
    }

    const { error: insertError } = await supabase.from('user_context').insert({
      user_id: user.id,
      content: text.trim().slice(0, 1000),
      context_type: 'daily_check_in',
    });

    if (insertError) {
      setError('Failed to save. Please try again.');
      setSaving(false);
      return;
    }

    markDone();
    setSaved(true);
    setSaving(false);
    onSubmit?.();
  }

  function handleSkip() {
    markDone();
    setDismissed(true);
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
      <p className="text-sm text-foreground">{prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="A word or two is enough"
        rows={2}
        maxLength={300}
        className="w-full resize-none rounded-lg border border-border bg-background/30 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-gold/40 focus:outline-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSkip}
          className="text-xs text-foreground/30 transition-colors hover:text-foreground/60"
        >
          Skip
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || !text.trim()}
          className="rounded-lg border border-gold/30 bg-gold/20 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/30 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
