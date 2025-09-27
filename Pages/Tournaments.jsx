
import React, { useState, useEffect } from "react";
import { Tournament, User } from "@/entities/all";
import { Plus, Calendar, Users, Trophy } from "lucide-react";

import TournamentCard from "../components/tournaments/TournamentCard";
import CreateTournamentDialog from "../components/tournaments/CreateTournamentDialog";

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const tournamentsData = await Tournament.list('-created_date');
      setTournaments(tournamentsData);
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = async (tournamentData) => {
    try {
      await Tournament.create({
        ...tournamentData,
        created_by: currentUser.email,
        participants: []
      });
      await loadData();
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming');
  const activeTournaments = tournaments.filter(t => t.status === 'active');
  const completedTournaments = tournaments.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Tournaments</h1>
            <p className="text-gray-400 mt-1">Compete in coding challenges with fellow developers</p>
          </div>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Tournament
          </button>
        </div>

        {/* Tournament Sections */}
        <div className="space-y-8">
          {/* Active Tournaments */}
          {activeTournaments.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-green-400" />
                Active Tournaments
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {activeTournaments.map((tournament) => (
                  <TournamentCard 
                    key={tournament.id}
                    tournament={tournament}
                    currentUser={currentUser}
                    onUpdate={loadData}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Tournaments */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              Upcoming Tournaments
            </h2>
            {upcomingTournaments.length === 0 ? (
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No upcoming tournaments</p>
                <p className="text-gray-500">Create the first tournament to get started!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingTournaments.map((tournament) => (
                  <TournamentCard 
                    key={tournament.id}
                    tournament={tournament}
                    currentUser={currentUser}
                    onUpdate={loadData}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Completed Tournaments */}
          {completedTournaments.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-gray-500" />
                Completed Tournaments
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {completedTournaments.slice(0, 6).map((tournament) => (
                  <TournamentCard 
                    key={tournament.id}
                    tournament={tournament}
                    currentUser={currentUser}
                    onUpdate={loadData}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Create Tournament Dialog */}
        <CreateTournamentDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateTournament}
        />
      </div>
    </div>
  );
}
