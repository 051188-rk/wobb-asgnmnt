import { MdVerified } from 'react-icons/md';
import { motion } from 'framer-motion';

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="ml-1 inline-flex"
    >
      <MdVerified size={16} className="text-blue-600" />
    </motion.span>
  );
}
