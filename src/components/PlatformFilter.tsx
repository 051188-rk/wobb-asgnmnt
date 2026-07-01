import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { motion } from "framer-motion";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "instagram":
        return <FaInstagram size={16} />;
      case "youtube":
        return <FaYoutube size={16} />;
      case "tiktok":
        return <FaTiktok size={14} />;
      default:
        return null;
    }
  };

  const getPlatformClass = (platform: Platform) => {
    if (selected === platform) {
      return "bg-green-500 text-black border-green-500 font-extrabold";
    }
    return "bg-black border-white text-white hover:bg-zinc-900";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 w-full flex flex-col items-center gap-6"
    >
      {/* Platform Buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        {PLATFORMS.map((p, idx) => (
          <motion.button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-5 py-2.5 font-bold text-sm border uppercase flex items-center gap-2 transition-all duration-200 cursor-pointer ${getPlatformClass(p)}`}
          >
            {getPlatformIcon(p)}
            <span>{getPlatformLabel(p)}</span>
          </motion.button>
        ))}
      </div>

      {/* Search Input */}
      <div className="w-full max-w-md relative flex items-center">
        <FiSearch className="absolute left-4 text-zinc-500" size={18} />
        <motion.input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name..."
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="w-full pl-11 pr-4 py-3 bg-black border border-white focus:border-green-500 focus:ring-0 text-white placeholder-zinc-500 focus:outline-none transition-all duration-200"
        />
      </div>
    </motion.div>
  );
}
