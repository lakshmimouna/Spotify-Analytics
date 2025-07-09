import React from "react";
import "../css/Body.css";
import Header from "./Header";
import Analytics from "./Analytics";

function Body({ spotify }) {
  return (
    <div className="body">
      <Header spotify={spotify} />

      {/* Analytics Only - No Navigation Needed */}
      <div className="body__content">
        <div className="analytics__container">
          <Analytics />
        </div>
      </div>
    </div>
  );
}

export default Body;