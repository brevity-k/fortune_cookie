import { describe, it, expect, vi } from 'vitest';

// Mock jose module with vi.fn() for jwtVerify so we can override per-test
const mockJwtVerify = vi.fn().mockResolvedValue({
  payload: { customerId: 'cus_test', status: 'active' },
});

vi.mock('jose', () => ({
  SignJWT: class {
    private payload: Record<string, unknown>;
    constructor(payload: Record<string, unknown>) { this.payload = payload; }
    setProtectedHeader() { return this; }
    setIssuedAt() { return this; }
    setExpirationTime() { return this; }
    async sign() { return 'mock.jwt.token'; }
  },
  jwtVerify: mockJwtVerify,
}));

describe('premium token helpers', () => {
  it('signPremiumToken returns a string', async () => {
    const { signPremiumToken } = await import('@/lib/saju/premium');
    const token = await signPremiumToken('cus_test');
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('verifyPremiumToken returns payload', async () => {
    const { verifyPremiumToken } = await import('@/lib/saju/premium');
    const payload = await verifyPremiumToken('mock.jwt.token');
    expect(payload).toEqual({ customerId: 'cus_test', status: 'active' });
  });

  it('verifyPremiumToken returns null for invalid token', async () => {
    mockJwtVerify.mockRejectedValueOnce(new Error('invalid'));
    const { verifyPremiumToken } = await import('@/lib/saju/premium');
    const payload = await verifyPremiumToken('bad-token');
    expect(payload).toBeNull();
  });

  it('getPremiumToken returns null on server', async () => {
    const { getPremiumToken } = await import('@/lib/saju/premium');
    // In test env (no window), should return null
    expect(getPremiumToken()).toBeNull();
  });
});
