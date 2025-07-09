export const initialState = {
  user: null,
  playlists: [],
  playing: false,
  item: null,
  discover_weekly: null,
  liked_songs: null,
  top_tracks: null,      // Add this
  top_artists: null,     // Add this
  recent_tracks: null,   // Add this
  analytics_tab: 'overview', // Add this for analytics navigation
  token: null,
};

const reducer = (state, action) => {
  console.log("🔄 Reducer action:", action.type, action);

  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "SET_TOKEN":
      return {
        ...state,
        token: action.token,
      };

    case "SET_PLAYLISTS":
      return {
        ...state,
        playlists: action.playlists,
      };

    case "SET_DISCOVER_WEEKLY":
      return {
        ...state,
        discover_weekly: action.discover_weekly,
      };

    case "SET_LIKED_SONGS":
      return {
        ...state,
        liked_songs: action.liked_songs,
      };

    case "SET_TOP_TRACKS":      // Add this
      return {
        ...state,
        top_tracks: action.top_tracks,
      };

    case "SET_TOP_ARTISTS":     // Add this
      return {
        ...state,
        top_artists: action.top_artists,
      };

    case "SET_RECENT_TRACKS":   // Add this
      return {
        ...state,
        recent_tracks: action.recent_tracks,
      };

    case "SET_ANALYTICS_TAB":   // Add this for analytics navigation
      return {
        ...state,
        analytics_tab: action.analytics_tab,
      };

    case "SET_PLAYING":
      return {
        ...state,
        playing: action.playing,
      };

    case "SET_ITEM":
      return {
        ...state,
        item: action.item,
      };

    default:
      return state;
  }
};

export default reducer;