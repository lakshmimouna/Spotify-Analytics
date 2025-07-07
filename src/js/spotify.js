export const authEndpoint = "https://accounts.spotify.com/authorize";

const redirectUri = "http://127.0.0.1:3000/";
const clientId = "4224314387cf4fcab9842c646ec45c81";

// Only use valid, supported scopes
const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
  "user-read-private",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-follow-read",
  "streaming"  // This is the only additional scope for playback
];

// Generate code verifier for PKCE
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Generate access URL with PKCE
export const getAccessUrl = async () => {
  let codeVerifier = localStorage.getItem('code_verifier');
  
  if (!codeVerifier) {
    codeVerifier = generateRandomString(128);
    localStorage.setItem('code_verifier', codeVerifier);
    console.log("Generated new code verifier:", codeVerifier);
  } else {
    console.log("Using existing code verifier:", codeVerifier);
  }
  
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  console.log("Generated code challenge:", codeChallenge);
  
  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}&show_dialog=true`;
};

// Get authorization code from URL
export const getCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
};

// Exchange code for token
export const exchangeCodeForToken = async (code) => {
  const codeVerifier = localStorage.getItem('code_verifier');
  console.log("Retrieved code verifier for exchange:", codeVerifier);
  
  if (!codeVerifier) {
    throw new Error("Code verifier not found in localStorage");
  }
  
  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  console.log("Exchange request body:", body.toString());
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    const result = await response.json();
    console.log("Token exchange response:", result);
    
    if (result.access_token) {
      localStorage.removeItem('code_verifier');
      console.log("Code verifier cleared after successful exchange");
    }
    
    return result;
  } catch (error) {
    console.error("Network error during token exchange:", error);
    throw error;
  }
};