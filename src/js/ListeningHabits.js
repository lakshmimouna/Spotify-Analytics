
import React from 'react';
import './ListeningHabits.css';

function ListeningHabits({ data }) {
  const { 
    hourly_listening = {}, 
    daily_listening = {}, 
    listening_diversity = {}, 
    recent_tracks_analysis = [] 
  } = data || {};

  return (
    <div className="listening-habits">
      <div className="habits-header">
        <h2>🎧 Detailed Listening Analysis</h2>
        <p>Deep dive into your music consumption patterns</p>
        <div className="tracks-analyzed">
          📊 {recent_tracks_analysis.length} tracks analyzed
        </div>
      </div>

      <div className="habits-grid">
        {/* Hourly Listening Pattern */}
        <div className="habit-card">
          <h3>🕐 Hourly Listening Pattern</h3>
          {Object.keys(hourly_listening).length > 0 ? (
            <div className="hourly-chart">
              {Object.entries(hourly_listening)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([hour, count]) => (
                  <div key={hour} className="hour-bar">
                    <div 
                      className="bar"
                      style={{
                        height: `${(count / Math.max(...Object.values(hourly_listening))) * 100}%`,
                        backgroundColor: count > 2 ? '#1ed15e' : '#535353'
                      }}
                      title={`${hour}:00 - ${count} tracks`}
                    ></div>
                    <span className="hour-label">{hour}</span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No hourly data available</p>
            </div>
          )}
        </div>

        {/* Daily Listening Pattern */}
        <div className="habit-card">
          <h3>📅 Daily Listening Pattern</h3>
          {Object.keys(daily_listening).length > 0 ? (
            <div className="daily-chart">
              {Object.entries(daily_listening)
                .sort((a, b) => {
                  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                  return dayOrder.indexOf(a[0]) - dayOrder.indexOf(b[0]);
                })
                .map(([day, count]) => (
                  <div key={day} className="day-item">
                    <span className="day-name">{day}</span>
                    <div className="day-bar">
                      <div 
                        className="day-fill"
                        style={{
                          width: `${(count / Math.max(...Object.values(daily_listening))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="day-count">{count}</span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No daily data available</p>
            </div>
          )}
        </div>

        {/* Listening Diversity */}
        <div className="habit-card">
          <h3>🎨 Listening Diversity</h3>
          {Object.keys(listening_diversity).length > 0 ? (
            <div className="diversity-stats">
              <div className="stat-row">
                <span className="stat-label">Unique Artists:</span>
                <span className="stat-value">{listening_diversity.unique_artists || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Total Plays:</span>
                <span className="stat-value">{listening_diversity.total_plays || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Diversity Score:</span>
                <span className="stat-value">{(listening_diversity.diversity_score || 0).toFixed(2)}</span>
              </div>
              
              {listening_diversity.top_artists_recent && Object.keys(listening_diversity.top_artists_recent).length > 0 && (
                <div className="recent-artists">
                  <h4>🎤 Most Played Recently</h4>
                  {Object.entries(listening_diversity.top_artists_recent).map(([artist, count]) => (
                    <div key={artist} className="artist-item">
                      <span className="artist-name">{artist}</span>
                      <span className="artist-count">{count} plays</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="no-data">
              <p>No diversity data available</p>
            </div>
          )}
        </div>

        {/* Recent Tracks Timeline */}
        <div className="habit-card recent-tracks-card">
          <h3>🎵 Recent Tracks Timeline</h3>
          {recent_tracks_analysis && recent_tracks_analysis.length > 0 ? (
            <div className="recent-tracks-list">
              {recent_tracks_analysis.slice(0, 10).map((track, index) => (
                <div key={index} className="track-item">
                  <div className="track-info">
                    <span className="track-name">{track.track_name}</span>
                    <span className="track-artist">{track.artist}</span>
                  </div>
                  <div className="track-time">
                    <span className="play-time">{track.hour}:00</span>
                    <span className="play-day">{track.day}</span>
                  </div>
                </div>
              ))}
              {recent_tracks_analysis.length > 10 && (
                <div className="more-tracks">
                  <p>+ {recent_tracks_analysis.length - 10} more tracks</p>
                </div>
              )}
            </div>
          ) : (
            <div className="no-data">
              <p>No recent tracks data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListeningHabits;