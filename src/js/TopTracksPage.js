import React from 'react';
import '../css/TopTracksPage.css';

function TopTracksPage({ top_tracks }) {
  const tracks = top_tracks?.items || [];

  if (!tracks.length) return <div className="loading">No top tracks data available...</div>;

  return (
    <div className="top__tracks__page">
      <div className="page__header">
        <h1>🎵 Featured Tracks</h1>
        <p>Discover your most listened tracks</p>
      </div>

      <div className="tracks__grid__container">
        <div className="tracks__grid">
          {tracks.slice(0, 12).map((track, index) => (
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
                <h3 className="track__card__name">{track.name}</h3>
                <p className="track__card__artist">{track.artists.map(artist => artist.name).join(", ")}</p>
                <p className="track__card__album">{track.album.name}</p>
                <div className="track__card__stats">
                  <span>🔥 {track.popularity}%</span>
                  <span>⏱️ {Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}</span>
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
