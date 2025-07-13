import React, { useEffect, useState } from 'react';
import Login from './Login';
import { getCodeFromUrl, exchangeCodeForToken } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js';
import Player from './Player';
import { useDataLayerValue } from './DataLayer';
const spotify = new SpotifyWebApi();
function App() {
  const [token, setToken] = useState(null);
  const [{ user }, dispatch] = useDataLayerValue();
  useEffect(() => {
    // First, check if we already have a stored token
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      setToken(storedToken);
      spotify.setAccessToken(storedToken);
      dispatch({ type: 'SET_TOKEN', token: storedToken });
      // Get user info with stored token
      spotify.getMe().then(user => {
        dispatch({ type: 'SET_USER', user: user });
      }).catch(error => {
        localStorage.removeItem('spotify_access_token');
        setToken(null);
      });
      return;
    }
    // If no stored token, handle OAuth flow
    const code = getCodeFromUrl();
    if (code) {
      window.history.replaceState({}, document.title, "/");
      exchangeCodeForToken(code)
        .then(tokenData => {
          if (tokenData.error) {
            return;
          }
          const _token = tokenData.access_token;
          if (_token) {
            setToken(_token);
            spotify.setAccessToken(_token);
            localStorage.setItem('spotify_access_token', _token);
            dispatch({ type: 'SET_TOKEN', token: _token });
            spotify.getMe().then(user => {
              dispatch({ type: 'SET_USER', user: user });
            }).catch(error => {
            });
          }
        })
        .catch(error => {
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