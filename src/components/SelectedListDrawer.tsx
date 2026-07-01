import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTrash2, FiUsers } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { useAppStore } from "@/store/useAppStore";
import { formatFollowers } from "@/utils/formatters";
import type { Platform } from "@/types";

interface SelectedListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SelectedListDrawer({ isOpen, onClose }: SelectedListDrawerProps) {
  const selectedProfiles = useAppStore((state) => state.selectedProfiles);
  const removeProfileFromList = useAppStore((state) => state.removeProfileFromList);
  const clearSelectedProfiles = useAppStore((state) => state.clearSelectedProfiles);

  const totalFollowers = selectedProfiles.reduce((sum, p) => sum + p.followers, 0);

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "instagram":
        return <FaInstagram className="text-pink-500" />;
      case "youtube":
        return <FaYoutube className="text-red-500" />;
      case "tiktok":
        return <FaTiktok className="text-cyan-400" />;
      default:
        return null;
    }
  };

  const getPlatformBg = (platform: Platform) => {
    switch (platform) {
      case "instagram":
        return "bg-pink-500/10 border-pink-500/20 text-pink-400";
      case "youtube":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      case "tiktok":
        return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
      default:
        return "bg-zinc-800 border-zinc-700 text-zinc-300";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-zinc-950/95 border-l border-zinc-800 shadow-2xl z-50 flex flex-col backdrop-blur-md"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/40">
              <div>
                <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                  <FiUsers className="text-indigo-400" />
                  Campaign List
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {selectedProfiles.length} {selectedProfiles.length === 1 ? "influencer" : "influencers"} selected
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
                aria-label="Close drawer"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedProfiles.length === 0 ? (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shadow-inner">
                    <FiUsers size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-300">No influencers selected</h4>
                    <p className="text-xs text-zinc-500 max-w-[250px] mx-auto mt-1">
                      Browse and add profiles to build your campaign list.
                    </p>
                  </div>
                </div>
              ) : (
                /* Profiles List */
                <div className="space-y-3">
                  {selectedProfiles.map((profile) => (
                    <motion.div
                      key={profile.user_id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3 bg-zinc-900/50 border border-zinc-800/80 rounded-xl flex items-center gap-3 hover:border-zinc-700/60 transition-colors group relative overflow-hidden"
                    >
                      {/* Avatar */}
                      <img
                        src={profile.picture}
                        alt={profile.fullname}
                        className="w-10 h-10 rounded-full border border-zinc-800 flex-shrink-0 object-cover"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-zinc-100 truncate">
                            @{profile.username}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] border flex items-center gap-1 font-medium capitalize ${getPlatformBg(profile.platform)}`}>
                            {getPlatformIcon(profile.platform)}
                            {profile.platform === "youtube" ? "YouTube" : profile.platform}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate">{profile.fullname}</p>
                        <p className="text-[11px] font-medium text-indigo-400 mt-0.5">
                          {formatFollowers(profile.followers)} followers
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeProfileFromList(profile.user_id)}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200"
                        title="Remove from list"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary & Actions */}
            {selectedProfiles.length > 0 && (
              <div className="p-6 border-t border-zinc-800 bg-zinc-900/40 space-y-4">
                {/* Statistics */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Selected Profiles</span>
                    <span className="font-semibold text-zinc-200">{selectedProfiles.length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Total Combined Reach</span>
                    <span className="font-semibold text-indigo-400">{formatFollowers(totalFollowers)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={clearSelectedProfiles}
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 rounded-xl text-xs font-semibold transition-all duration-200"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {
                      alert(`Exporting ${selectedProfiles.length} profiles to campaign export (Reach: ${formatFollowers(totalFollowers)})...`);
                    }}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/20"
                  >
                    Export List
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
