import { describe, test, expect } from "vitest";
import { filterProfiles } from "./dataHelpers";
import type { UserProfileSummary } from "@/types";

const mockProfiles: UserProfileSummary[] = [
  {
    user_id: "1",
    username: "mrbeast",
    fullname: "Jimmy Donaldson",
    picture: "",
    url: "",
    is_verified: true,
    followers: 90000000,
  },
  {
    user_id: "2",
    username: "Cristiano",
    fullname: "Cristiano Ronaldo",
    picture: "",
    url: "",
    is_verified: true,
    followers: 500000000,
  },
  {
    user_id: "3",
    username: "khaby.lame",
    fullname: "Khaby Lame",
    picture: "",
    url: "",
    is_verified: false,
    followers: 160000000,
  }
];

describe("Data Helpers", () => {
  describe("filterProfiles", () => {
    test("should return all profiles when search query is empty", () => {
      expect(filterProfiles(mockProfiles, "")).toEqual(mockProfiles);
    });

    test("should filter case-insensitively by username", () => {
      const result = filterProfiles(mockProfiles, "cristiano");
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe("Cristiano");
    });

    test("should filter case-insensitively by fullname", () => {
      const result = filterProfiles(mockProfiles, "jimmy");
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe("mrbeast");
    });

    test("should return empty array if no match is found", () => {
      const result = filterProfiles(mockProfiles, "nonexistent");
      expect(result).toHaveLength(0);
    });
  });
});
