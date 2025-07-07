import React from "react";
import "./Sidebar.css";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useDataLayerValue } from "./DataLayer";
import SpotifyWebApi from 'spotify-web-api-js';
import AnalyticsIcon from "@mui/icons-material/Analytics";


const spotify = new SpotifyWebApi();

function Sidebar() {
  const [{playlists, liked_songs, token}, dispatch] = useDataLayerValue();
  
  console.log("🎵 Sidebar - playlists data:", playlists);
  console.log("🎵 Sidebar - playlists items:", playlists?.items?.length || 0);
  console.log("🎵 Sidebar - liked songs:", liked_songs);

  const refreshPlaylists = () => {
    if (!token) return;
    
    spotify.setAccessToken(token);
    console.log("🔄 Refreshing playlists...");
    
    // Refresh playlists
    spotify.getUserPlaylists('', { limit: 50 }).then((playlists) => {
      console.log("✅ Playlists refreshed:", playlists);
      dispatch({
        type: 'SET_PLAYLISTS',
        playlists: playlists
      });
    }).catch(error => {
      console.error("❌ Error refreshing playlists:", error);
    });

    // Refresh liked songs
    spotify.getMySavedTracks({ limit: 50 }).then((savedTracks) => {
      console.log("✅ Liked songs refreshed:", savedTracks);
      const likedSongsPlaylist = {
        id: 'liked-songs',
        name: 'Liked Songs',
        tracks: savedTracks,
        images: [{url: 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png'}],
        description: 'Your liked songs'
      };
      
      dispatch({
        type: 'SET_LIKED_SONGS',
        liked_songs: likedSongsPlaylist
      });
    }).catch(error => {
      console.error("❌ Error refreshing liked songs:", error);
    });
  };
  
  return (
    <div className="sidebar">
      <img
        className="sidebar__logo"
        src="https://www.finsmes.com/wp-content/uploads/2013/11/spotify.jpg"
        alt="Spotify Logo"
      />
      <SidebarOption Icon={HomeIcon} option="Home" />
      <SidebarOption Icon={SearchIcon} option="Search" />
      <SidebarOption Icon={LibraryMusicIcon} option="Your Library" />
      <SidebarOption Icon={AnalyticsIcon} option="Your Analytics" />
      
      {/* Add Refresh Button */}
      <SidebarOption 
        Icon={RefreshIcon} 
        option="Refresh Playlists" 
        onClick={refreshPlaylists}
      />
      
      <br />
      <strong className="sidebar__title">PLAYLISTS</strong>
      <hr />

      {/* Show Liked Songs first */}
      {liked_songs && (
        <SidebarOption Icon={FavoriteIcon} option="Liked Songs" />
      )}

      {/* Debug info */}
      {!playlists && <p style={{color: 'gray', fontSize: '12px', padding: '0 20px'}}>Loading playlists...</p>}
      {playlists && !playlists.items && <p style={{color: 'red', fontSize: '12px', padding: '0 20px'}}>No playlist items found</p>}
      {playlists?.items?.length === 0 && <p style={{color: 'yellow', fontSize: '12px', padding: '0 20px'}}>No playlists available</p>}

      {/* Render user playlists */}
      {playlists?.items?.map((playlist) => (
        <SidebarOption key={playlist.id} option={playlist.name} />
      ))}
      
      {/* Fallback playlists for demo */}
      <SidebarOption option="Hip Hop Central" />
      <SidebarOption option="RapCaviar" />
      <SidebarOption option="All Out 2010s" />
    </div>
  );
}

export default Sidebar;