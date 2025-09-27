
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LearningPath, Challenge, UserProgress, User } from "@/entities/all";
import { ArrowLeft, Play, CheckCircle } from "lucide-react";
import { createPageUrl } from "@/utils";

import ChallengeCard from "../components/learn/ChallengeCard";
import PathHeader from "../components/learn/PathHeader";

export default function Learn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pathId = searchParams.get('path');
  
  const [currentPath, setCurrentPath] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathId) {
      const loadPathData = async () => {
        try {
          const user = await User.me();
          setCurrentUser(user);
          
          const [pathData, challengesData, progressData] = await Promise.all([
            LearningPath.filter({ id: pathId }),
            Challenge.filter({ path_id: pathId }, 'order'),
            UserProgress.filter({ path_id: pathId, user_email: user.email })
          ]);
          
          if (pathData.length > 0) {
            setCurrentPath(pathData[0]);
          }
          setChallenges(challengesData);
          setUserProgress(progressData);
        } catch (error) {
          console.error('Error loading path data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadPathData();
    }
  }, [pathId]);

  const getUserChallengeProgress = (challengeId) => {
    return userProgress.find(p => p.challenge_id === challengeId);
  };

  if (!pathId) {
    navigate(createPageUrl("Dashboard"));
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!currentPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Path not found</p>
          <button 
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Path Header */}
        <PathHeader 
          path={currentPath}
          progress={userProgress}
          totalChallenges={challenges.length}
        />

        {/* Challenges List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-6">Challenges</h3>
          
          {challenges.length === 0 ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
              <p className="text-gray-400">No challenges available yet.</p>
            </div>
          ) : (
            challenges.map((challenge, index) => {
              const progress = getUserChallengeProgress(challenge.id);
              const isLocked = index > 0 && !getUserChallengeProgress(challenges[index - 1]?.id)?.completed;
              
              return (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  progress={progress}
                  isLocked={isLocked}
                  index={index + 1}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
