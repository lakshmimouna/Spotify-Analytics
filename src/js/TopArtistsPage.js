import React, { useRef } from 'react';
import './TopArtistsPage.css';

function TopArtistsPage({ top_artists }) {
  const carouselRef = useRef(null);
  const topArtists = top_artists?.items || [];

  if (!topArtists.length) return <div className="loading">No top artists data available...</div>;

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
    <div className="top__artists__page">
      <div className="page__header">
        <h1>🌟 Featured Artists</h1>
        <p>Discover your most listened artists in a cinematic experience</p>
      </div>

      <div className="artists__carousel__container">
        <div className="artists__carousel" ref={carouselRef}>
          {topArtists.slice(0, 10).map((artist, index) => (
            <div key={artist.id} className="artist__card">
              <div className="artist__card__image__container">
                <img 
                  src={artist.images[1]?.url || artist.images[0]?.url} 
                  alt={artist.name}
                  className="artist__card__image"
                />
                <div className="artist__card__rank">#{index + 1}</div>
              </div>
              <div className="artist__card__info">
                <h3 className="artist__card__name">{artist.name}</h3>
                <p className="artist__card__genres">
                  {artist.genres?.slice(0, 2).join(', ') || 'Music Artist'}
                </p>
                <div className="artist__card__stats">
                  <span>🔥 {artist.popularity}%</span>
                  <span>👥 {(artist.followers?.total / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="carousel__nav carousel__nav--left" onClick={() => scrollCarousel('left')}>
          ‹
        </button>
        <button className="carousel__nav carousel__nav--right" onClick={() => scrollCarousel('right')}>
          ›
        </button>
      </div>
    </div>
  );
}

export default TopArtistsPage;