import React, { useEffect, useState } from 'react';
import Login from './Login';
import { getCodeFromUrl, exchangeCodeForToken } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js';
import Player from './Player';
import { useDataLayerValue } from './DataLayer';

const spotify = new SpotifyWebApi();

function App() {
  const [token, setToken] = useState(null);
  const [{ user, top_tracks, top_artists, recent_tracks }, dispatch] = useDataLayerValue();
  

  useEffect(() => {
    const code = getCodeFromUrl();
    console.log("📍 Authorization code:", code);
    
    if (code) {
      window.history.replaceState({}, document.title, "/");
      
      exchangeCodeForToken(code)
        .then(tokenData => {
          console.log("🎯 Token exchange successful:", tokenData);
          
          if (tokenData.error) {
            console.error("❌ Token exchange error:", tokenData.error, tokenData.error_description);
            return;
          }
          
          const _token = tokenData.access_token;
          
          if (_token) {
            console.log("✅ Setting up Spotify with token");
            setToken(_token);
            spotify.setAccessToken(_token);

            dispatch({
              type: 'SET_TOKEN',
              token: _token
            });

            // Get user info
            console.log("📊 Getting user info...");
            spotify.getMe().then(user => {
              console.log("✅ User data loaded:", user);
              dispatch({
                type: 'SET_USER',
                user: user
              });
            }).catch(error => {
              console.error("❌ Error getting user:", error);
            });

            // ✅ ANALYTICS DATA - Get the essential data for analytics
            
            // Get user's top tracks (most listened songs)
            console.log("📊 Getting top tracks...");
            spotify.getMyTopTracks({ limit: 20, time_range: 'medium_term' }).then((topTracks) => {
              console.log("✅ Top tracks loaded:", topTracks);
              dispatch({
                type: 'SET_TOP_TRACKS',
                top_tracks: topTracks
              });
            }).catch(error => {
              console.error("❌ Error getting top tracks:", error);
            });

            // Get user's top artists
            console.log("📊 Getting top artists...");
            spotify.getMyTopArtists({ limit: 20, time_range: 'medium_term' }).then((topArtists) => {
              console.log("✅ Top artists loaded:", topArtists);
              dispatch({
                type: 'SET_TOP_ARTISTS',
                top_artists: topArtists
              });
            }).catch(error => {
              console.error("❌ Error getting top artists:", error);
            });

            // Get recently played tracks
            console.log("📊 Getting recently played...");
            spotify.getMyRecentlyPlayedTracks({ limit: 50 }).then((recentTracks) => {
              console.log("✅ Recently played loaded:", recentTracks);
              dispatch({
                type: 'SET_RECENT_TRACKS',
                recent_tracks: recentTracks
              });
            }).catch(error => {
              console.error("❌ Error getting recently played:", error);
            });

          } // ← This closes the if (_token) block
        })
        .catch(error => {
          console.error("❌ Error exchanging code for token:", error);
        });
    }
  }, [dispatch]);

  return (
    <div className="app">
      {token ? <Player spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App;