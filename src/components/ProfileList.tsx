import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        {profiles.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
          >
            <div className="w-16 h-16 border border-white flex items-center justify-center text-white">
              <FiSearch size={26} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase">No creators found</h3>
              <p className="text-xs text-zinc-400 max-w-[280px] mt-2">
                We couldn't find any profiles matching your search or filters. Try adjusting your search query.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full"
          >
            {profiles.map((profile, idx) => (
              <motion.div
                key={profile.user_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(idx * 0.04, 0.4), duration: 0.3 }}
                className="flex justify-center"
              >
                <ProfileCard
                  profile={profile}
                  platform={platform}
                  searchQuery={searchQuery}
                  onProfileClick={onProfileClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
