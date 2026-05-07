import { describe, expect, test } from 'vitest';
import { normalizePhone } from './clients.js';

describe('BR-02 — phone normalization for antidublication', () => {
  test('+7XXXXXXXXXX stays as-is', () => {
    expect(normalizePhone('+79161234567')).toBe('+79161234567');
  });
  test('8XXXXXXXXXX (legacy RU) → +7', () => {
    expect(normalizePhone('89161234567')).toBe('+79161234567');
  });
  test('7XXXXXXXXXX (no plus) → +7', () => {
    expect(normalizePhone('79161234567')).toBe('+79161234567');
  });
  test('10-digit bare → +7', () => {
    expect(normalizePhone('9161234567')).toBe('+79161234567');
  });
  test('non-digit characters stripped', () => {
    expect(normalizePhone('+7 (916) 123-45-67')).toBe('+79161234567');
  });
});
