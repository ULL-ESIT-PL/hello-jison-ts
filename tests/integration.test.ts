import { calculate } from '../src/calculator';

describe('Integration Tests', () => {
  describe('Examples from index.ts', () => {
    test('should match the examples in index.ts', () => {
      // These are the exact examples from src/index.ts
      expect(calculate('1 + 2')).toBe(3);        
      expect(calculate('10 - 4 + 3')).toBe(9);   
      expect(calculate('7 - 5 - 1')).toBe(1);    
    });
  });

  describe('Parser Integration', () => {
    test('should correctly parse and evaluate complex expressions', () => {
      // Test left-to-right evaluation (as per grammar)
      expect(calculate('1 + 2 - 3 + 4')).toBe(4);
      expect(calculate('10 - 5 + 2 - 3')).toBe(4);
    });

    test('should handle parser output types correctly', () => {
      const result = calculate('5 + 3');
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBe(8);
    });

    test('should handle decimal parsing correctly', () => {
      const result = calculate('1.5 + 2.7');
      expect(typeof result).toBe('number');
      expect(result).toBeCloseTo(4.2, 10);
    });
  });

  describe('Grammar Rule Verification', () => {
    test('should follow left associativity for same precedence operations', () => {
      // 1 - 2 - 3 should be evaluated as (1 - 2) - 3 = -4
      // not as 1 - (2 - 3) = 2
      expect(calculate('1 - 2 - 3')).toBe(-4);
      expect(calculate('10 + 5 - 3')).toBe(12);
    });

    test('should handle single term expressions', () => {
      expect(calculate('42')).toBe(42);
      expect(calculate('0')).toBe(0);
      expect(calculate('123.456')).toBe(123.456);
    });
  });
});