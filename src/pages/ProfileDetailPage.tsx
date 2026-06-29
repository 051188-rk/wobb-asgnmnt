import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { motion } from "framer-motion";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useAppStore } from "@/store/useAppStore";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);

  const cacheProfile = useAppStore((state) => state.cacheProfile);
  const getCachedProfile = useAppStore((state) => state.getCachedProfile);

  useEffect(() => {
    if (!username) return;

    // Check if profile is cached
    const cached = getCachedProfile(username);
    if (cached) {
      setProfileData(cached);
      setLoaded(true);
      return;
    }

    // Load profile and cache it
    loadProfileByUsername(username).then((data) => {
      cacheProfile(username, data);
      setProfileData(data);
      setLoaded(true);
    });
  }, [username, getCachedProfile, cacheProfile]);

  if (!username) {
    return (
      <Layout>
        <p className="text-black">Invalid profile</p>
        <Link to="/" className="text-black underline flex items-center gap-1 mt-2">
          <FiArrowLeft size={16} /> Back
        </Link>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-black font-medium"
        >
          Loading...
        </motion.p>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-black mb-4 font-medium">
          Could not load profile details for {username}
        </p>
        <Link to="/" className="text-black underline flex items-center gap-1">
          <FiArrowLeft size={16} /> Back to search
        </Link>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  return (
    <Layout title={user.fullname}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/"
          className="text-sm text-black mb-6 inline-flex items-center gap-1 hover:opacity-70 transition-opacity font-medium"
        >
          <FiArrowLeft size={16} /> Back to search
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex gap-6 items-start text-left max-w-2xl mx-auto border-2 border-black p-6 rounded"
        >
          <motion.img
            src={user.picture}
            className="w-24 h-24 rounded-full border-2 border-black flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-black">
              @{user.username}
              <VerifiedBadge verified={user.is_verified} />
            </h2>
            <p className="text-black text-sm mt-1">{user.fullname}</p>
            <p className="text-xs text-black mt-1 font-medium">Platform: {platform}</p>

            {user.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-4 text-sm text-black"
              >
                {user.description}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="mt-6 grid grid-cols-2 gap-3 text-sm"
            >
              <div className="border-2 border-black p-3 rounded bg-white hover:bg-black hover:text-white transition-all">
                <div className="text-black text-xs font-medium">Followers</div>
                <div className="font-bold text-lg">
                  {formatFollowersDetail(user.followers)}
                </div>
              </div>
              <div className="border-2 border-black p-3 rounded bg-white hover:bg-black hover:text-white transition-all">
                <div className="text-black text-xs font-medium">Engagement Rate</div>
                <div className="font-bold text-lg">
                  {user.engagement_rate !== undefined
                    ? (user.engagement_rate * 10000).toFixed(2) + "%"
                    : "N/A"}
                </div>
              </div>
              {user.posts_count !== undefined && (
                <div className="border-2 border-black p-3 rounded bg-white hover:bg-black hover:text-white transition-all">
                  <div className="text-black text-xs font-medium">Posts</div>
                  <div className="font-bold text-lg">{user.posts_count}</div>
                </div>
              )}
              {user.avg_likes !== undefined && (
                <div className="border-2 border-black p-3 rounded bg-white hover:bg-black hover:text-white transition-all">
                  <div className="text-black text-xs font-medium">Avg Likes</div>
                  <div className="font-bold text-lg">
                    {formatFollowersDetail(user.avg_likes)}
                  </div>
                </div>
              )}
              {user.avg_comments !== undefined && (
                <div className="border-2 border-black p-3 rounded bg-white hover:bg-black hover:text-white transition-all">
                  <div className="text-black text-xs font-medium">Avg Comments</div>
                  <div className="font-bold text-lg">{user.avg_comments}</div>
                </div>
              )}
              {user.avg_views !== undefined && user.avg_views > 0 && (
                <div className="border-2 border-black p-3 rounded bg-white hover:bg-black hover:text-white transition-all">
                  <div className="text-black text-xs font-medium">Avg Views</div>
                  <div className="font-bold text-lg">
                    {formatFollowersDetail(user.avg_views)}
                  </div>
                </div>
              )}
              {user.engagements !== undefined && (
                <div className="border-2 border-black p-3 rounded bg-white hover:bg-black hover:text-white transition-all">
                  <div className="text-black text-xs font-medium">Engagements</div>
                  <div className="font-bold text-lg">
                    {formatEngagementRate(user.engagement_rate)}
                  </div>
                </div>
              )}
            </motion.div>

            {user.url && (
              <motion.a
                href={user.url}
                target="_blank"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-black text-white rounded border-2 border-black hover:bg-white hover:text-black transition-all font-medium"
              >
                View on platform <FiArrowRight size={16} />
              </motion.a>
            )}

            <motion.button
              disabled
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="block mt-4 px-4 py-2 bg-black text-white rounded border-2 border-black cursor-not-allowed opacity-50 font-medium"
            >
              Add to List
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
