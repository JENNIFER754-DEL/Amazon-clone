import { formatCurrency } from "../../scripts/utils/money.js";

describe('test suite: format currency', () => {
  it('convert cents into dollars', () => {
    expect(formatCurrency(2095)).toEqual('20.95');
  });

  it('works with 0', () => {
    expect(formatCurrency(0)).toEqual('0.00');
  });

  it('rounds up to the nearest test', () => {
    expect(formatCurrency(2000.5)).toEqual('20.01');
  });

  // Additional tests below

  it('formats negative cent values correctly', () => {
    expect(formatCurrency(-500)).toEqual('-5.00');
  });

  it('formats very large cent values correctly', () => {
    expect(formatCurrency(123456789)).toEqual('1234567.89');
  });

  it('handles non-integer cent values by rounding correctly', () => {
    expect(formatCurrency(1999.99)).toEqual('20.00');
  });
});
