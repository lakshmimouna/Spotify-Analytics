import React from 'react';
import './ListeningHabitsPage.css';

function ListeningHabitsPage({ top_tracks, top_artists, recent_tracks }) {
  // Calculate listening habits data
  const totalTracks = top_tracks?.items?.length || 0;
  const totalArtists = top_artists?.items?.length || 0;
  const recentActivity = recent_tracks?.items?.length || 0;
  
  // Mock data for demonstration - you can replace with real analysis
  const listeningStats = {
    avgSessionLength: "23 minutes",
    peakListeningHour: "8 PM",
    mostActiveDay: "Friday",
    genreDiversity: "High"
  };

  const moodData = [
    { mood: "Energetic", percentage: 75 },
    { mood: "Chill", percentage: 60 },
    { mood: "Happy", percentage: 85 },
    { mood: "Focused", percentage: 45 },
    { mood: "Nostalgic", percentage: 30 }
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const peakDays = [2, 4, 5]; // Wed, Fri, Sat (0-indexed)

  return (
    <div className="listening__habits__page">
      <div className="page__header">
        <h1>🎧 Listening Habits</h1>
        <p>Your music listening patterns and preferences</p>
      </div>

      {/* Listening Patterns */}
      <div className="listening__patterns">
        <h3>📅 Weekly Listening Pattern</h3>
        <div className="pattern__grid">
          {weekDays.map((day, index) => (
            <div 
              key={day} 
              className={`pattern__day ${peakDays.includes(index) ? 'active' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="pattern__hours">
          {Array.from({length: 24}, (_, i) => (
            <div 
              key={i} 
              className={`hour__block ${[8, 14, 20].includes(i) ? 'peak' : ''}`}
              title={`${i}:00`}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      {/* Mood Analysis */}
      <div className="mood__analysis">
        <h3>😊 Music Mood Analysis</h3>
        <div className="mood__bars">
          {moodData.map(({ mood, percentage }) => (
            <div key={mood} className="mood__bar">
              <div className="mood__label">{mood}</div>
              <div className="mood__progress">
                <div 
                  className="mood__fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="mood__percentage">{percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListeningHabitsPage;
