import React, { useRef } from 'react';
import './CategoriesPage.css';

function CategoriesPage() {
  const carouselRef = useRef(null);

  const categories = [
    { id: 'top', label: 'Top Tracks', icon: '🏆', count: 50, description: 'Your most played songs' },
    { id: 'recent', label: 'Recent', icon: '🕐', count: 30, description: 'Recently played music' },
    { id: 'artist', label: 'By Artist', icon: '👨‍🎤', count: 25, description: 'Organized by artists' },
    { id: 'time', label: 'Time Based', icon: '📅', count: 45, description: 'Time-based analysis' },
    { id: 'genre', label: 'Genres', icon: '🎭', count: 12, description: 'Musical genres' },
    { id: 'mood', label: 'Moods', icon: '😊', count: 8, description: 'Mood-based playlists' },
    { id: 'discovery', label: 'Discovery', icon: '🔍', count: 20, description: 'New music finds' },
    { id: 'favorites', label: 'Favorites', icon: '❤️', count: 35, description: 'Your favorite tracks' }
  ];

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const isMobile = window.innerWidth <= 768;
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
    <div className="categories__page">
      <div className="page__header">
        <h1>📂 Music Categories</h1>
        <p>Explore your music organized by different categories</p>
      </div>

      <div className="categories__carousel__container">
        <button className="carousel__nav carousel__nav--left" onClick={() => scrollCarousel('left')}>
          ‹
        </button>
        <button className="carousel__nav carousel__nav--right" onClick={() => scrollCarousel('right')}>
          ›
        </button>
        
        <div className="categories__carousel" ref={carouselRef}>
          {categories.map(category => (
            <div key={category.id} className="category__card">
              <div className="category__card__icon">{category.icon}</div>
              <h3 className="category__card__title">{category.label}</h3>
              <p className="category__card__description">{category.description}</p>
              <div className="category__card__stats">
                <span>📊 {category.count} items</span>
              </div>
              <button className="category__card__button">
                Explore →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;