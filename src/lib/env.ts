// Centralized environment variable validation for API routes.
// Validates existence and format of critical secrets at point of use.

export function getValidatedEnv<T extends string>(
  key: T,
  opts?: { prefix?: string }
): string | null {
  const value = process.env[key];
  if (!value) return null;
  if (opts?.prefix && !value.startsWith(opts.prefix)) {
    console.error(`Invalid ${key}: expected prefix "${opts.prefix}"`);
    return null;
  }
  return value;
}

export function getAnthropicKey(): string | null {
  return getValidatedEnv('ANTHROPIC_API_KEY', { prefix: 'sk-ant-' });
}

export function getResendKey(): string | null {
  return getValidatedEnv('RESEND_API_KEY', { prefix: 're_' });
}

export function getStripeKey(): string | null {
  return getValidatedEnv('STRIPE_SECRET_KEY', { prefix: 'sk_' });
}
