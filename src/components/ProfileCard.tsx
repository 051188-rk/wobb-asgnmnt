import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M followers";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K followers";
  return count + " followers";
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="flex items-center gap-3 p-4 border-2 border-black mb-3 cursor-pointer hover:bg-black hover:text-white w-[700px] transition-colors duration-200"
      data-search={searchQuery}
    >
      <motion.img
        src={profile.picture}
        className="w-12 h-12 rounded-full border border-black"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      />
      <div className="text-left flex-1">
        <div className="font-bold">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm">{profile.fullname}</div>
        <div className="text-sm">{formatFollowersLocal(profile.followers)}</div>
      </div>
      <motion.button
        disabled
        className="px-3 py-2 bg-black text-white text-sm rounded border border-black flex items-center gap-2 cursor-not-allowed opacity-50"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <FiPlus size={16} />
        Add
      </motion.button>
    </motion.div>
  );
}
