import React, { useState, useEffect, useRef } from 'react';
import '../css/OverviewPage.css';

function OverviewPage({ top_tracks, top_artists, recent_tracks }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const chartRef = useRef(null);
  const recentTracks = recent_tracks?.items || [];

  // Generate sample listening time data based on selected period
  const getListeningTimeData = () => {
    const data = {
      week: [
        { label: 'Mon', hours: 2.5 },
        { label: 'Tue', hours: 3.2 },
        { label: 'Wed', hours: 1.8 },
        { label: 'Thu', hours: 4.1 },
        { label: 'Fri', hours: 5.3 },
        { label: 'Sat', hours: 6.7 },
        { label: 'Sun', hours: 4.9 }
      ],
      month: [
        { label: 'Week 1', hours: 18.5 },
        { label: 'Week 2', hours: 22.3 },
        { label: 'Week 3', hours: 19.8 },
        { label: 'Week 4', hours: 25.1 }
      ],
      year: [
        { label: 'Jan', hours: 85.2 },
        { label: 'Feb', hours: 72.8 },
        { label: 'Mar', hours: 91.5 },
        { label: 'Apr', hours: 88.3 },
        { label: 'May', hours: 95.7 },
        { label: 'Jun', hours: 102.1 },
        { label: 'Jul', hours: 78.9 },
        { label: 'Aug', hours: 89.4 },
        { label: 'Sep', hours: 92.6 },
        { label: 'Oct', hours: 87.2 },
        { label: 'Nov', hours: 94.8 },
        { label: 'Dec', hours: 99.3 }
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