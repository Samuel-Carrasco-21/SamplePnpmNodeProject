import { operateNumbers } from '../../src/utils/calculator';

describe('operateNumbers', () => {
  it('adds two numbers', () => {
    expect(operateNumbers(5, 3, '+')).toBe(8);
  });

  it('subtracts two numbers', () => {
    expect(operateNumbers(5, 3, '-')).toBe(2);
  });

  it('multiplies two numbers', () => {
    expect(operateNumbers(5, 3, '*')).toBe(15);
  });

  it('divides two numbers', () => {
    expect(operateNumbers(6, 3, '/')).toBe(2);
  });

  it('returns 0 for an invalid operation', () => {
    expect(() => operateNumbers(6, 3, '%')).toThrow('Invalid operation');
  });
});
