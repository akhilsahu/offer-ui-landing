export const config = {
  currency: {
    default: 'USD',
    symbol: '$',
    position: 'before' as const,
    supported: ['USD', 'EUR', 'GBP'] as const,
  },
  ppc: {
    min: 0.10,
    max: 5.00,
    default: 0.50,
  },
  rateLimit: {
    clicks: 5,
    interval: 60000, // 1 minute
  },
};