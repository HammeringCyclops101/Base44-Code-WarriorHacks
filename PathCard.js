
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Clock, Target } from "lucide-react";

export default function PathCard({ path, icon: Icon, progress }) {
  const completedChallenges = progress.filter(p => p.completed).length;
  const progressPercentage = path.total_challenges > 0 
    ? Math.round((completedChallenges / path.total_challenges) * 100) 
    : 0;

  const difficultyColors = {
    beginner: "bg-green-900 text-green-300 border-green-700",
    intermediate: "bg-yellow-900 text-yellow-300 border-yellow-700", 
    advanced: "bg-red-900 text-red-300 border-red-700"
  };

  const categoryTitles = {
    competitive_programming: "Competitive Programming",
    game_development: "Game Development",
    ai_ml: "AI & Machine Learning"
  };

  return (
    <Link 
      to={createPageUrl(`Learn?path=${path.id}`)}
      className="group block"
    >
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center group-hover:bg-blue-900 transition-colors">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[path.difficulty]}`}>
            {path.difficulty}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
          {path.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {path.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{completedChallenges}/{path.total_challenges || 0} challenges</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{path.estimated_hours || 0}h</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="font-medium text-white">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm font-medium text-blue-400">
            {progressPercentage === 100 ? 'Completed' : progressPercentage > 0 ? 'Continue' : 'Start Learning'}
          </span>
          <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
