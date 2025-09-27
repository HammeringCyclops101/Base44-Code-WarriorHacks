
import React, { useState, useEffect } from "react";
import { User, UserStats, UserProgress } from "@/entities/all";
import { Trophy, Target, Zap, Calendar, Code } from "lucide-react";

import ProfileHeader from "../components/profile/ProfileHeader";
import StatsGrid from "../components/profile/StatsGrid";
import ActivityChart from "../components/profile/ActivityChart";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [recentProgress, setRecentProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const [statsData, progressData] = await Promise.all([
        UserStats.filter({ user_email: user.email }),
        UserProgress.filter({ user_email: user.email }, '-updated_date', 50)
      ]);
      
      if (statsData.length > 0) {
        setUserStats(statsData[0]);
      }
      setRecentProgress(progressData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader 
          user={currentUser}
          stats={userStats}
        />

        {/* Stats Grid */}
        {userStats && (
          <StatsGrid 
            stats={userStats}
            recentProgress={recentProgress}
          />
        )}

        {/* Activity Chart */}
        <ActivityChart 
          progress={recentProgress}
        />
      </div>
    </div>
  );
}
