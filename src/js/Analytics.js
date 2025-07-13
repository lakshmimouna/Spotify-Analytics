import React, { useState, useEffect } from 'react';
import '../css/Analytics.css';
import { useDataLayerValue } from "./DataLayer";
import SpotifyWebApi from 'spotify-web-api-js';
import OverviewPage from './OverviewPage';
import TopArtistsPage from './TopArtistsPage';
import TopTracksPage from './TopTracksPage';
import CategoriesPage from './CategoriesPage';
const spotify = new SpotifyWebApi();
function Analytics() {
  const [{ analytics_tab, token }] = useDataLayerValue();
  const activeTab = analytics_tab || 'overview';
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState({
    overview: null,
    'top-artists': null,
    'top-tracks': null,
    'categories': null
  });
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'top-artists', label: 'Top Artists', icon: '🎤' },
    { id: 'top-tracks', label: 'Top Tracks', icon: '🎵' },
    { id: 'categories', label: 'Categories', icon: '🎭' }
  ];
  useEffect(() => {
    if (token) {
      spotify.setAccessToken(token);
    }
  }, [token]);
  useEffect(() => {
    if (token && activeTab) {
      loadDataForTab(activeTab);
    }
  }, [activeTab, token]);
  const loadDataForTab = async (tabId) => {
    if (!token) return;
    setLoading(true);
    try {
      let newData = null;
      switch(tabId) {
        case 'overview':
          const [overviewTracks, overviewArtists, overviewRecent] = await Promise.all([
            spotify.getMyTopTracks({ limit: 5, time_range: 'medium_term' }),
            spotify.getMyTopArtists({ limit: 5, time_range: 'medium_term' }),
            spotify.getMyRecentlyPlayedTracks({ limit: 10 })
          ]);
          newData = { top_tracks: overviewTracks, top_artists: overviewArtists, recent_tracks: overviewRecent };
          break;
        case 'top-artists':
          const topArtistsData = await spotify.getMyTopArtists({ limit: 50, time_range: 'medium_term' });
          newData = { top_artists: topArtistsData };
          break;
        case 'top-tracks':
          const topTracksData = await spotify.getMyTopTracks({ limit: 50, time_range: 'medium_term' });
          newData = { top_tracks: topTracksData };
          break;
        case 'categories':
          const [categoriesArtists, categoriesTracks, categoriesRecent] = await Promise.all([
            spotify.getMyTopArtists({ limit: 50, time_range: 'medium_term' }),
            spotify.getMyTopTracks({ limit: 50, time_range: 'medium_term' }),
            spotify.getMyRecentlyPlayedTracks({ limit: 50 })
          ]);
          newData = { top_artists: categoriesArtists, top_tracks: categoriesTracks, recent_tracks: categoriesRecent };
          break;
      }
      setCurrentData(prev => ({ ...prev, [tabId]: newData }));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const renderPage = () => {
    const tabData = currentData[activeTab];
    if (loading) {
      return (
        <div className="loading-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          flexDirection: 'column'
        }}>
          <h2>🔄 Loading {tabs.find(t => t.id === activeTab)?.label}...</h2>
          <p>Fetching fresh data from Spotify...</p>
        </div>
      );
    }
    if (!tabData) {
      return (
        <div className="no-data-container" style={{ 
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          height: '400px', flexDirection: 'column'
        }}>
          <h2>No data available</h2>
          <p>Click to load data for {tabs.find(t => t.id === activeTab)?.label}</p>
        </div>
      );
    }
    const limitedData = {
      top_tracks: tabData.top_tracks ? {
        ...tabData.top_tracks,
        items: tabData.top_tracks?.items?.slice(0, 10) || []
      } : null,
      top_artists: tabData.top_artists ? {
        ...tabData.top_artists,
        items: tabData.top_artists?.items?.slice(0, 10) || []
      } : null,
      recent_tracks: tabData.recent_tracks ? {
        ...tabData.recent_tracks,
        items: tabData.recent_tracks?.items?.slice(0, 10) || []
      } : null
    };
    switch(activeTab) {
      case 'overview': return <OverviewPage {...limitedData} />;
      case 'top-artists': return <TopArtistsPage {...limitedData} />;
      case 'top-tracks': return <TopTracksPage {...limitedData} />;
      case 'categories': return <CategoriesPage {...limitedData} />;
      default: return <OverviewPage {...limitedData} />;
    }
  };
  return (
    <div className="analytics">
      <div className="analytics__content">
        {renderPage()}
      </div>
    </div>
  );
}
export default Analytics;