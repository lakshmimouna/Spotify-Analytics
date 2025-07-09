import React from "react";
import "../css/Login.css";
import { getAccessUrl } from "./spotify";

function Login() {
  const handleLogin = async () => {
    const authUrl = await getAccessUrl();
    window.location.href = authUrl;
  };

  return (
    <div className="login">
      <img
        src="https://www.finsmes.com/wp-content/uploads/2013/11/spotify.jpg"
        alt="Spotify Logo"
      />
      <button className="login__button" onClick={handleLogin}>
        LOGIN TO SPOTIFY
      </button>
    </div>
  );
}

export default Login;