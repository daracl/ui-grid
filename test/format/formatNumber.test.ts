import { formatNumber } from "../../src/format/formatNumber";

describe("number format check", () => {
  // 사용 예시

  it("money check check", () => {
    const result = formatNumber(1234567.89, "0,0.00 원"); // "1,234,567.89 원"
    expect("1,234,567.89 원").toEqual(result);
  });

  it("currency check", () => {
    const result = formatNumber(1234.5, "$0,0.00"); // "$1,234.5"
    expect("$1,234.5").toEqual(result);
  });

  it("percent check", () => {
    const result = formatNumber(0.9, "확률: 0.00%"); // "확률: 92.0%"
    expect("확률: 0.9%").toEqual(result);
  });
});
