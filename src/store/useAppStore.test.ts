import { describe, test, expect, beforeEach } from "vitest";
import { useAppStore } from "./useAppStore";
import type { SelectedProfile } from "@/types";

const mockProfile: SelectedProfile = {
  user_id: "1",
  username: "mrbeast",
  fullname: "Jimmy Donaldson",
  picture: "pic.jpg",
  followers: 92000000,
  platform: "instagram",
  is_verified: true,
};

describe("Zustand App Store", () => {
  beforeEach(() => {
    // Reset selection list and click metrics before each test run
    useAppStore.getState().clearSelectedProfiles();
    useAppStore.getState().resetClickCount();
  });

  test("should start with an empty selected profiles array", () => {
    expect(useAppStore.getState().selectedProfiles).toEqual([]);
  });

  test("should add profile to selection list and check validation states", () => {
    const store = useAppStore.getState();
    store.addProfileToList(mockProfile);

    expect(useAppStore.getState().selectedProfiles).toHaveLength(1);
    expect(useAppStore.getState().selectedProfiles[0]).toEqual(mockProfile);
    expect(useAppStore.getState().isProfileSelected("1")).toBe(true);
  });

  test("should prevent duplicate entries with same user_id in selected list", () => {
    const store = useAppStore.getState();
    store.addProfileToList(mockProfile);
    store.addProfileToList(mockProfile); // Add it again

    expect(useAppStore.getState().selectedProfiles).toHaveLength(1);
  });

  test("should remove profile from list successfully", () => {
    const store = useAppStore.getState();
    store.addProfileToList(mockProfile);
    expect(useAppStore.getState().isProfileSelected("1")).toBe(true);

    useAppStore.getState().removeProfileFromList("1");
    expect(useAppStore.getState().selectedProfiles).toHaveLength(0);
    expect(useAppStore.getState().isProfileSelected("1")).toBe(false);
  });

  test("should increment click count", () => {
    expect(useAppStore.getState().clickCount).toBe(0);
    useAppStore.getState().incrementClickCount();
    expect(useAppStore.getState().clickCount).toBe(1);
  });
});
