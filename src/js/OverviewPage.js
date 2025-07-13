import React, { useState, useEffect, useRef } from 'react';
import '../css/OverviewPage.css';
function OverviewPage({ top_tracks, top_artists, recent_tracks }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const chartRef = useRef(null);
  const recentTracks = recent_tracks?.items || [];
  // Generate consistent random listening time data for display
  const getListeningTimeData = () => {
    const data = {
      week: [
        { label: 'Mon', hours: 2.3 },
        { label: 'Tue', hours: 3.7 },
        { label: 'Wed', hours: 1.9 },
        { label: 'Thu', hours: 4.2 },
        { label: 'Fri', hours: 5.8 },
        { label: 'Sat', hours: 6.1 },
        { label: 'Sun', hours: 4.5 }
      ],
      month: [
        { label: 'Week 1', hours: 18.2 },
        { label: 'Week 2', hours: 22.7 },
        { label: 'Week 3', hours: 19.4 },
        { label: 'Week 4', hours: 25.8 }
      ],
      year: [
        { label: 'Jan', hours: 84.5 },
        { label: 'Feb', hours: 73.2 },
        { label: 'Mar', hours: 90.8 },
        { label: 'Apr', hours: 87.6 },
        { label: 'May', hours: 94.3 },
        { label: 'Jun', hours: 101.7 },
        { label: 'Jul', hours: 79.2 },
        { label: 'Aug', hours: 88.9 },
        { label: 'Sep', hours: 91.4 },
        { label: 'Oct', hours: 86.8 },
        { label: 'Nov', hours: 93.5 },
        { label: 'Dec', hours: 98.1 }
      ]
    };
    return data[selectedPeriod];
  };
  // Animate bars on period change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartRef.current) {
        const bars = chartRef.current.querySelectorAll('.bar__fill');
        bars.forEach((bar, index) => {
          const targetHeight = bar.getAttribute('data-height');
          setTimeout(() => {
            bar.style.height = targetHeight + '%';
          }, index * 100);
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedPeriod]);
  const timeData = getListeningTimeData();
  const maxHours = Math.max(...timeData.map(d => d.hours));
  return (
    <div className="overview__page">
      <div className="page__header">
        <h1>Music Overview</h1>
      </div>
      {/* Two Column Layout */}
      <div className="overview__content">
        {/* Left Side - Recently Played Songs List */}
        <div className="recent__tracks__section">
          <h2>⏰ Recently Played</h2>
          <div className="recent__tracks__list">
            {recentTracks.slice(0, 10).map((item, index) => {
              const track = item.track;
              const playedAt = new Date(item.played_at);
              const timeAgo = Math.floor((Date.now() - playedAt.getTime()) / (1000 * 60 * 60));
              return (
                <div key={`${track.id}-${item.played_at}`} className="recent__track__item">
                  <div className="track__number">#{index + 1}</div>
                  <div className="track__image__container">
                    <img 
                      src={track.album.images[2]?.url || track.album.images[0]?.url} 
                      alt={track.name}
                      className="track__image"
                    />
                  </div>
                  <div className="track__details">
                    <div className="track__name">{track.name}</div>
                    <div className="track__artist">{track.artists[0]?.name}</div>
                    <div className="track__time">{timeAgo}h ago</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Right Side - Listening Time Chart */}
        <div className="chart__section">
          <div className="chart__header">
            <h2>📊 Listening Time</h2>
            <div className="time__period__selector">
              <button 
                className={`period__btn ${selectedPeriod === 'week' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('week')}
              >
                Week
              </button>
              <button 
                className={`period__btn ${selectedPeriod === 'month' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('month')}
              >
                Month
              </button>
              <button 
                className={`period__btn ${selectedPeriod === 'year' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('year')}
              >
                Year
              </button>
            </div>
          </div>
          <div className="bar__chart__container" ref={chartRef}>
            {timeData.map((item, index) => (
              <div key={item.label} className="bar__column">
                <div className="bar__wrapper">
                  <div 
                    className="bar__fill"
                    style={{ 
                      backgroundColor: '#1ed15e',
                      boxShadow: '0 0 10px rgba(30, 209, 94, 0.4)'
                    }}
                    data-height={(item.hours / maxHours) * 100}
                  ></div>
                </div>
                <div className="bar__label">{item.label}</div>
                <div className="bar__value">{item.hours}h</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default OverviewPage;