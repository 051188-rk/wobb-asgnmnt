import { useState, useEffect } from "react";
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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [platform]);

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
        className="text-zinc-400 mb-8 text-sm font-bold text-center uppercase tracking-wide -mt-5"
      >
        Discover top creators across social media networks.
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
        className="w-full flex justify-between items-center text-[10px] text-zinc-500 mb-6 font-bold uppercase tracking-wider border-b border-white/20 pb-3"
      >
        <span>
          Showing {filtered.length} of {allProfiles.length} on {platform}
        </span>
        <span className="text-zinc-500">
          Clicks: <span className="text-green-500 font-extrabold">{clickCount}</span>
        </span>
      </motion.div>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
        onProfileClick={handleProfileClick}
        isLoading={isLoading}
      />
    </Layout>
  );
}
