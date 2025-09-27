
import React, { useState, useEffect } from "react";
import { LearningPath, UserStats, UserProgress, User } from "@/entities/all";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BookOpen, 
  Trophy, 
  Zap, 
  ArrowRight,
  Code2,
  Gamepad2,
  Brain,
  Target,
  Clock,
  Star
} from "lucide-react";

import PathCard from "../components/dashboard/PathCard";
import StatsOverview from "../components/dashboard/StatsOverview";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function Dashboard() {
  const [paths, setPaths] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const [pathsData, progressData] = await Promise.all([
        LearningPath.list('order'),
        UserProgress.filter({ user_email: user.email }, '-updated_date', 10)
      ]);
      
      setPaths(pathsData);
      setUserProgress(progressData);
      
      // Get or create user stats
      const statsData = await UserStats.filter({ user_email: user.email });
      if (statsData.length > 0) {
        setUserStats(statsData[0]);
      } else {
        const newStats = await UserStats.create({ user_email: user.email });
        setUserStats(newStats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pathIcons = {
    competitive_programming: Code2,
    game_development: Gamepad2,
    ai_ml: Brain
  };

  const divisionColors = {
    bronze: "from-amber-600 to-amber-700",
    silver: "from-gray-400 to-gray-500", 
    gold: "from-yellow-400 to-yellow-600",
    platinum: "from-blue-400 to-indigo-500"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {currentUser?.full_name?.split(' ')[0] || 'Coder'}
              </h1>
              <p className="text-gray-400 mt-1">Ready to level up your skills?</p>
            </div>
            
            {userStats && (
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 bg-gradient-to-r ${divisionColors[userStats.division]} text-white rounded-full flex items-center gap-2`}>
                  <Trophy className="w-4 h-4" />
                  <span className="font-semibold capitalize">{userStats.division}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{userStats.total_points}</p>
                  <p className="text-sm text-gray-400">points</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        {userStats && (
          <StatsOverview 
            stats={userStats} 
            totalChallenges={userProgress.length}
          />
        )}

        {/* Learning Paths */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Learning Paths</h2>
            <Link 
              to={createPageUrl("Leaderboard")} 
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              View Arena <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {paths.map((path) => (
              <PathCard
                key={path.id}
                path={path}
                icon={pathIcons[path.category]}
                progress={userProgress.filter(p => p.path_id === path.id)}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity 
          progress={userProgress}
          paths={paths}
        />
      </div>
    </div>
  );
}
