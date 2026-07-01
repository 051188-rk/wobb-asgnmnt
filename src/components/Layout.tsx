import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiUsers } from "react-icons/fi";
import { useAppStore } from "@/store/useAppStore";
import { SelectedListDrawer } from "./SelectedListDrawer";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selectedCount = useAppStore((state) => state.selectedProfiles.length);

  return (
    <div className="flex flex-col min-h-screen w-full text-zinc-200 bg-zinc-950">
      {/* Premium Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex justify-between items-center"
      >
        <Link
          to="/"
          className="text-lg font-bold text-zinc-100 flex items-center gap-2 hover:text-indigo-400 transition-colors"
        >
          <FiHome size={20} className="text-indigo-500" />
          <span>VibeInflux</span>
        </Link>

        {/* View List Toggle Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-sm font-medium transition-all duration-200 group cursor-pointer"
        >
          <FiUsers className="text-zinc-400 group-hover:text-indigo-400 transition-colors" size={18} />
          <span className="hidden sm:inline">Saved List</span>
          {selectedCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white ring-2 ring-zinc-900">
              {selectedCount}
            </span>
          )}
        </button>
      </motion.header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        {title && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-8 text-left"
          >
            <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
              {title}
            </h1>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Drawer */}
      <SelectedListDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
