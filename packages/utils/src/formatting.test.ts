import { formatCurrency, truncate } from './formatting';

describe('formatCurrency', () => {
  it('formats cents as USD by default', () => {
    expect(formatCurrency(1999)).toBe('$19.99');
  });
});

describe('truncate', () => {
  it('leaves short strings untouched', () => {
    expect(truncate('hi', 10)).toBe('hi');
  });

  it('truncates long strings with an ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('hell…');
  });
});
