'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (user) {
    return (
      <Link
        href="/my-fortune"
        className="text-sm font-medium text-gold transition-colors hover:text-gold/80"
      >
        My Fortune
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm text-foreground/60 transition-colors hover:text-gold"
    >
      Sign In
    </Link>
  );
}
