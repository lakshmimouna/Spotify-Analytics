import React from "react";
import "../css/SidebarOption.css";

function SidebarOption({ option, Icon, onClick }) {
  return (
    <div className="sidebarOption" onClick={onClick}>
      {Icon && <Icon className="sidebarOption__icon" />}
      {Icon ? <h4>{option}</h4> : <p>{option}</p>}
    </div>
  );
}

export default SidebarOption;