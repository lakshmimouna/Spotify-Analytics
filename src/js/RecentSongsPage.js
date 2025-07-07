import React, { useRef } from 'react';
import './RecentSongsPage.css';

function RecentSongsPage({ recent_tracks }) {
  const carouselRef = useRef(null);
  const recentTracks = recent_tracks?.items || [];

  if (!recentTracks.length) return <div className="loading">No recent tracks data available...</div>;

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const isMobile = window.innerWidth <= 768;
      // More precise calculation: card width + gap
      const cardWidth = isMobile ? 250 : 300;
      const gap = 20;
      const scrollAmount = cardWidth + gap;
      
      const currentScroll = carouselRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="recent__songs__page">
      <div className="page__header">
        <h1>⏰ Recent Songs</h1>
        <p>Your listening activity timeline in a cinematic experience</p>
      </div>

      <div className="recent__carousel__container">
        <button className="carousel__nav carousel__nav--left" onClick={() => scrollCarousel('left')}>
          ‹
        </button>
        <button className="carousel__nav carousel__nav--right" onClick={() => scrollCarousel('right')}>
          ›
        </button>
        
        <div className="recent__carousel" ref={carouselRef}>
          {recentTracks.slice(0, 10).map((item, index) => (
            <div key={`${item.track.id}-${index}`} className="recent__card">
              <div className="recent__card__image__container">
                <img 
                  src={item.track.album.images[1]?.url || item.track.album.images[0]?.url} 
                  alt={item.track.name}
                  className="recent__card__image"
                />
                <div className="recent__card__time">
                  {new Date(item.played_at).toLocaleDateString()}
                </div>
              </div>
              <div className="recent__card__info">
                <h3 className="recent__card__name">{item.track.name}</h3>
                <p className="recent__card__artist">
                  {item.track.artists.map(artist => artist.name).join(', ')}
                </p>
                <p className="recent__card__album">{item.track.album.name}</p>
                <div className="recent__card__stats">
                  <span>🔥 {item.track.popularity}%</span>
                  <span>⏱️ {Math.floor(item.track.duration_ms / 60000)}:{((item.track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentSongsPage;