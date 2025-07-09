import React from 'react';
import '../css/RecentSongsPage.css';

function RecentSongsPage({ recent_tracks }) {
  const recentTracks = recent_tracks?.items || [];

  if (!recentTracks.length) return <div className="loading">No recent tracks data available...</div>;

  return (
    <div className="recent__songs__page">
      <div className="page__header">
        <h1>⏰ Recent Songs</h1>
        <p>Your listening activity timeline</p>
      </div>

      <div className="recent__grid__container">
        <div className="recent__grid">
          {recentTracks.slice(0, 12).map((item, index) => (
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