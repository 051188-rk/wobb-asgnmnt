import { create } from 'zustand';
import type { Platform, UserProfileSummary, ProfileDetailResponse } from '@/types';

interface SelectedProfile {
  user_id: string;
  username: string;
  platform: Platform;
}

interface AppStore {
  // Search state
  platform: Platform;
  searchQuery: string;
  clickCount: number;

  // Selected profiles (for list feature)
  selectedProfiles: SelectedProfile[];

  // Profile data cache
  profileCache: Record<string, ProfileDetailResponse>;

  // Actions
  setPlatform: (platform: Platform) => void;
  setSearchQuery: (query: string) => void;
  incrementClickCount: () => void;
  resetClickCount: () => void;
  
  // Selected profiles actions
  addProfileToList: (profile: SelectedProfile) => void;
  removeProfileFromList: (userId: string) => void;
  isProfileSelected: (userId: string) => boolean;
  clearSelectedProfiles: () => void;
  getSelectedProfiles: () => SelectedProfile[];

  // Profile cache actions
  cacheProfile: (username: string, data: ProfileDetailResponse) => void;
  getCachedProfile: (username: string) => ProfileDetailResponse | undefined;
  clearProfileCache: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  platform: 'instagram',
  searchQuery: '',
  clickCount: 0,
  selectedProfiles: [],
  profileCache: {},

  // Platform management
  setPlatform: (platform: Platform) => set({ platform }),
  
  // Search management
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  
  // Click tracking
  incrementClickCount: () => set((state) => ({ clickCount: state.clickCount + 1 })),
  resetClickCount: () => set({ clickCount: 0 }),
  
  // Selected profiles management
  addProfileToList: (profile: SelectedProfile) =>
    set((state) => ({
      selectedProfiles: [
        ...state.selectedProfiles.filter((p) => p.user_id !== profile.user_id),
        profile,
      ],
    })),
  
  removeProfileFromList: (userId: string) =>
    set((state) => ({
      selectedProfiles: state.selectedProfiles.filter((p) => p.user_id !== userId),
    })),
  
  isProfileSelected: (userId: string) => {
    const state = get();
    return state.selectedProfiles.some((p) => p.user_id === userId);
  },
  
  clearSelectedProfiles: () => set({ selectedProfiles: [] }),
  
  getSelectedProfiles: () => get().selectedProfiles,
  
  // Profile cache management
  cacheProfile: (username: string, data: ProfileDetailResponse) =>
    set((state) => ({
      profileCache: {
        ...state.profileCache,
        [username]: data,
      },
    })),
  
  getCachedProfile: (username: string) => {
    const state = get();
    return state.profileCache[username];
  },
  
  clearProfileCache: () => set({ profileCache: {} }),
}));
