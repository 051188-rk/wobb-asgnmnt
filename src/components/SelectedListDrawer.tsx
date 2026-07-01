import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTrash2, FiUsers } from "react-icons/fi";
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
            className="fixed inset-0 bg-black/80 z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-black border-l border-white z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white flex justify-between items-center bg-black">
              <div>
                <h3 className="text-lg font-extrabold text-white uppercase flex items-center gap-2">
                  <FiUsers className="text-green-500" />
                  Campaign List
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-semibold">
                  {selectedProfiles.length} {selectedProfiles.length === 1 ? "creator" : "creators"} selected
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 border border-white hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black">
              {selectedProfiles.length === 0 ? (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 border border-white flex items-center justify-center text-white shadow-inner">
                    <FiUsers size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase">No creators selected</h4>
                    <p className="text-xs text-zinc-500 max-w-[250px] mx-auto mt-2">
                      Add profiles to build your campaign list.
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-3 bg-black border border-white flex items-center gap-4 group"
                    >
                      {/* Avatar */}
                      <img
                        src={profile.picture}
                        alt={profile.fullname}
                        className="w-10 h-10 border border-white flex-shrink-0 object-cover"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate">
                            @{profile.username}
                          </span>
                          <span className="px-1.5 py-0.5 text-[9px] border border-white text-white uppercase font-bold">
                            {profile.platform}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">{profile.fullname}</p>
                        <p className="text-xs font-bold text-green-500 mt-1">
                          {formatFollowers(profile.followers)} followers
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeProfileFromList(profile.user_id)}
                        className="p-2 border border-white hover:border-red-500 text-white hover:text-red-500 hover:bg-red-950/20 transition-all cursor-pointer"
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
              <div className="p-6 border-t border-white bg-black space-y-4">
                {/* Statistics */}
                <div className="space-y-2 border border-white p-4">
                  <div className="flex justify-between text-xs text-zinc-400 font-bold uppercase">
                    <span>Selected Profiles</span>
                    <span className="font-extrabold text-white">{selectedProfiles.length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 font-bold uppercase pt-1">
                    <span>Total Combined Reach</span>
                    <span className="font-extrabold text-green-500">{formatFollowers(totalFollowers)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={clearSelectedProfiles}
                    className="secondary-button"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => {
                      alert(`Exporting ${selectedProfiles.length} profiles to campaign export (Reach: ${formatFollowers(totalFollowers)})...`);
                    }}
                    className="custom-button !bg-green-500 !border-green-500 hover:!bg-green-600"
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
