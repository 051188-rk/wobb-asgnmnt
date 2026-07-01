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
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-zinc-400 mb-8 text-sm font-medium -mt-5"
      >
        Browse and discover top creators across social media networks.
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="w-full flex justify-between items-center text-xs text-zinc-500 mb-6 font-semibold uppercase tracking-wider border-b border-zinc-900 pb-3"
      >
        <span>
          Showing {filtered.length} of {allProfiles.length} on {platform}
        </span>
        <span className="text-zinc-600 normal-case">
          Clicks: {clickCount}
        </span>
      </motion.div>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}
