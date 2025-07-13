const API_BASE_URL = 'http://localhost:5000/api';
const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};
const getCompleteAnalytics = async (spotifyData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotify_data: spotifyData })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Analytics request failed');
    }
    return {
      data: data.data,
      performance: data.performance,
      generated_at: data.generated_at
    };
  } catch (error) {
    throw error;
  }
};
const getTopArtists = async (topArtistsData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/top-artists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ top_artists_data: topArtistsData })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Top artists request failed');
    }
    return data.data || [];
  } catch (error) {
    throw error;
  }
};
const getTopTracks = async (topTracksData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/top-tracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ top_tracks_data: topTracksData })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Top tracks request failed');
    }
    return data.data || [];
  } catch (error) {
    throw error;
  }
};
const getAnalyticsOverview = async (overviewData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/overview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overview_data: overviewData })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Analytics overview request failed');
    }
    return data.data || {};
  } catch (error) {
    throw error;
  }
};
const AnalyticsAPI = {
  healthCheck,
  getCompleteAnalytics,
  getTopArtists,
  getTopTracks,
  getAnalyticsOverview
};
export default AnalyticsAPI;