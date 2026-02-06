import { calculate } from '../src/calculator';

describe('Calculator', () => {
  describe('Basic Addition', () => {
    test('should add two positive numbers', () => {
      expect(calculate('1 + 2')).toBe(3);
      expect(calculate('5 + 7')).toBe(12);
      expect(calculate('0 + 0')).toBe(0);
    });

    test('should add multiple numbers', () => {
      expect(calculate('1 + 2 + 3')).toBe(6);
      expect(calculate('10 + 20 + 30')).toBe(60);
      expect(calculate('1 + 2 + 3 + 4 + 5')).toBe(15);
    });

    test('should handle decimal numbers in addition', () => {
      expect(calculate('1.5 + 2.5')).toBe(4);
      expect(calculate('0.1 + 0.2')).toBeCloseTo(0.3, 10);
      expect(calculate('3.14 + 2.86')).toBeCloseTo(6, 10);
    });
  });

  describe('Basic Subtraction', () => {
    test('should subtract two positive numbers', () => {
      expect(calculate('5 - 3')).toBe(2);
      expect(calculate('10 - 4')).toBe(6);
      expect(calculate('100 - 50')).toBe(50);
    });

    test('should handle subtraction resulting in negative numbers', () => {
      expect(calculate('3 - 5')).toBe(-2);
      expect(calculate('0 - 10')).toBe(-10);
      expect(calculate('1 - 100')).toBe(-99);
    });

    test('should handle multiple subtraction operations', () => {
      expect(calculate('10 - 3 - 2')).toBe(5);
      expect(calculate('100 - 20 - 30')).toBe(50);
      expect(calculate('7 - 5 - 1')).toBe(1);
    });

    test('should handle decimal numbers in subtraction', () => {
      expect(calculate('5.5 - 2.5')).toBe(3);
      expect(calculate('10.75 - 3.25')).toBe(7.5);
      expect(calculate('1.1 - 0.1')).toBeCloseTo(1, 10);
    });
  });

  describe('Mixed Operations', () => {
    test('should handle mixed addition and subtraction', () => {
      expect(calculate('10 - 4 + 3')).toBe(9);
      expect(calculate('5 + 3 - 2')).toBe(6);
      expect(calculate('1 + 2 - 3 + 4')).toBe(4);
    });

    test('should handle complex mixed operations', () => {
      expect(calculate('100 - 25 + 15 - 10 + 5')).toBe(85);
      expect(calculate('1 - 2 + 3 - 4 + 5')).toBe(3);
      expect(calculate('10 + 5 - 3 + 2 - 1')).toBe(13);
    });

    test('should handle mixed operations with decimals', () => {
      expect(calculate('5.5 + 2.3 - 1.8')).toBeCloseTo(6, 10);
      expect(calculate('10.25 - 3.75 + 2.5')).toBe(9);
      expect(calculate('1.1 + 2.2 - 0.3')).toBeCloseTo(3, 10);
    });
  });

  describe('Edge Cases', () => {
    test('should handle single numbers', () => {
      expect(calculate('42')).toBe(42);
      expect(calculate('0')).toBe(0);
      expect(calculate('3.14')).toBe(3.14);
    });

    test('should handle operations with zero', () => {
      expect(calculate('0 + 5')).toBe(5);
      expect(calculate('5 + 0')).toBe(5);
      expect(calculate('0 - 5')).toBe(-5);
      expect(calculate('5 - 0')).toBe(5);
      expect(calculate('0 + 0')).toBe(0);
      expect(calculate('0 - 0')).toBe(0);
    });

    test('should handle large numbers', () => {
      expect(calculate('1000000 + 2000000')).toBe(3000000);
      expect(calculate('999999 - 999998')).toBe(1);
      expect(calculate('123456 + 654321')).toBe(777777);
    });
  });

  describe('Whitespace Handling', () => {
    test('should handle various whitespace patterns', () => {
      expect(calculate('1+2')).toBe(3);
      expect(calculate('1 +2')).toBe(3);
      expect(calculate('1+ 2')).toBe(3);
      expect(calculate('1  +  2')).toBe(3);
      expect(calculate('  1 + 2  ')).toBe(3);
    });

    test('should handle tabs and multiple spaces', () => {
      expect(calculate('5    -    3')).toBe(2);
      expect(calculate('10\t+\t5')).toBe(15);
      expect(calculate('\t  1 + 2\t  ')).toBe(3);
    });
  });

  describe('Error Handling', () => {
    test('should throw error for invalid input', () => {
      expect(() => calculate('abc')).toThrow();
      expect(() => calculate('1 + abc')).toThrow();
      expect(() => calculate('')).toThrow();
    });

    test('should throw error for invalid operators', () => {
      expect(() => calculate('1 * 2')).toThrow();
      expect(() => calculate('1 / 2')).toThrow();
      expect(() => calculate('1 & 2')).toThrow();
    });

    test('should throw error for malformed expressions', () => {
      expect(() => calculate('1 +')).toThrow();
      expect(() => calculate('+ 1')).toThrow();
      expect(() => calculate('1 + + 2')).toThrow();
    });
  });
});