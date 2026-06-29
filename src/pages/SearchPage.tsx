import { useEffect } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export function SearchPage() {
  const platform = useAppStore((state) => state.platform);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const clickCount = useAppStore((state) => state.clickCount);
  
  const setPlatform = useAppStore((state) => state.setPlatform);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const incrementClickCount = useAppStore((state) => state.incrementClickCount);

  const allProfiles = extractProfiles(platform);
  const filtered = filterProfiles(allProfiles, searchQuery);

  const handleProfileClick = (username: string) => {
    incrementClickCount();
    console.log("Clicked profile:", username, "total clicks:", clickCount + 1);
  };

  return (
    <Layout title="Find Influencers">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="text-black mb-6 text-sm font-medium"
      >
        Browse top creators across social platforms
      </motion.p>

      <PlatformFilter
        selected={platform}
        onChange={(p) => {
          setPlatform(p);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="text-xs text-black mb-4 font-medium"
      >
        Showing {filtered.length} of {allProfiles.length} on {platform}
      </motion.p>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}
