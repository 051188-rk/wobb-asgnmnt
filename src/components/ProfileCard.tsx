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

  const getPlatformClass = () => {
    switch (platform) {
      case "instagram":
        return "bg-pink-500/15 border-pink-500/35 text-pink-400";
      case "youtube":
        return "bg-red-500/15 border-red-500/35 text-red-400";
      case "tiktok":
        return "bg-cyan-500/15 border-cyan-500/35 text-cyan-400";
      default:
        return "bg-zinc-800 border-zinc-700 text-zinc-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="p-5 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-2xl flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group cursor-pointer relative overflow-hidden backdrop-blur-sm w-full h-[230px]"
      data-search={searchQuery}
    >
      {/* Top Banner Sparkles or Gradients */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent group-hover:via-indigo-500/30 transition-all duration-500" />

      {/* Row 1: Platform & Avatar */}
      <div className="flex justify-between items-start">
        {/* Avatar */}
        <div className="relative">
          <motion.img
            src={profile.picture}
            alt={profile.fullname}
            className="w-14 h-14 rounded-full border-2 border-zinc-800 group-hover:border-indigo-500/40 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
          <div className="absolute -bottom-1 -right-1 bg-zinc-950 p-0.5 rounded-full border border-zinc-800">
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${getPlatformClass()}`}>
              {getPlatformIcon()}
            </span>
          </div>
        </div>

        {/* Selected List Action Button */}
        <motion.button
          onClick={handleToggleList}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
            isSelected
              ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 hover:content-['Remove']"
              : "bg-zinc-850 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100"
          }`}
          title={isSelected ? "Remove from list" : "Add to list"}
        >
          {isSelected ? (
            <>
              <FiCheck size={14} className="animate-scaleIn" />
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
        <h3 className="font-bold text-zinc-100 flex items-center gap-1 group-hover:text-indigo-400 transition-colors text-base truncate">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </h3>
        <p className="text-xs text-zinc-400 truncate mt-0.5">{profile.fullname}</p>
      </div>

      {/* Row 3: Follower Reach Stat */}
      <div className="border-t border-zinc-850/80 pt-3 mt-3 flex justify-between items-center text-[11px] text-zinc-500 font-medium">
        <span>Reach / Followers</span>
        <span className="text-indigo-400 font-bold text-sm">
          {formatFollowers(profile.followers)}
        </span>
      </div>
    </motion.div>
  );
}
