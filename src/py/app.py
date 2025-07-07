from flask import Flask, request, jsonify
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import statistics
from collections import Counter
import time
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import os

app = Flask(__name__)
CORS(app)

class SpotifyAnalytics:
    def __init__(self, sp):
        self.sp = sp
    
    def get_audio_features_analysis(self, tracks):
        """Comprehensive audio features analysis"""
        track_ids = [track['id'] for track in tracks if track.get('id')]
        if not track_ids:
            return {}
        
        audio_features = self.sp.audio_features(track_ids)
        features_data = [f for f in audio_features if f]
        
        if not features_data:
            return {}
        
        # Convert to DataFrame for easier analysis
        df = pd.DataFrame(features_data)
        
        # Statistical analysis
        feature_stats = {}
        numeric_features = ['danceability', 'energy', 'speechiness', 'acousticness', 
                          'instrumentalness', 'liveness', 'valence', 'tempo', 'loudness']
        
        for feature in numeric_features:
            if feature in df.columns:
                feature_stats[feature] = {
                    'mean': float(df[feature].mean()),
                    'median': float(df[feature].median()),
                    'std': float(df[feature].std()),
                    'min': float(df[feature].min()),
                    'max': float(df[feature].max()),
                    'percentiles': {
                        '25': float(df[feature].quantile(0.25)),
                        '75': float(df[feature].quantile(0.75))
                    }
                }
        
        # Key and mode analysis
        key_distribution = df['key'].value_counts().to_dict()
        mode_distribution = df['mode'].value_counts().to_dict()
        
        # Time signature analysis
        time_signature_dist = df['time_signature'].value_counts().to_dict()
        
        return {
            'feature_statistics': feature_stats,
            'key_distribution': key_distribution,
            'mode_distribution': mode_distribution,
            'time_signature_distribution': time_signature_dist,
            'total_tracks_analyzed': len(features_data)
        }
    
    def analyze_genre_patterns(self, artists):
        """Advanced genre analysis"""
        all_genres = []
        artist_genre_map = {}
        
        for artist in artists:
            genres = artist.get('genres', [])
            all_genres.extend(genres)
            artist_genre_map[artist['name']] = genres
        
        # Genre frequency analysis
        genre_counts = Counter(all_genres)
        total_genres = len(all_genres)
        
        # Genre categories (simplified)
        genre_categories = {
            'pop': ['pop', 'indie pop', 'electropop', 'synthpop'],
            'rock': ['rock', 'indie rock', 'alternative rock', 'classic rock'],
            'electronic': ['electronic', 'edm', 'house', 'techno', 'dubstep'],
            'hip_hop': ['hip hop', 'rap', 'trap', 'conscious hip hop'],
            'indie': ['indie', 'indie folk', 'indie rock', 'indietronica'],
            'classical': ['classical', 'orchestral', 'chamber music'],
            'jazz': ['jazz', 'smooth jazz', 'contemporary jazz'],
            'country': ['country', 'folk', 'americana']
        }
        
        category_scores = {}
        for category, keywords in genre_categories.items():
            score = sum(genre_counts.get(genre, 0) for genre in keywords 
                       if any(keyword in genre.lower() for keyword in keywords))
            category_scores[category] = score
        
        return {
            'top_genres': dict(genre_counts.most_common(10)),
            'genre_diversity': len(set(all_genres)),
            'total_genre_mentions': total_genres,
            'category_analysis': category_scores,
            'artist_genre_mapping': artist_genre_map
        }
    
    def calculate_music_personality(self, audio_features_stats):
        """Calculate user's music personality profile"""
        if not audio_features_stats:
            return {}
        
        features = audio_features_stats.get('feature_statistics', {})
        
        personality_traits = {}
        
        # Energy level
        energy_mean = features.get('energy', {}).get('mean', 0.5)
        if energy_mean > 0.7:
            personality_traits['energy_level'] = 'High Energy'
        elif energy_mean > 0.4:
            personality_traits['energy_level'] = 'Moderate Energy'
        else:
            personality_traits['energy_level'] = 'Low Energy'
        
        # Mood preference
        valence_mean = features.get('valence', {}).get('mean', 0.5)
        if valence_mean > 0.7:
            personality_traits['mood_preference'] = 'Positive/Happy'
        elif valence_mean > 0.3:
            personality_traits['mood_preference'] = 'Neutral/Balanced'
        else:
            personality_traits['mood_preference'] = 'Melancholic/Sad'
        
        # Dance preference
        dance_mean = features.get('danceability', {}).get('mean', 0.5)
        personality_traits['dance_preference'] = 'High' if dance_mean > 0.7 else 'Moderate' if dance_mean > 0.4 else 'Low'
        
        # Acoustic preference
        acoustic_mean = features.get('acousticness', {}).get('mean', 0.5)
        personality_traits['acoustic_preference'] = 'Acoustic' if acoustic_mean > 0.6 else 'Electronic' if acoustic_mean < 0.3 else 'Mixed'
        
        return personality_traits

