import React, { useRef } from 'react';
import './TopTracksPage.css';

function TopTracksPage({ top_tracks }) {
  const carouselRef = useRef(null);
  const tracks = top_tracks?.items || [];

  if (!tracks.length) return <div className="loading">No top tracks data available...</div>;

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      // Calculate scroll amount based on screen size
      const isMobile = window.innerWidth <= 768;
      const scrollAmount = isMobile ? 270 : 320; // Mobile: 250px card + 20px gap, Desktop: 300px card + 20px gap
      const currentScroll = carouselRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="top__tracks__page">
      <div className="page__header">
        <h1>🎵 Featured Tracks</h1>
        <p>Discover your most listened tracks in a cinematic experience</p>
      </div>

      <div className="tracks__carousel__container">
        <button className="carousel__nav carousel__nav--left" onClick={() => scrollCarousel('left')}>
          ‹
        </button>
        <button className="carousel__nav carousel__nav--right" onClick={() => scrollCarousel('right')}>
          ›
        </button>
        
        <div className="tracks__carousel" ref={carouselRef}>
          {tracks.slice(0, 10).map((track, index) => (
            <div key={track.id} className="track__card">
              <div className="track__card__image__container">
                <img 
                  src={track.album.images[0]?.url || track.album.images[1]?.url} 
                  alt={track.name}
                  className="track__card__image"
                />
                <div className="track__card__rank">#{index + 1}</div>
              </div>
              <div className="track__card__info">
                <h3 className="track__card__title">{track.name}</h3>
                <p className="track__card__artist">{track.artists.map(artist => artist.name).join(", ")}</p>
                <p className="track__card__album">{track.album.name}</p>
                <div className="track__card__stats">
                  <span>♫ {track.popularity}/100</span>
                  <span>⏱ {Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopTracksPage;
