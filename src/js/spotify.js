export const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = "http://127.0.0.1:3000/";
const clientId = "ac8742bc31d749b9a257ba5d9e61aae4";
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
  }
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  return `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}&show_dialog=true`;
};
export const getCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
};
export const exchangeCodeForToken = async (code) => {
  const codeVerifier = localStorage.getItem('code_verifier');
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
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });
    const result = await response.json();
    if (result.access_token) {
      localStorage.removeItem('code_verifier');
    }
    return result;
  } catch (error) {
    throw error;
  }
};