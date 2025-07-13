import React from "react";
import "../css/Sidebar.css";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { useDataLayerValue } from "./DataLayer";
import AnalyticsIcon from "@mui/icons-material/Analytics";
function Sidebar() {
  const [{analytics_tab}, dispatch] = useDataLayerValue();
  const handleAnalyticsNavigation = (tabId) => {
    dispatch({
      type: 'SET_ANALYTICS_TAB',
      analytics_tab: tabId
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
      <br />
      <strong className="sidebar__title">🎵 Your Music Analytics</strong>
      <hr />
      <SidebarOption 
        option="📊 Overview" 
        onClick={() => handleAnalyticsNavigation('overview')}
      />
      <SidebarOption 
        option="🎤 Top Artists" 
        onClick={() => handleAnalyticsNavigation('top-artists')}
      />
      <SidebarOption 
        option="🎵 Top Tracks" 
        onClick={() => handleAnalyticsNavigation('top-tracks')}
      />
      <SidebarOption 
        option="🎭 Categories" 
        onClick={() => handleAnalyticsNavigation('categories')}
      />
    </div>
  );
}
export default Sidebar;