import React, { useState } from 'react';
import '../css/Analytics.css';
import { useDataLayerValue } from "./DataLayer";

// Import the page components from src folder
import OverviewPage from './OverviewPage';
import TopArtistsPage from './TopArtistsPage';
import TopTracksPage from './TopTracksPage';
import RecentSongsPage from './RecentSongsPage';

function Analytics() {
  const [{ top_tracks, top_artists, recent_tracks, analytics_tab }] = useDataLayerValue();
  const activeTab = analytics_tab || 'overview';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'top-artists', label: 'Top Artists', icon: '🎤' },
    { id: 'top-tracks', label: 'Top Tracks', icon: '🎵' },
    { id: 'recent-songs', label: 'Recent Songs', icon: '⏰' }
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
      case 'top-artists':
        return <TopArtistsPage {...limitedData} />;
      case 'top-tracks':
        return <TopTracksPage {...limitedData} />;
      case 'recent-songs':
        return <RecentSongsPage {...limitedData} />;
      default:
        return <OverviewPage {...limitedData} />;
    }
  };

  return (
    <div className="analytics">
      {/* Content */}
      <div className="analytics__content">
        {renderPage()}
      </div>
    </div>
  );
}

export default Analytics;