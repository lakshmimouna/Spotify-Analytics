import React from 'react';
import '../css/AnalyticsNav.css';

function AnalyticsNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'top-artists', label: 'Top Artists', icon: '🎤' },
    { id: 'top-tracks', label: 'Top Tracks', icon: '🎵' },
    { id: 'recent-songs', label: 'Recent Songs', icon: '⏰' },
    { id: 'time-spent', label: 'Time Spent', icon: '⏱️' }
  ];

  return (
    <div className="analytics__nav">
      <div className="analytics__nav__header">
        <h2>Your Music Analytics</h2>
      </div>
      <div className="analytics__nav__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`analytics__tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab__icon">{tab.icon}</span>
            <span className="tab__label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsNav;