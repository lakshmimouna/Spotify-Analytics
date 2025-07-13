import React from "react";
import "../css/Header.css";
import { useDataLayerValue } from "./DataLayer";
import { Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
function Header({ spotify }) {
  const [{ user }, dispatch] = useDataLayerValue();
  return (
    <div className="header">
      <div className="header__left">
        <SearchIcon />
        <input
          placeholder="Search for Artists, Songs, or Podcasts"
          type="text"
        />
      </div>
      <div className="header__right">
        <h4>{user?.display_name}</h4>
        <Avatar 
          alt={user?.display_name} 
          src={user?.images?.[0]?.url} 
        />
      </div>
    </div>
  );
}
export default Header;