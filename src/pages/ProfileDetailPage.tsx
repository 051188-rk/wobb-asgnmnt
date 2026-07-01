import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse, Platform } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { motion } from "framer-motion";
import { FiArrowRight, FiArrowLeft, FiPlus, FiCheck, FiBarChart2, FiTv, FiMessageSquare, FiHeart, FiEye, FiThumbsUp, FiUsers } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { useAppStore } from "@/store/useAppStore";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "instagram") as Platform;
  
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  const cacheProfile = useAppStore((state) => state.cacheProfile);
  const getCachedProfile = useAppStore((state) => state.getCachedProfile);
  const isSelected = useAppStore((state) => state.isProfileSelected(profileData?.data?.user_profile?.user_id || ""));
  const addProfileToList = useAppStore((state) => state.addProfileToList);
  const removeProfileFromList = useAppStore((state) => state.removeProfileFromList);

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
      if (data) {
        cacheProfile(username, data);
      }
      setProfileData(data);
      setLoaded(true);
    });
  }, [username, getCachedProfile, cacheProfile]);

  if (!username) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <p className="text-zinc-400">Invalid profile username specified.</p>
          <Link to="/" className="secondary-button">
            <FiArrowLeft size={16} /> Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full"
          />
          <p className="text-zinc-500 text-sm font-semibold animate-pulse">Loading profile data...</p>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <p className="text-zinc-400 font-medium">
            Could not find profile details for creator <span className="text-indigo-400">@{username}</span>
          </p>
          <Link to="/" className="secondary-button mt-2">
            <FiArrowLeft size={16} /> Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  const handleToggleList = () => {
    if (isSelected) {
      removeProfileFromList(user.user_id);
    } else {
      addProfileToList({
        user_id: user.user_id,
        username: user.username,
        fullname: user.fullname,
        picture: user.picture,
        followers: user.followers,
        platform: platform,
        is_verified: user.is_verified,
      });
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case "instagram":
        return <FaInstagram className="text-pink-500" size={18} />;
      case "youtube":
        return <FaYoutube className="text-red-500" size={18} />;
      case "tiktok":
        return <FaTiktok className="text-cyan-400" size={16} />;
      default:
        return null;
    }
  };

  return (
    <Layout title={user.fullname}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col items-start -mt-5"
      >
        <Link
          to="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 mb-8 inline-flex items-center gap-1.5 transition-colors font-medium"
        >
          <FiArrowLeft size={16} /> Back to discovery
        </Link>

        {/* Profile Card Main */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="w-full bg-zinc-900/30 border border-zinc-800/80 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center md:items-start text-left backdrop-blur-md relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

          {/* Picture */}
          <div className="relative flex-shrink-0">
            <motion.img
              src={user.picture}
              alt={user.fullname}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-zinc-800 object-cover shadow-xl"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            />
            <div className="absolute -bottom-2 -right-2 bg-zinc-950 p-1 rounded-full border border-zinc-800">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-zinc-900 text-sm">
                {getPlatformIcon()}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-1.5">
                  @{user.username}
                  <VerifiedBadge verified={user.is_verified} />
                </h2>
                <p className="text-sm text-zinc-400 mt-0.5">{user.fullname}</p>
                <div className="flex gap-2 items-center mt-2.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-zinc-850 border border-zinc-800 text-xs text-zinc-400 capitalize font-semibold flex items-center gap-1.5">
                    {platform === "youtube" ? "YouTube" : platform}
                  </span>
                  {user.is_business && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 font-semibold">
                      Business Account
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user.description && (
              <p className="mt-5 text-sm leading-relaxed text-zinc-300 border-t border-zinc-850/60 pt-4">
                {user.description}
              </p>
            )}

            {/* Profile Statistics Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Followers */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl hover:border-zinc-700/60 transition-all flex flex-col justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiUsers size={12} className="text-zinc-500" /> Followers
                </span>
                <span className="text-xl font-extrabold text-zinc-100 mt-2 block">
                  {formatFollowersDetail(user.followers)}
                </span>
              </div>

              {/* Engagement Rate */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl hover:border-zinc-700/60 transition-all flex flex-col justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiBarChart2 size={12} className="text-zinc-500" /> Eng. Rate
                </span>
                <span className="text-xl font-extrabold text-zinc-100 mt-2 block">
                  {formatEngagementRate(user.engagement_rate)}
                </span>
              </div>

              {/* Posts Count */}
              {user.posts_count !== undefined && (
                <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl hover:border-zinc-700/60 transition-all flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FiTv size={12} className="text-zinc-500" /> Posts
                  </span>
                  <span className="text-xl font-extrabold text-zinc-100 mt-2 block">
                    {user.posts_count}
                  </span>
                </div>
              )}

              {/* Engagements */}
              {user.engagements !== undefined && (
                <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl hover:border-zinc-700/60 transition-all flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FiHeart size={12} className="text-zinc-500" /> Engagements
                  </span>
                  <span className="text-xl font-extrabold text-zinc-100 mt-2 block">
                    {formatFollowersDetail(user.engagements)}
                  </span>
                </div>
              )}

              {/* Avg Likes */}
              {user.avg_likes !== undefined && (
                <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl hover:border-zinc-700/60 transition-all flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FiThumbsUp size={12} className="text-zinc-500" /> Avg Likes
                  </span>
                  <span className="text-xl font-extrabold text-zinc-100 mt-2 block">
                    {formatFollowersDetail(user.avg_likes)}
                  </span>
                </div>
              )}

              {/* Avg Views */}
              {user.avg_views !== undefined && user.avg_views > 0 && (
                <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl hover:border-zinc-700/60 transition-all flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FiEye size={12} className="text-zinc-500" /> Avg Views
                  </span>
                  <span className="text-xl font-extrabold text-zinc-100 mt-2 block">
                    {formatFollowersDetail(user.avg_views)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons Container */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-zinc-850/60 pt-6">
              {user.url && (
                <a
                  href={user.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  View Social Profile <FiArrowRight size={16} />
                </a>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleList}
                className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 cursor-pointer text-sm flex items-center justify-center gap-2 ${
                  isSelected
                    ? "bg-zinc-900 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/30 text-zinc-300 hover:text-red-400"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                }`}
              >
                {isSelected ? (
                  <>
                    <FiCheck size={16} />
                    Remove from List
                  </>
                ) : (
                  <>
                    <FiPlus size={16} />
                    Add to Campaign List
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
