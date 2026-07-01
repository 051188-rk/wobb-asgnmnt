import { describe, test, expect } from "vitest";
import { formatFollowers, formatEngagementRate } from "./formatters";

describe("Formatter Utils", () => {
  describe("formatFollowers", () => {
    test("should format counts in millions with one decimal place", () => {
      expect(formatFollowers(1230000)).toBe("1.2M");
      expect(formatFollowers(98000000)).toBe("98.0M");
    });

    test("should format counts in thousands with one decimal place", () => {
      expect(formatFollowers(450000)).toBe("450.0K");
      expect(formatFollowers(1200)).toBe("1.2K");
    });

    test("should return original number string if count is less than 1000", () => {
      expect(formatFollowers(450)).toBe("450");
      expect(formatFollowers(0)).toBe("0");
    });
  });

  describe("formatEngagementRate", () => {
    test("should format decimal engagement rates into percentage formats", () => {
      expect(formatEngagementRate(0.01425)).toBe("1.43%");
      expect(formatEngagementRate(0.05731)).toBe("5.73%");
    });

    test("should return N/A if engagement rate is undefined", () => {
      expect(formatEngagementRate(undefined)).toBe("N/A");
    });
  });
});