class AdvancedSpotifyAnalytics:
    def __init__(self, sp):
        self.sp = sp
    
    def cluster_music_preferences(self, tracks_data):
        """Use ML to cluster user's music preferences"""
        # Extract audio features for clustering
        track_ids = [track['id'] for track in tracks_data if track.get('id')]
        if not track_ids:
            return {'error': 'No valid track IDs found'}
        
        audio_features = self.sp.audio_features(track_ids)
        
        # Create DataFrame
        df = pd.DataFrame([f for f in audio_features if f])
        
        if df.empty:
            return {'error': 'No audio features available'}
        
        # Select features for clustering
        features = ['danceability', 'energy', 'speechiness', 'acousticness', 
                   'instrumentalness', 'liveness', 'valence', 'tempo']
        
        # Ensure all features exist and drop NaN values
        available_features = [f for f in features if f in df.columns]
        X = df[available_features].dropna()
        
        if len(X) < 3:
            return {'error': f'Not enough data for clustering. Only {len(X)} valid tracks found.'}
        
        # Normalize features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Perform clustering
        n_clusters = min(5, max(2, len(X) // 5))  # Adaptive cluster count
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(X_scaled)
        
        # Analyze clusters
        cluster_analysis = {}
        for i in range(n_clusters):
            cluster_mask = clusters == i
            cluster_data = X[cluster_mask]
            
            cluster_analysis[f'cluster_{i}'] = {
                'size': int(cluster_mask.sum()),
                'characteristics': {
                    feature: {
                        'mean': float(cluster_data[feature].mean()),
                        'std': float(cluster_data[feature].std()) if len(cluster_data) > 1 else 0.0
                    } for feature in available_features
                },
                'representative_tracks': df[cluster_mask]['id'].head(3).tolist()
            }
        
        return {
            'clusters': cluster_analysis,
            'total_clusters': n_clusters,
            'silhouette_score': self._calculate_silhouette_score(X_scaled, clusters),
            'features_used': available_features,
            'total_tracks_analyzed': len(X)
        }
    
    def temporal_listening_analysis(self, timeframe_days=30):
        """Analyze listening patterns over time"""
        try:
            # Get recently played tracks
            after = int((datetime.now() - timedelta(days=timeframe_days)).timestamp() * 1000)
            recent = self.sp.current_user_recently_played(limit=50, after=after)
            
            if not recent['items']:
                return {'error': 'No recent listening data available'}
            
            temporal_data = []
            for item in recent['items']:
                played_at = datetime.fromisoformat(item['played_at'].replace('Z', '+00:00'))
                temporal_data.append({
                    'timestamp': played_at,
                    'hour': played_at.hour,
                    'day_of_week': played_at.weekday(),
                    'track_id': item['track']['id'],
                    'track_name': item['track']['name'],
                    'artist_name': item['track']['artists'][0]['name']
                })
            
            df = pd.DataFrame(temporal_data)
            
            if df.empty:
                return {'error': 'No recent listening data available'}
            
            # Analysis
            hourly_pattern = df['hour'].value_counts().sort_index().to_dict()
            daily_pattern = df['day_of_week'].value_counts().sort_index().to_dict()
            
            # Peak listening times
            peak_hour = df['hour'].mode().iloc[0] if not df['hour'].mode().empty else None
            peak_day = df['day_of_week'].mode().iloc[0] if not df['day_of_week'].mode().empty else None
            
            # Day names mapping
            day_names = {0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday', 
                        4: 'Friday', 5: 'Saturday', 6: 'Sunday'}
            
            return {
                'timeframe_days': timeframe_days,
                'total_plays': len(df),
                'unique_tracks': df['track_id'].nunique(),
                'unique_artists': df['artist_name'].nunique(),
                'hourly_distribution': hourly_pattern,
                'daily_distribution': daily_pattern,
                'peak_listening_hour': peak_hour,
                'peak_listening_day': day_names.get(peak_day, peak_day),
                'listening_intensity': round(len(df) / timeframe_days, 2),  # avg plays per day
                'most_played_track': df['track_name'].mode().iloc[0] if not df['track_name'].mode().empty else None
            }
        except Exception as e:
            return {'error': f'Temporal analysis failed: {str(e)}'}
    
    def recommendation_analysis(self, seed_tracks=None, limit=20):
        """Analyze recommendation patterns and diversity"""
        try:
            if not seed_tracks:
                # Get user's top tracks as seeds
                top_tracks = self.sp.current_user_top_tracks(limit=5)['items']
                seed_tracks = [track['id'] for track in top_tracks]
            
            if not seed_tracks:
                return {'error': 'No seed tracks available for recommendations'}
            
            # Get recommendations
            recommendations = self.sp.recommendations(
                seed_tracks=seed_tracks[:5],  # API limit
                limit=limit
            )
            
            rec_tracks = recommendations['tracks']
            
            if not rec_tracks:
                return {'error': 'No recommendations received'}
            
            # Analyze recommendation diversity
            genres = set()
            artists = set()
            
            for track in rec_tracks:
                # Get artist info for genres
                try:
                    artist_id = track['artists'][0]['id']
                    artist_info = self.sp.artist(artist_id)
                    genres.update(artist_info['genres'])
                    artists.add(artist_info['name'])
                except:
                    continue
            
            # Get audio features for recommendations
            rec_ids = [track['id'] for track in rec_tracks]
            rec_audio_features = self.sp.audio_features(rec_ids)
            
            return {
                'total_recommendations': len(rec_tracks),
                'genre_diversity': len(genres),
                'artist_diversity': len(artists),
                'unique_genres': list(genres)[:10],  # Limit for response size
                'recommendation_audio_profile': self._analyze_audio_features(rec_audio_features),
                'popularity_distribution': {
                    'min': min([track['popularity'] for track in rec_tracks]),
                    'max': max([track['popularity'] for track in rec_tracks]),
                    'average': statistics.mean([track['popularity'] for track in rec_tracks])
                }
            }
        except Exception as e:
            return {'error': f'Recommendation analysis failed: {str(e)}'}
    
    def _calculate_silhouette_score(self, X, labels):
        """Calculate silhouette score for clustering quality"""
        try:
            if len(set(labels)) > 1 and len(X) > 1:
                return float(silhouette_score(X, labels))
            return 0.0
        except:
            return 0.0
    
    def _analyze_audio_features(self, audio_features):
        """Helper method to analyze audio features"""
        try:
            df = pd.DataFrame([f for f in audio_features if f])
            if df.empty:
                return {}
            
            numeric_features = ['danceability', 'energy', 'valence', 'acousticness']
            
            return {
                feature: {
                    'mean': float(df[feature].mean()),
                    'std': float(df[feature].std()) if len(df) > 1 else 0.0
                } for feature in numeric_features if feature in df.columns
            }
        except:
            return {}

@app.route('/api/analytics/comprehensive', methods=['GET'])
def get_comprehensive_analytics():
    try:
        start_time = time.time()
        
        # Get Spotify client
        sp = get_spotify_client()
        if not sp:
            return jsonify({'error': 'Spotify authentication failed'}), 401
        
        analytics = SpotifyAnalytics(sp)
        
        # Get user's data
        top_tracks_short = sp.current_user_top_tracks(limit=50, time_range='short_term')['items']
        top_tracks_medium = sp.current_user_top_tracks(limit=50, time_range='medium_term')['items']
        top_tracks_long = sp.current_user_top_tracks(limit=50, time_range='long_term')['items']
        
        top_artists_short = sp.current_user_top_artists(limit=50, time_range='short_term')['items']
        top_artists_medium = sp.current_user_top_artists(limit=50, time_range='medium_term')['items']
        
        # Comprehensive analysis
        results = {
            'timestamp': datetime.now().isoformat(),
            'time_ranges': {
                'short_term': {
                    'audio_features': analytics.get_audio_features_analysis(top_tracks_short),
                    'genre_analysis': analytics.analyze_genre_patterns(top_artists_short),
                    'top_tracks_count': len(top_tracks_short),
                    'top_artists_count': len(top_artists_short)
                },
                'medium_term': {
                    'audio_features': analytics.get_audio_features_analysis(top_tracks_medium),
                    'genre_analysis': analytics.analyze_genre_patterns(top_artists_medium),
                    'top_tracks_count': len(top_tracks_medium),
                    'top_artists_count': len(top_artists_medium)
                },
                'long_term': {
                    'audio_features': analytics.get_audio_features_analysis(top_tracks_long),
                    'top_tracks_count': len(top_tracks_long)
                }
            }
        }
        
        # Music personality analysis
        short_term_features = results['time_ranges']['short_term']['audio_features']
        results['music_personality'] = analytics.calculate_music_personality(short_term_features)
        
        # Comparative analysis
        results['comparative_analysis'] = {
            'energy_trend': {
                'short_term': short_term_features.get('feature_statistics', {}).get('energy', {}).get('mean', 0),
                'medium_term': results['time_ranges']['medium_term']['audio_features'].get('feature_statistics', {}).get('energy', {}).get('mean', 0),
                'long_term': results['time_ranges']['long_term']['audio_features'].get('feature_statistics', {}).get('energy', {}).get('mean', 0)
            },
            'valence_trend': {
                'short_term': short_term_features.get('feature_statistics', {}).get('valence', {}).get('mean', 0),
                'medium_term': results['time_ranges']['medium_term']['audio_features'].get('feature_statistics', {}).get('valence', {}).get('mean', 0),
                'long_term': results['time_ranges']['long_term']['audio_features'].get('feature_statistics', {}).get('valence', {}).get('mean', 0)
            }
        }
        
        processing_time = time.time() - start_time
        results['processing_time'] = f"{processing_time:.2f} seconds"
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/data-insights', methods=['GET'])
def get_data_insights():
    """Advanced data insights and patterns"""
    try:
        sp = get_spotify_client()
        if not sp:
            return jsonify({'error': 'Spotify authentication failed'}), 401
        
        analytics = SpotifyAnalytics(sp)
        
        # Get comprehensive data
        recent_tracks = sp.current_user_recently_played(limit=50)['items']
        top_tracks = sp.current_user_top_tracks(limit=50)['items']
        saved_tracks = sp.current_user_saved_tracks(limit=50)['items']
        
        # Extract track info
        recent_track_info = [item['track'] for item in recent_tracks]
        saved_track_info = [item['track'] for item in saved_tracks]
        
        # Listening pattern analysis
        recent_timestamps = [item['played_at'] for item in recent_tracks]
        listening_hours = []
        
        for timestamp in recent_timestamps:
            dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            listening_hours.append(dt.hour)
        
        hourly_distribution = Counter(listening_hours)
        
        # Track popularity analysis
        popularity_scores = [track.get('popularity', 0) for track in top_tracks]
        
        insights = {
            'listening_patterns': {
                'hourly_distribution': dict(hourly_distribution),
                'peak_listening_hour': max(hourly_distribution, key=hourly_distribution.get) if hourly_distribution else None,
                'total_recent_plays': len(recent_tracks)
            },
            'music_discovery': {
                'average_track_popularity': statistics.mean(popularity_scores) if popularity_scores else 0,
                'popularity_variance': statistics.stdev(popularity_scores) if len(popularity_scores) > 1 else 0,
                'mainstream_score': len([p for p in popularity_scores if p > 70]) / len(popularity_scores) if popularity_scores else 0
            },
            'library_analysis': {
                'saved_tracks_count': len(saved_track_info),
                'recent_vs_top_overlap': len(set([t['id'] for t in recent_track_info]) & 
                                            set([t['id'] for t in top_tracks])),
                'audio_feature_comparison': {
                    'recent': analytics.get_audio_features_analysis(recent_track_info),
                    'top': analytics.get_audio_features_analysis(top_tracks),
                    'saved': analytics.get_audio_features_analysis(saved_track_info)
                }
            }
        }
        
        return jsonify(insights)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# New Advanced Analytics Endpoints
@app.route('/api/analytics/clustering', methods=['GET'])
def get_music_clustering():
    try:
        sp = get_spotify_client()
        if not sp:
            return jsonify({'error': 'Spotify authentication failed'}), 401
        
        advanced_analytics = AdvancedSpotifyAnalytics(sp)
        
        # Get user's top tracks for clustering
        time_range = request.args.get('time_range', 'medium_term')
        limit = request.args.get('limit', 50, type=int)
        
        top_tracks = sp.current_user_top_tracks(limit=limit, time_range=time_range)['items']
        
        clustering_results = advanced_analytics.cluster_music_preferences(top_tracks)
        clustering_results['time_range'] = time_range
        
        return jsonify(clustering_results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/temporal', methods=['GET'])
def get_temporal_analysis():
    try:
        sp = get_spotify_client()
        if not sp:
            return jsonify({'error': 'Spotify authentication failed'}), 401
        
        advanced_analytics = AdvancedSpotifyAnalytics(sp)
        
        timeframe = request.args.get('days', 30, type=int)
        temporal_results = advanced_analytics.temporal_listening_analysis(timeframe)
        
        return jsonify(temporal_results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/recommendations', methods=['GET'])
def get_recommendation_analysis():
    try:
        sp = get_spotify_client()
        if not sp:
            return jsonify({'error': 'Spotify authentication failed'}), 401
        
        advanced_analytics = AdvancedSpotifyAnalytics(sp)
        
        limit = request.args.get('limit', 20, type=int)
        recommendation_results = advanced_analytics.recommendation_analysis(limit=limit)
        
        return jsonify(recommendation_results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/complete', methods=['GET'])
def get_complete_analytics():
    """Get all analytics in one comprehensive response"""
    try:
        sp = get_spotify_client()
        if not sp:
            return jsonify({'error': 'Spotify authentication failed'}), 401
        
        analytics = SpotifyAnalytics(sp)
        advanced_analytics = AdvancedSpotifyAnalytics(sp)
        
        # Get basic data
        top_tracks = sp.current_user_top_tracks(limit=50)['items']
        top_artists = sp.current_user_top_artists(limit=50)['items']
        
        complete_results = {
            'timestamp': datetime.now().isoformat(),
            'basic_analytics': {
                'audio_features': analytics.get_audio_features_analysis(top_tracks),
                'genre_analysis': analytics.analyze_genre_patterns(top_artists),
                'music_personality': analytics.calculate_music_personality(
                    analytics.get_audio_features_analysis(top_tracks)
                )
            },
            'advanced_analytics': {
                'clustering': advanced_analytics.cluster_music_preferences(top_tracks),
                'temporal': advanced_analytics.temporal_listening_analysis(),
                'recommendations': advanced_analytics.recommendation_analysis()
            }
        }
        
        return jsonify(complete_results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_spotify_client():
    """Initialize Spotify client with proper authentication"""
    try:
        # Method 1: Get token from request headers (frontend passes token)
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            return spotipy.Spotify(auth=token)
        
        # Method 2: Server-side OAuth using environment variables
        client_id = os.environ.get('SPOTIPY_CLIENT_ID')
        client_secret = os.environ.get('SPOTIPY_CLIENT_SECRET')
        redirect_uri = os.environ.get('SPOTIPY_REDIRECT_URI')
        
        if client_id and client_secret and redirect_uri:
            scope = "user-read-recently-played user-top-read user-library-read user-read-playback-state"
            sp_oauth = SpotifyOAuth(
                client_id=client_id,
                client_secret=client_secret,
                redirect_uri=redirect_uri,
                scope=scope,
                cache_path=".cache"
            )
            
            token_info = sp_oauth.get_cached_token()
            if token_info:
                return spotipy.Spotify(auth=token_info['access_token'])
        
        return None
        
    except Exception as e:
        print(f"Spotify client initialization error: {e}")
        return None

if __name__ == '__main__':
    app.run(debug=True, port=5000)