import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { motion } from "framer-motion";
import { FiPlus, FiCheck } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { useAppStore } from "@/store/useAppStore";
import { formatFollowers } from "@/utils/formatters";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const isSelected = useAppStore((state) => state.isProfileSelected(profile.user_id));
  const addProfileToList = useAppStore((state) => state.addProfileToList);
  const removeProfileFromList = useAppStore((state) => state.removeProfileFromList);

  const handleClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation click
    if (isSelected) {
      removeProfileFromList(profile.user_id);
    } else {
      addProfileToList({
        user_id: profile.user_id,
        username: profile.username,
        fullname: profile.fullname,
        picture: profile.picture,
        followers: profile.followers,
        platform: platform,
        is_verified: profile.is_verified,
      });
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case "instagram":
        return <FaInstagram size={14} />;
      case "youtube":
        return <FaYoutube size={14} />;
      case "tiktok":
        return <FaTiktok size={12} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="p-5 bg-black border border-white hover:border-green-500 flex flex-col justify-between transition-all duration-200 group cursor-pointer relative w-full h-[230px]"
      data-search={searchQuery}
    >
      {/* Row 1: Platform & Avatar */}
      <div className="flex justify-between items-start">
        {/* Avatar */}
        <div className="relative">
          <img
            src={profile.picture}
            alt={profile.fullname}
            className="w-14 h-14 border border-white object-cover"
          />
          <div className="absolute -bottom-1 -right-1 bg-black p-0.5 border border-white">
            <span className="h-5 w-5 flex items-center justify-center text-[10px] text-white">
              {getPlatformIcon()}
            </span>
          </div>
        </div>

        {/* Selected List Action Button */}
        <motion.button
          onClick={handleToggleList}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold border transition-all duration-150 cursor-pointer ${
            isSelected
              ? "bg-green-500 border-green-500 text-black font-extrabold hover:bg-red-500 hover:border-red-500 hover:text-black"
              : "bg-black border-white text-white hover:bg-white hover:text-black"
          }`}
          title={isSelected ? "Remove from list" : "Add to list"}
        >
          {isSelected ? (
            <>
              <FiCheck size={14} />
              <span>Added</span>
            </>
          ) : (
            <>
              <FiPlus size={14} />
              <span>Add</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Row 2: Names and Info */}
      <div className="text-left mt-3">
        <h3 className="font-bold text-white flex items-center gap-1 group-hover:text-green-500 transition-colors text-base truncate">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </h3>
        <p className="text-xs text-zinc-400 truncate mt-0.5">{profile.fullname}</p>
      </div>

      {/* Row 3: Follower Reach Stat */}
      <div className="border-t border-white/20 pt-3 mt-3 flex justify-between items-center text-[11px] text-zinc-500 font-bold uppercase">
        <span>Reach</span>
        <span className="text-green-500 font-extrabold text-sm">
          {formatFollowers(profile.followers)}
        </span>
      </div>
    </motion.div>
  );
}
