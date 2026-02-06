import { calculate } from '../src/calculator';

describe('Parser Error Handling', () => {
  describe('Lexical Errors', () => {
    test('should reject invalid characters', () => {
      expect(() => calculate('1 @ 2')).toThrow();
      expect(() => calculate('1 # 2')).toThrow();
      expect(() => calculate('1 $ 2')).toThrow();
      expect(() => calculate('a + b')).toThrow();
    });

    test('should reject unsupported operators', () => {
      expect(() => calculate('1 * 2')).toThrow();
      expect(() => calculate('1 / 2')).toThrow();
      expect(() => calculate('1 ^ 2')).toThrow();
      expect(() => calculate('1 % 2')).toThrow();
    });
  });

  describe('Syntax Errors', () => {
    test('should reject incomplete expressions', () => {
      expect(() => calculate('1 +')).toThrow();
      expect(() => calculate('- 5')).toThrow();
      expect(() => calculate('+')).toThrow();
      expect(() => calculate('-')).toThrow();
    });

    test('should reject expressions with consecutive operators', () => {
      expect(() => calculate('1 + + 2')).toThrow();
      expect(() => calculate('1 - - 2')).toThrow();
      expect(() => calculate('1 + - 2')).toThrow();
      expect(() => calculate('1 - + 2')).toThrow();
    });

    test('should reject empty or whitespace-only input', () => {
      expect(() => calculate('')).toThrow();
      expect(() => calculate('   ')).toThrow();
      expect(() => calculate('\t')).toThrow();
      expect(() => calculate('\n')).toThrow();
    });
  });

  describe('Number Parsing Edge Cases', () => {
    test('should handle various decimal formats', () => {
      expect(calculate('1.0')).toBe(1);
      expect(calculate('0.5')).toBe(0.5);
      expect(calculate('123.456')).toBe(123.456);
    });

    test('should reject invalid number formats', () => {
      expect(() => calculate('1.')).toThrow();  // Incomplete decimal
      expect(() => calculate('.5')).toThrow();  // Leading dot not supported by grammar
      expect(() => calculate('1.2.3')).toThrow();  // Multiple dots
    });

    test('should handle large decimal numbers', () => {
      expect(calculate('999.999')).toBe(999.999);
      expect(calculate('0.0001')).toBe(0.0001);
      expect(calculate('1000000.123456')).toBe(1000000.123456);
    });
  });

  describe('Parser State and Recovery', () => {
    test('should handle each expression independently', () => {
      // Each call to calculate should start with a fresh parser state
      expect(calculate('1 + 2')).toBe(3);
      expect(calculate('5 - 3')).toBe(2);
      expect(calculate('10 + 10')).toBe(20);
    });

    test('should not be affected by previous invalid expressions', () => {
      // Even after a failed parse, the next valid expression should work
      expect(() => calculate('invalid')).toThrow();
      expect(calculate('2 + 2')).toBe(4);
      
      expect(() => calculate('1 +')).toThrow();
      expect(calculate('3 + 3')).toBe(6);
    });
  });

  describe('Parser Output Verification', () => {
    test('should always return numbers for valid expressions', () => {
      const expressions = [
        '1',
        '1 + 2',
        '10 - 5',
        '1 + 2 - 3',
        '5.5 + 4.5'
      ];

      expressions.forEach(expr => {
        const result = calculate(expr);
        expect(typeof result).toBe('number');
        expect(Number.isNaN(result)).toBe(false);
        expect(Number.isFinite(result)).toBe(true);
      });
    });
  });
});