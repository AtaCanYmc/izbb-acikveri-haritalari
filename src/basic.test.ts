import { describe, it, expect } from 'vitest';

describe('Basic Test Suite', () => {
  it('should pass basic assertions', () => {
    expect(1 + 1).toBe(2);
  });

  it('should work with strings', () => {
    expect('hello').toBe('hello');
  });

  it('should work with arrays', () => {
    expect([1, 2, 3]).toHaveLength(3);
  });
});

