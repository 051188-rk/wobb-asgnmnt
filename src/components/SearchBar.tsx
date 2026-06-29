import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-2"
    >
      <FiSearch size={20} className="text-black" />
      <input
        className="border-2 border-black bg-white text-black placeholder-gray-500 p-3 w-80 rounded focus:outline-none focus:ring-2 focus:ring-black transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search influencers..."
      />
    </motion.div>
  );
}
