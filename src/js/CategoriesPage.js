import React, { useState } from 'react';
import '../css/CategoriesPage.css';
function CategoriesPage({ top_tracks, top_artists }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categorizeGenre = (genre) => {
    const lowerGenre = genre.toLowerCase();
    if (lowerGenre.includes('telugu') || lowerGenre.includes('tollywood')) return 'Telugu';
    if (lowerGenre.includes('tamil') || lowerGenre.includes('kollywood')) return 'Tamil';
    if (lowerGenre.includes('hindi') || lowerGenre.includes('bollywood') || lowerGenre.includes('filmi')) return 'Hindi';
    if (lowerGenre.includes('kannada')) return 'Kannada';
    if (lowerGenre.includes('pop')) return 'Pop';
    if (lowerGenre.includes('rock')) return 'Rock';
    return 'Other';
  };
  const analyzeCategories = () => {
    const categoryData = {};
    if (top_artists?.items) {
      top_artists.items.forEach(artist => {
        if (artist.genres?.length > 0) {
          artist.genres.forEach(genre => {
            const category = categorizeGenre(genre);
            if (!categoryData[category]) {
              categoryData[category] = { artistsMap: new Map(), tracks: [], count: 0 };
            }
            if (!categoryData[category].artistsMap.has(artist.id)) {
              categoryData[category].artistsMap.set(artist.id, {
                id: artist.id, name: artist.name, images: artist.images
              });
            }
            categoryData[category].count++;
          });
        } else {
          if (!categoryData['Other']) {
            categoryData['Other'] = { artistsMap: new Map(), tracks: [], count: 0 };
          }
          if (!categoryData['Other'].artistsMap.has(artist.id)) {
            categoryData['Other'].artistsMap.set(artist.id, {
              id: artist.id, name: artist.name, images: artist.images
            });
          }
          categoryData['Other'].count++;
        }
      });
    }
    Object.keys(categoryData).forEach(category => {
      categoryData[category].artists = Array.from(categoryData[category].artistsMap.values());
      delete categoryData[category].artistsMap;
    });
    if (top_tracks?.items) {
      top_tracks.items.forEach(track => {
        if (track.artists?.length > 0) {
          const mainArtist = track.artists[0];
          let trackCategory = 'Other';
          for (const [category, data] of Object.entries(categoryData)) {
            if (data.artists.some(artist => artist.id === mainArtist.id)) {
              trackCategory = category;
              break;
            }
          }
          if (!categoryData[trackCategory]) {
            categoryData[trackCategory] = { artists: [], tracks: [], count: 0 };
          }
          categoryData[trackCategory].tracks.push(track);
        }
      });
    }
    return categoryData;
  };
  const categories = analyzeCategories();
  const availableCategories = Object.keys(categories).filter(cat => categories[cat].count > 0);
  const categoryOrder = ['All Categories', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Other', 'Pop', 'Rock'];
  const orderedCategories = categoryOrder.filter(cat => 
    cat === 'All Categories' || availableCategories.includes(cat)
  );
  const topCategories = Object.entries(categories)
    .filter(([, data]) => data.count > 0)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 10);
  const getFilteredData = () => {
    if (selectedCategory === 'all') {
      return { categories: topCategories };
    } else {
      const selectedCat = categories[selectedCategory];
      return { categories: [[selectedCategory, selectedCat]], selectedData: selectedCat };
    }
  };
  const filteredData = getFilteredData();
  const timeData = [
    { label: 'Mon', hours: 2.3 }, { label: 'Tue', hours: 3.7 }, 
    { label: 'Wed', hours: 1.9 }, { label: 'Thu', hours: 4.2 }, 
    { label: 'Fri', hours: 5.8 }, { label: 'Sat', hours: 6.1 }, 
    { label: 'Sun', hours: 4.5 }
  ];
  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>🎭 Music Categories</h1>
        <p>Explore your music taste by categories and genres</p>
      </div>
      <div className="category-tabs">
        <button 
          className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          <span>All Categories</span>
          <span className="category-count-badge">({Object.keys(categories).length})</span>
        </button>
        {orderedCategories.slice(1).map(category => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            <span>{category}</span>
            <span className="category-count-badge">({categories[category]?.count || 0})</span>
          </button>
        ))}
      </div>
      <div className="categories-content">
        <div className="categories-left">
          <div className="categories-section">
            <h2>🏆 {selectedCategory === 'all' ? 'All Categories' : selectedCategory + ' Category'}</h2>
            {filteredData.categories.length === 0 ? (
              <div className="no-data">
                <p>No data available for the selected category.</p>
              </div>
            ) : (
              <div className="categories-list">
                {filteredData.categories.map(([category, data], index) => (
                  <div key={category} className="category-item">
                    <div className="category-rank">#{index + 1}</div>
                    <div className="category-info">
                      <h3>{category}</h3>
                      <p>{data.artists.length} artists • {data.tracks.length} tracks</p>
                      <div className="category-progress">
                        <div 
                          className="category-progress-fill"
                          style={{ 
                            width: selectedCategory === 'all' 
                              ? `${(data.count / filteredData.categories[0][1].count) * 100}%`
                              : '100%'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="category-count">{data.count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedCategory !== 'all' && filteredData.selectedData && (
            <div className="category-details">
              <div className="category-stats">
                <div className="stat">
                  <span className="stat-number">{filteredData.selectedData.artists.length}</span>
                  <span className="stat-label">Artists</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{filteredData.selectedData.tracks.length}</span>
                  <span className="stat-label">Tracks</span>
                </div>
              </div>
              {filteredData.selectedData.artists.length > 0 && (
                <div className="category-artists">
                  <h4>Top Artists in {selectedCategory}</h4>
                  <div className="artists-grid">
                    {filteredData.selectedData.artists.slice(0, 6).map((artist) => (
                      <div key={artist.id} className="artist-card">
                        <img 
                          src={artist.images[2]?.url || artist.images[0]?.url || '/placeholder-artist.png'} 
                          alt={artist.name}
                        />
                        <span>{artist.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {filteredData.selectedData.tracks.length > 0 && (
                <div className="category-tracks">
                  <h4>Top Tracks in {selectedCategory}</h4>
                  <div className="tracks-list">
                    {filteredData.selectedData.tracks.slice(0, 5).map((track) => (
                      <div key={track.id} className="track-item">
                        <img 
                          src={track.album.images[2]?.url || track.album.images[0]?.url} 
                          alt={track.name}
                        />
                        <div className="track-info">
                          <h5>{track.name}</h5>
                          <p>{track.artists.map(a => a.name).join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="categories-right">
          <div className="time-analysis">
            <h2>📊 Listening Time by Day</h2>
            <p>Your weekly listening pattern</p>
            <div className="time-chart">
              {timeData.map((day) => (
                <div key={day.label} className="chart-bar">
                  <div 
                    className="bar__fill"
                    style={{ 
                      height: `${(day.hours / Math.max(...timeData.map(d => d.hours))) * 100}%` 
                    }}
                  ></div>
                  <span className="bar__label">{day.label}</span>
                  <span className="bar__value">{day.hours.toFixed(1)}h</span>
                </div>
              ))}
            </div>
            <div className="weekly-stats">
              <div className="stat-card">
                <h4>📈 Total Hours</h4>
                <p>{timeData.reduce((acc, day) => acc + day.hours, 0).toFixed(1)}h</p>
              </div>
              <div className="stat-card">
                <h4>📅 Avg per Day</h4>
                <p>{(timeData.reduce((acc, day) => acc + day.hours, 0) / 7).toFixed(1)}h</p>
              </div>
              <div className="stat-card">
                <h4>🔥 Peak Day</h4>
                <p>{timeData.reduce((max, day) => day.hours > max.hours ? day : max).label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CategoriesPage;
