const API_BASE_URL = 'http://localhost:5000/api';

const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

const getCompleteAnalytics = async (accessToken) => {
  try {
    console.log('🔄 Fetching complete analytics from Python backend...');
    
    const response = await fetch(`${API_BASE_URL}/analytics/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Analytics request failed');
    }
    
    console.log('✅ Complete analytics received from Python:', data);
    console.log('⚡ Performance metrics:', data.performance);
    
    // Return the full response including performance data
    return {
      data: data.data,
      performance: data.performance,
      generated_at: data.generated_at
    };
    
  } catch (error) {
    console.error('❌ Error fetching complete analytics:', error);
    throw error;
  }
};

const getTopArtists = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/top-artists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Top artists request failed');
    }
    
    return data.data || [];
    
  } catch (error) {
    console.error('❌ Error fetching top artists:', error);
    throw error;
  }
};

const getTopTracks = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/top-tracks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Top tracks request failed');
    }
    
    return data.data || [];
    
  } catch (error) {
    console.error('❌ Error fetching top tracks:', error);
    throw error;
  }
};

const getListeningHabits = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/listening-habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Listening habits request failed');
    }
    
    return data.data || {};
    
  } catch (error) {
    console.error('❌ Error fetching listening habits:', error);
    throw error;
  }
};

const getAnalyticsOverview = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/overview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Analytics overview request failed');
    }
    
    return data.data || {};
    
  } catch (error) {
    console.error('❌ Error fetching analytics overview:', error);
    throw error;
  }
};

const AnalyticsAPI = {
  healthCheck,
  getCompleteAnalytics,
  getTopArtists,
  getTopTracks,
  getListeningHabits,
  getAnalyticsOverview
};

export default AnalyticsAPI;