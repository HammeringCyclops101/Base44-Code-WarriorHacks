
import React, { useState, useEffect } from "react";
import { UserStats, User } from "@/entities/all";
import { Trophy, Medal, Award, Crown, TrendingUp } from "lucide-react";

import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import DivisionStats from "../components/leaderboard/DivisionStats";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserStats, setCurrentUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState("all");

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const [statsData, allUsers] = await Promise.all([
        UserStats.list('-total_points'),
        User.list()
      ]);
      
      // Get current user's stats
      const userStats = statsData.find(s => s.user_email === user.email);
      setCurrentUserStats(userStats);
      
      // Combine stats with user info
      const combinedData = statsData
        .map(stat => {
          const userInfo = allUsers.find(u => u.email === stat.user_email);
          return {
            ...stat,
            full_name: userInfo?.full_name || 'Anonymous',
            rank: 0 // Will be set below
          };
        })
        .filter(item => item.total_points > 0); // Only show users with points

      // Set ranks
      combinedData.forEach((user, index) => {
        user.rank = index + 1;
      });

      setLeaderboard(combinedData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = selectedDivision === "all" 
    ? leaderboard 
    : leaderboard.filter(user => user.division === selectedDivision);

  const divisionCounts = {
    bronze: leaderboard.filter(u => u.division === "bronze").length,
    silver: leaderboard.filter(u => u.division === "silver").length,
    gold: leaderboard.filter(u => u.division === "gold").length,
    platinum: leaderboard.filter(u => u.division === "platinum").length,
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Arena</h1>
          </div>
          <p className="text-gray-400 text-lg">Compete with coders worldwide</p>
        </div>

        {/* Current User Stats */}
        {currentUserStats && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Ranking</h2>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-blue-200">Rank</p>
                    <p className="text-3xl font-bold">
                      #{leaderboard.find(u => u.user_email === currentUser.email)?.rank || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-200">Division</p>
                    <p className="text-xl font-semibold capitalize">{currentUserStats.division}</p>
                  </div>
                  <div>
                    <p className="text-blue-200">Points</p>
                    <p className="text-2xl font-bold">{currentUserStats.total_points}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <TrendingUp className="w-12 h-12 text-blue-200 mb-2" />
                <p className="text-blue-200">Keep climbing!</p>
              </div>
            </div>
          </div>
        )}

        {/* Division Stats */}
        <DivisionStats 
          counts={divisionCounts}
          selectedDivision={selectedDivision}
          onDivisionSelect={setSelectedDivision}
        />

        {/* Leaderboard */}
        <LeaderboardTable 
          leaderboard={filteredLeaderboard}
          currentUserEmail={currentUser?.email}
        />
      </div>
    </div>
  );
}
