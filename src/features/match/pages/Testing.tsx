"use client"
import React, { useState, useEffect } from 'react';
import { Maximize2, X, Calendar, Users, Trophy, ExternalLink } from 'lucide-react';

const ChallongeBracketEmbed = ({ tournamentId, isFullscreen = false, onToggleFullscreen }) => {
  const embedUrl = `https://challonge.com/${tournamentId}/module`;
  
  return (
    <div className={`relative ${isFullscreen ? 'h-screen' : 'h-96 md:h-[500px]'}`}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="auto"
        allowFullScreen
        className="rounded-lg shadow-lg"
        title={`Tournament Bracket ${tournamentId}`}
      />
      
      {/* Fullscreen Toggle Button */}
      <button
        onClick={onToggleFullscreen}
        className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-all duration-200 z-10"
        title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
      >
        {isFullscreen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Maximize2 className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </div>
  );
};

const FullscreenModal = ({ children, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Tournament Bracket - Fullscreen</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="h-[calc(100%-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const TournamentDetailPage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('bracket');
  
  // Mock tournament data - ganti dengan data dari API Anda
  const tournament = {
    id: 'ufrg6p59',
    name: 'Summer Championship 2024',
    description: 'Join us for the ultimate summer gaming tournament featuring the best players from around the region.',
    status: 'In Progress',
    type: 'Single Elimination',
    participants: 32,
    prize: '$5,000',
    startDate: '2024-07-15',
    endDate: '2024-07-20',
    organizer: 'Gaming League Pro',
    game: 'Street Fighter 6',
    platform: 'PlayStation 5',
    location: 'Jakarta Convention Center',
    rules: [
      'All matches are best of 3 rounds',
      'Players must arrive 15 minutes before their match',
      'No coaching during matches',
      'Tournament follows standard FGC rules'
    ]
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const tabs = [
    { id: 'bracket', label: 'Bracket', icon: Trophy },
    { id: 'info', label: 'Info', icon: Calendar },
    { id: 'participants', label: 'Participants', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
              <p className="text-gray-600 mt-1">{tournament.game} • {tournament.type}</p>
            </div>
            <div className="flex gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                tournament.status === 'In Progress' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {tournament.status}
              </span>
              <a
                href={`https://challonge.com/${tournament.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Challonge
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tournament Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold text-gray-900">{tournament.participants}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Prize Pool</p>
                <p className="text-2xl font-bold text-gray-900">{tournament.prize}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(tournament.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(tournament.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'bracket' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Tournament Bracket</h2>
                  <button
                    onClick={handleToggleFullscreen}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Maximize2 className="w-4 h-4" />
                    View Fullscreen
                  </button>
                </div>
                <ChallongeBracketEmbed
                  tournamentId={tournament.id}
                  isFullscreen={false}
                  onToggleFullscreen={handleToggleFullscreen}
                />
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tournament Description</h3>
                  <p className="text-gray-700 leading-relaxed">{tournament.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tournament Details</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Game:</span> {tournament.game}</p>
                      <p><span className="font-medium">Platform:</span> {tournament.platform}</p>
                      <p><span className="font-medium">Format:</span> {tournament.type}</p>
                      <p><span className="font-medium">Organizer:</span> {tournament.organizer}</p>
                      <p><span className="font-medium">Location:</span> {tournament.location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Rules</h3>
                    <ul className="space-y-2">
                      {tournament.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-gray-700">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Registered Participants</h3>
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {tournament.participants} players registered
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Participant list will be available on the tournament page
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <FullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        <ChallongeBracketEmbed
          tournamentId={tournament.id}
          isFullscreen={true}
          onToggleFullscreen={handleToggleFullscreen}
        />
      </FullscreenModal>
    </div>
  );
};

export default TournamentDetailPage;