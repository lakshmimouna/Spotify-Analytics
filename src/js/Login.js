import React from "react";
import "../css/Login.css";
import { getAccessUrl } from "./spotify";
function Login() {
  const handleLogin = async () => {
    const authUrl = await getAccessUrl();
    window.location.href = authUrl;
  };
  return (
    <>
      <div className="login-bg"></div>
      <div className="login">
        <div className="login__modal">
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png"
            alt="Spotify Logo"
          />
          <div className="login__title">
            Millions of songs.
            <br />
            Free on Spotify.
          </div>
          <div className="login__subtitle">
            Log in to continue to Spotify Analytics
          </div>
          <button className="login__button" onClick={handleLogin}>
            LOG IN
          </button>
          <div className="login__signup">
            Don't have an account?
            <a
              href="https://www.spotify.com/signup/"
              target="_blank"
              rel="noopener noreferrer"
            >
              SIGN UP
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;