import React, { useState, useEffect } from "react";
import "../css/Analytics.css";
import { useDataLayerValue } from "./DataLayer";
import AnalyticsAPI from "./services/analyticsAPI";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Analytics() {
  const [{ token }] = useDataLayerValue();
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      loadAnalyticsOverview();
    }
  }, [token]);

  const loadAnalyticsOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading analytics overview from Python backend...');
      const data = await AnalyticsAPI.getAnalyticsOverview(token);
      setAnalyticsData(data);
      console.log('✅ Analytics overview loaded:', data);
    } catch (error) {
      console.error('❌ Error loading analytics overview:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics">
      <div className="analytics__body">
        <Sidebar />
        <div className="analytics__main">
          <Header />
          
          <div className="analytics__content">
            <div className="analytics__header">
              <h1>🎵 Music Analytics Overview</h1>
              <p>Powered by Python Analytics Engine</p>
              <button onClick={loadAnalyticsOverview} className="refresh-btn">
                🔄 Refresh Data
              </button>
            </div>

            {loading ? (
              <div className="loading-section">
                <h2>🔄 Loading your music analytics...</h2>
                <p>Python backend is processing your data...</p>
              </div>
            ) : error ? (
              <div className="error-section">
                <h2>❌ Error loading analytics</h2>
                <p>{error}</p>
                <button onClick={loadAnalyticsOverview} className="retry-btn">
                  🔄 Retry
                </button>
              </div>
            ) : analyticsData ? (
              <>
                {/* Summary Statistics */}
                <div className="analytics__stats">
                  <div className="analytics__stat">
                    <h3>{analyticsData.summary?.total_top_tracks || 0}</h3>
                    <p>Top Tracks Analyzed</p>
                  </div>
                  <div className="analytics__stat">
                    <h3>{analyticsData.summary?.total_top_artists || 0}</h3>
                    <p>Favorite Artists</p>
                  </div>
                  <div className="analytics__stat">
                    <h3>{analyticsData.top_genres?.length || 0}</h3>
                    <p>Different Genres</p>
                  </div>
                  <div className="analytics__stat">
                    <h3>{analyticsData.summary?.recent_tracks_count || 0}</h3>
                    <p>Recent Tracks</p>
                  </div>
                </div>

                {/* Quick Stats */}
                {analyticsData.quick_stats && (
                  <div className="analytics__section">
                    <h2>🎧 Quick Insights</h2>
                    <div className="quick-stats-grid">
                      {analyticsData.quick_stats.most_popular_track && (
                        <div className="stat-card">
                          <h3>🔥 Most Popular Track</h3>
                          <div className="track-info">
                            <img 
                              src={analyticsData.quick_stats.most_popular_track.album.images[2]?.url || analyticsData.quick_stats.most_popular_track.album.images[0]?.url} 
                              alt={analyticsData.quick_stats.most_popular_track.name}
                            />
                            <div>
                              <h4>{analyticsData.quick_stats.most_popular_track.name}</h4>
                              <p>{analyticsData.quick_stats.most_popular_track.artists.map(artist => artist.name).join(", ")}</p>
                              <span className="popularity">Popularity: {analyticsData.quick_stats.most_popular_track.popularity}/100</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {analyticsData.quick_stats.favorite_artist && (
                        <div className="stat-card">
                          <h3>🎤 Favorite Artist</h3>
                          <div className="artist-info">
                            <img 
                              src={analyticsData.quick_stats.favorite_artist.images[2]?.url || analyticsData.quick_stats.favorite_artist.images[0]?.url} 
                              alt={analyticsData.quick_stats.favorite_artist.name}
                            />
                            <div>
                              <h4>{analyticsData.quick_stats.favorite_artist.name}</h4>
                              <p>Popularity: {analyticsData.quick_stats.favorite_artist.popularity}/100</p>
                              <p>Followers: {analyticsData.quick_stats.favorite_artist.followers.total.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Audio Profile */}
                {analyticsData.audio_profile && (
                  <div className="analytics__section">
                    <h2>🎭 Your Music Taste Profile</h2>
                    <div className="audio-features-grid">
                      {Object.entries(analyticsData.audio_profile).map(([feature, value]) => (
                        <div key={feature} className="feature-card">
                          <h4>{feature.charAt(0).toUpperCase() + feature.slice(1)}</h4>
                          <div className="feature-bar">
                            <div 
                              className="feature-fill"
                              style={{ width: `${feature === 'tempo' ? (value / 200) * 100 : value * 100}%` }}
                            ></div>
                          </div>
                          <span className="feature-value">
                            {feature === 'tempo' ? `${Math.round(value)} BPM` : `${Math.round(value * 100)}%`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Genres */}
                {analyticsData.top_genres && analyticsData.top_genres.length > 0 && (
                  <div className="analytics__section">
                    <h2>🎭 Your Top Genres</h2>
                    <div className="genres-grid">
                      {analyticsData.top_genres.map(({ genre, count }, index) => (
                        <div key={genre} className="genre-card">
                          <span className="genre-rank">#{index + 1}</span>
                          <h3>{genre.charAt(0).toUpperCase() + genre.slice(1)}</h3>
                          <p>{count} artists</p>
                          <div className="genre-bar">
                            <div 
                              className="genre-fill"
                              style={{ width: `${(count / analyticsData.top_genres[0]?.count) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Info */}
                {analyticsData.summary && (
                  <div className="analytics__section">
                    <h2>📊 Listening Summary</h2>
                    <div className="summary-grid">
                      <div className="summary-card">
                        <h3>🎵 Estimated Listening Time</h3>
                        <p>{analyticsData.summary.estimated_listening_time_minutes} minutes</p>
                      </div>
                      <div className="summary-card">
                        <h3>🎨 Artist Diversity</h3>
                        <p>{analyticsData.summary.unique_artists_recent} unique artists recently</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-data">
                <h2>No analytics data available</h2>
                <p>Try refreshing or check your connection to the Python backend.</p>
                <button onClick={loadAnalyticsOverview} className="retry-btn">
                  🔄 Load Analytics
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
