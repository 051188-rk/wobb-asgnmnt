import { MdVerified } from 'react-icons/md';
import { motion } from 'framer-motion';

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex align-middle ml-1"
      title="Verified Account"
    >
      <MdVerified size={16} className="text-sky-400" />
    </motion.span>
  );
}
