import React, { useEffect, useRef } from 'react';
import './OverviewPage.css';

function OverviewPage({ top_tracks, top_artists, recent_tracks }) {
  const chartRef = useRef(null);

  // Trigger animation on mount for bar chart
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartRef.current) {
        const bars = chartRef.current.querySelectorAll('.bar__fill');
        bars.forEach((bar, index) => {
          const targetWidth = bar.getAttribute('data-width');
          setTimeout(() => {
            bar.style.width = targetWidth + '%';
          }, index * 200);
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Generate time-based category data
  const getTimeSpentByCategory = () => {
    const categories = [
      { name: 'Pop', hours: 45, color: '#1ed15e', icon: '🎵' },
      { name: 'Rock', hours: 32, color: '#ff6b6b', icon: '🎸' },
      { name: 'Hip Hop', hours: 28, color: '#4ecdc4', icon: '🎤' },
      { name: 'Electronic', hours: 22, color: '#45b7d1', icon: '🎛️' },
      { name: 'Indie', hours: 18, color: '#f39c12', icon: '🎼' },
      { name: 'Jazz', hours: 12, color: '#9b59b6', icon: '🎺' }
    ];
    
    const totalHours = categories.reduce((sum, cat) => sum + cat.hours, 0);
    return categories.map(cat => ({
      ...cat,
      percentage: Math.round((cat.hours / totalHours) * 100)
    }));
  };

  const timeCategories = getTimeSpentByCategory();

  return (
    <div className="overview__page">
      <div className="page__header">
        <h1>Music Overview</h1>
      </div>

      {/* Time Spent by Category - Full Width */}
      <div className="time__chart__container">
        <h2>⏱️ Time Spent by Category</h2>
        
        {/* Total Hours Summary */}
        <div className="total__summary">
          <div className="total__hours">
            {timeCategories.reduce((sum, cat) => sum + cat.hours, 0)}
            <span>hrs</span>
          </div>
          <p>Total Listening Time</p>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="bar__chart" ref={chartRef}>
          {timeCategories.map((category, index) => (
            <div key={category.name} className="bar__item">
              <div className="bar__header">
                <div className="bar__label">
                  <span className="bar__icon">{category.icon}</span>
                  <span className="bar__name">{category.name}</span>
                </div>
                <div className="bar__stats">
                  <span className="bar__hours">{category.hours}h</span>
                  <span className="bar__percentage">({category.percentage}%)</span>
                </div>
              </div>
              <div className="bar__track">
                <div 
                  className="bar__fill"
                  style={{ 
                    backgroundColor: category.color,
                    boxShadow: `0 0 10px ${category.color}40`
                  }}
                  data-width={category.percentage}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;