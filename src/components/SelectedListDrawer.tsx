import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTrash2, FiUsers, FiFileText, FiDownload, FiShare2, FiClipboard, FiCheck, FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp, FaTwitter } from "react-icons/fa";
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

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalFollowers = selectedProfiles.reduce((sum, p) => sum + p.followers, 0);

  const handleClose = () => {
    setShowExportMenu(false);
    onClose();
  };

  // 1. Copy plain text list
  const copyToClipboard = () => {
    let text = `Campaign Influencer List (Total Reach: ${formatFollowers(totalFollowers)}):\n`;
    selectedProfiles.forEach((p, idx) => {
      text += `${idx + 1}. @${p.username} (${p.platform.toUpperCase()}) - ${p.fullname} - ${formatFollowers(p.followers)} followers\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 2. Export as CSV
  const exportCSV = () => {
    const headers = "Username,Platform,Full Name,Followers\n";
    const rows = selectedProfiles.map(p => `"${p.username}","${p.platform}","${p.fullname}",${p.followers}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "campaign_influencers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Export as Plain Text Report (standard layout printable to PDF/Text)
  const exportTextReport = () => {
    let report = `====================================\n`;
    report += `        VIBECHECK CAMPAIGN REPORT   \n`;
    report += `====================================\n\n`;
    report += `Total Creators: ${selectedProfiles.length}\n`;
    report += `Total Reach: ${formatFollowers(totalFollowers)}\n\n`;
    report += `Influencer List:\n`;
    selectedProfiles.forEach((p, idx) => {
      report += `${idx + 1}. @${p.username} (${p.platform.toUpperCase()}) - ${p.fullname} - ${formatFollowers(p.followers)} followers\n`;
    });
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "campaign_report.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. Redirect / Share to WhatsApp
  const shareWhatsApp = () => {
    let text = `My Campaign Influencer List:\n`;
    selectedProfiles.forEach(p => {
      text += `- @${p.username} (${p.platform.toUpperCase()}) - ${formatFollowers(p.followers)} followers\n`;
    });
    text += `\nTotal Reach: ${formatFollowers(totalFollowers)}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // 5. Redirect / Share to Twitter (X)
  const shareTwitter = () => {
    let text = `Check out my campaign creators on vibecheck! Total Reach: ${formatFollowers(totalFollowers)} details: `;
    selectedProfiles.slice(0, 3).forEach(p => {
      text += `@${p.username} `;
    });
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // 6. Native Share API (opens native apps on mobile/desktop)
  const handleNativeShare = async () => {
    let text = `Campaign Creator List (Total Reach: ${formatFollowers(totalFollowers)}):\n`;
    selectedProfiles.forEach(p => {
      text += `@${p.username} (${p.platform.toUpperCase()})\n`;
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Campaign Influencers',
          text: text,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      copyToClipboard();
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
            onClick={handleClose}
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
                onClick={handleClose}
                className="p-2 border border-white hover:bg-white text-white hover:text-black transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto p-6 relative bg-black">
              <AnimatePresence mode="wait">
                {showExportMenu ? (
                  /* Export Options View */
                  <motion.div
                    key="export-menu"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <button
                      onClick={() => setShowExportMenu(false)}
                      className="text-xs text-zinc-400 hover:text-white uppercase font-bold flex items-center gap-2 mb-4 border border-zinc-800 p-2 cursor-pointer transition-colors"
                    >
                      <FiArrowLeft size={14} /> Back to list
                    </button>

                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/20 pb-2">
                      Choose Export Format
                    </h4>

                    <div className="grid grid-cols-1 gap-3">
                      {/* 1. Copy Clipboard */}
                      <button
                        onClick={copyToClipboard}
                        className="p-4 border border-white hover:border-green-500 hover:bg-zinc-950 flex items-center justify-between text-left cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <FiClipboard className="text-white group-hover:text-green-500" size={18} />
                          <div>
                            <span className="font-bold text-xs uppercase text-white block">Copy Raw Text</span>
                            <span className="text-[10px] text-zinc-500">Copy handles to clipboard</span>
                          </div>
                        </div>
                        {copied ? <FiCheck size={18} className="text-green-500 animate-scaleIn" /> : null}
                      </button>

                      {/* 2. Download CSV */}
                      <button
                        onClick={exportCSV}
                        className="p-4 border border-white hover:border-green-500 hover:bg-zinc-950 flex items-center justify-between text-left cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <FiFileText className="text-white group-hover:text-green-500" size={18} />
                          <div>
                            <span className="font-bold text-xs uppercase text-white block">Download CSV</span>
                            <span className="text-[10px] text-zinc-500">Open in spreadsheet editors</span>
                          </div>
                        </div>
                        <FiDownload size={16} className="text-zinc-500" />
                      </button>

                      {/* 3. Export PDF/Report */}
                      <button
                        onClick={exportTextReport}
                        className="p-4 border border-white hover:border-green-500 hover:bg-zinc-950 flex items-center justify-between text-left cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <FiDownload className="text-white group-hover:text-green-500" size={18} />
                          <div>
                            <span className="font-bold text-xs uppercase text-white block">Download Report (PDF/TXT)</span>
                            <span className="text-[10px] text-zinc-500">Save structured reach document</span>
                          </div>
                        </div>
                        <FiDownload size={16} className="text-zinc-500" />
                      </button>

                      {/* 4. Native share sheet */}
                      <button
                        onClick={handleNativeShare}
                        className="p-4 border border-white hover:border-green-500 hover:bg-zinc-950 flex items-center justify-between text-left cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <FiShare2 className="text-white group-hover:text-green-500" size={18} />
                          <div>
                            <span className="font-bold text-xs uppercase text-white block">System Share</span>
                            <span className="text-[10px] text-zinc-500">Send to Slack, Mail, Messages</span>
                          </div>
                        </div>
                        <FiShare2 size={16} className="text-zinc-500" />
                      </button>
                    </div>

                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/20 pb-2 pt-4">
                      Share / Redirect to App
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      {/* WhatsApp */}
                      <button
                        onClick={shareWhatsApp}
                        className="p-3 border border-white hover:border-green-500 hover:bg-green-950/20 text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <FaWhatsapp size={18} className="text-green-500" />
                        <span className="font-bold text-[10px] uppercase">WhatsApp</span>
                      </button>

                      {/* Twitter / X */}
                      <button
                        onClick={shareTwitter}
                        className="p-3 border border-white hover:border-green-500 hover:bg-zinc-900 text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <FaTwitter size={16} className="text-white" />
                        <span className="font-bold text-[10px] uppercase">X (Twitter)</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Standard Selections List View */
                  <motion.div
                    key="selections-list"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {selectedProfiles.length === 0 ? (
                      /* Empty State */
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
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
                  </motion.div>
                )}
              </AnimatePresence>
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
                      if (showExportMenu) {
                        setShowExportMenu(false);
                      } else {
                        setShowExportMenu(true);
                      }
                    }}
                    className="custom-button !bg-green-500 !border-green-500 hover:!bg-green-600"
                  >
                    {showExportMenu ? "Show List" : "Export List"}
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
