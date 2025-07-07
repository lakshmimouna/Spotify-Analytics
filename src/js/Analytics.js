import React, { useState } from 'react';
import './Analytics.css';
import { useDataLayerValue } from "./DataLayer";

// Import the page components from src folder
import OverviewPage from './OverviewPage';
import ListeningHabitsPage from './ListeningHabitsPage';
import TopArtistsPage from './TopArtistsPage';
import TopTracksPage from './TopTracksPage';
import RecentSongsPage from './RecentSongsPage';
import CategoriesPage from './CategoriesPage';

function Analytics() {
  const [{ top_tracks, top_artists, recent_tracks }] = useDataLayerValue();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'listening-habits', label: 'Listening Habits', icon: '🎧' },
    { id: 'top-artists', label: 'Top Artists', icon: '🎤' },
    { id: 'top-tracks', label: 'Top Tracks', icon: '🎵' },
    { id: 'recent-songs', label: 'Recent Songs', icon: '⏰' },
    { id: 'categories', label: 'Categories', icon: '📂' }
  ];

  const renderPage = () => {
    // Limit data to top 10 items
    const limitedData = {
      top_tracks: {
        ...top_tracks,
        items: top_tracks?.items?.slice(0, 10) || []
      },
      top_artists: {
        ...top_artists,
        items: top_artists?.items?.slice(0, 10) || []
      },
      recent_tracks: {
        ...recent_tracks,
        items: recent_tracks?.items?.slice(0, 10) || []
      }
    };
    
    switch(activeTab) {
      case 'overview':
        return <OverviewPage {...limitedData} />;
      case 'listening-habits':
        return <ListeningHabitsPage {...limitedData} />;
      case 'top-artists':
        return <TopArtistsPage {...limitedData} />;
      case 'top-tracks':
        return <TopTracksPage {...limitedData} />;
      case 'recent-songs':
        return <RecentSongsPage {...limitedData} />;
      case 'categories':
        return <CategoriesPage {...limitedData} />;
      default:
        return <OverviewPage {...limitedData} />;
    }
  };

  return (
    <div className="analytics">
      {/* Navigation */}
      <div className="analytics__nav">
        <div className="analytics__nav__header">
          <h1>🎵 Your Music Analytics</h1>
        </div>
        <div className="analytics__nav__container">
          <div className="analytics__nav__tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`analytics__tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab__icon">{tab.icon}</span>
                <span className="tab__label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="analytics__content">
        {renderPage()}
      </div>
    </div>
  );
}

export default Analytics;