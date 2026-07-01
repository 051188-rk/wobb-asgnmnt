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
    <div className="flex flex-col min-h-screen w-full text-white bg-black">
      {/* Premium Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 w-full border-b border-white bg-black px-6 py-4 flex justify-between items-center"
      >
        <Link
          to="/"
          className="text-lg text-white flex items-center gap-2 hover:text-green-500 transition-colors"
        >
          <div className="flex items-baseline leading-none select-none">
            <span className="cursive-brand text-4xl text-green-500 lowercase">vibe</span>
            <span className="font-extrabold uppercase tracking-widest text-xl ml-0.5 text-white">check</span>
          </div>
        </Link>

        {/* View List Toggle Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-900 border border-white text-sm font-semibold transition-all duration-200 group cursor-pointer"
        >
          <FiUsers className="text-white group-hover:text-green-500 transition-colors" size={18} />
          <span className="hidden sm:inline">Saved List</span>
          {selectedCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center bg-green-500 px-1.5 text-[10px] font-extrabold text-black border border-black">
              {selectedCount}
            </span>
          )}
        </button>
      </motion.header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase border-b border-white pb-4 inline-block">
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
