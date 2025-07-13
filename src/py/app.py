from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import pandas as pd
from collections import defaultdict
import calendar

app = Flask(__name__)
CORS(app)

class ListeningTimeAnalyzer:
    def analyze_provided_data(self, recent_tracks_data):
        try:
            if not recent_tracks_data or 'items' not in recent_tracks_data:
                return self._get_empty_analytics()
            listening_data = []
            for item in recent_tracks_data['items']:
                track = item['track']
                played_at = datetime.fromisoformat(item['played_at'].replace('Z', '+00:00'))
                duration_minutes = track['duration_ms'] / (1000 * 60)
                listening_data.append({
                    'played_at': played_at,
                    'duration_minutes': duration_minutes,
                    'track_name': track['name'],
                    'artist_name': track['artists'][0]['name'] if track['artists'] else 'Unknown'
                })
            df = pd.DataFrame(listening_data)
            if df.empty:
                return self._get_empty_analytics()
            return {
                'total_listening_time': self._calculate_total_time(df),
                'weekly_analytics': self._calculate_weekly_analytics(df),
                'monthly_analytics': self._calculate_monthly_analytics(df),
                'daily_average': self._calculate_daily_average(df),
                'peak_listening_hours': self._calculate_peak_hours(df),
            }
        except Exception as e:
            print(f"Error in provided data analysis: {e}")
            return self._get_empty_analytics()
    
    def _calculate_total_time(self, df):
        total_minutes = df['duration_minutes'].sum()
        return {
            'total_minutes': round(total_minutes, 2),
            'total_hours': round(total_minutes / 60, 2),
            'formatted': self._format_duration(total_minutes)
        }
    
    def _calculate_weekly_analytics(self, df):
        now = datetime.now()
        weekly_data = defaultdict(float)
        
        for _, row in df.iterrows():
            played_date = row['played_at'].date()
            week_start = played_date - timedelta(days=played_date.weekday())
            week_key = week_start.strftime('%Y-W%U')
            weekly_data[week_key] += row['duration_minutes']
        
        last_4_weeks = []
        for i in range(4):
            week_start = now.date() - timedelta(days=now.weekday() + (i * 7))
            week_key = week_start.strftime('%Y-W%U')
            minutes = weekly_data.get(week_key, 0)
            last_4_weeks.append({
                'week': f"Week of {week_start.strftime('%B %d')}",
                'minutes': round(minutes, 2),
                'formatted': self._format_duration(minutes)
            })
        
        return {'last_4_weeks': last_4_weeks}
    
    def _calculate_monthly_analytics(self, df):
        monthly_data = defaultdict(float)
        for _, row in df.iterrows():
            month_key = row['played_at'].strftime('%Y-%m')
            monthly_data[month_key] += row['duration_minutes']
        
        now = datetime.now()
        last_6_months = []
        for i in range(6):
            if now.month - i > 0:
                month, year = now.month - i, now.year
            else:
                month, year = 12 + (now.month - i), now.year - 1
            
            month_key = f"{year}-{month:02d}"
            minutes = monthly_data.get(month_key, 0)
            last_6_months.append({
                'month': f"{calendar.month_name[month]} {year}",
                'minutes': round(minutes, 2),
                'formatted': self._format_duration(minutes)
            })
        
        return {'last_6_months': last_6_months}
    
    def _calculate_daily_average(self, df):
        if df.empty:
            return {'minutes': 0, 'formatted': '0 minutes'}
        
        df['date'] = df['played_at'].dt.date
        daily_totals = df.groupby('date')['duration_minutes'].sum()
        average_minutes = daily_totals.mean()
        
        return {
            'minutes': round(average_minutes, 2),
            'formatted': self._format_duration(average_minutes)
        }
    
    def _calculate_peak_hours(self, df):
        if df.empty:
            return {}
        
        df['hour'] = df['played_at'].dt.hour
        hourly_totals = df.groupby('hour')['duration_minutes'].sum()
        peak_hour = hourly_totals.idxmax()
        
        return {
            'peak_hour': peak_hour,
            'peak_hour_formatted': f"{peak_hour:02d}:00 - {peak_hour+1:02d}:00",
            'hourly_breakdown': {hour: round(minutes, 2) for hour, minutes in hourly_totals.items()}
        }
    
    def _format_duration(self, minutes):
        if minutes < 60:
            return f"{int(minutes)} minutes"
        elif minutes < 1440:
            hours = int(minutes // 60)
            mins = int(minutes % 60)
            return f"{hours}h {mins}m"
        else:
            days = int(minutes // 1440)
            hours = int((minutes % 1440) // 60)
            return f"{days}d {hours}h"
    
    def _get_empty_analytics(self):
        return {
            'total_listening_time': {'total_minutes': 0, 'total_hours': 0, 'formatted': '0 minutes'},
            'weekly_analytics': {'last_4_weeks': []},
            'monthly_analytics': {'last_6_months': []},
            'daily_average': {'minutes': 0, 'formatted': '0 minutes'},
            'peak_listening_hours': {}
        }

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "Spotify Analytics API"})

@app.route('/api/analytics/top-tracks', methods=['POST'])
def get_top_tracks():
    try:
        data = request.get_json()
        top_tracks_data = data.get('top_tracks_data')
        if not top_tracks_data:
            return jsonify({"success": False, "error": "Top tracks data required"}), 400
        return jsonify({"success": True, "data": top_tracks_data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/analytics/top-artists', methods=['POST'])
def get_top_artists():
    try:
        data = request.get_json()
        top_artists_data = data.get('top_artists_data')
        if not top_artists_data:
            return jsonify({"success": False, "error": "Top artists data required"}), 400
        return jsonify({"success": True, "data": top_artists_data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/analytics/overview', methods=['POST'])
def get_analytics_overview():
    try:
        data = request.get_json()
        overview_data = data.get('overview_data')
        if not overview_data:
            return jsonify({"success": False, "error": "Overview data required"}), 400
        user_info = overview_data.get('user')
        top_tracks = overview_data.get('top_tracks')
        top_artists = overview_data.get('top_artists')
        overview = {
            "user": user_info,
            "track_count": len(top_tracks.get('items', [])) if top_tracks else 0,
            "artist_count": len(top_artists.get('items', [])) if top_artists else 0,
            "total_followers": user_info.get('followers', {}).get('total', 0) if user_info else 0
        }
        return jsonify({"success": True, "data": overview})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/analytics/complete', methods=['POST'])
def complete_analytics():
    try:
        data = request.get_json()
        spotify_data = data.get('spotify_data')
        if not spotify_data:
            return jsonify({"success": False, "error": "Spotify data required"}), 400
        user_info = spotify_data.get('user')
        top_tracks = spotify_data.get('top_tracks')
        top_artists = spotify_data.get('top_artists')
        recent_tracks = spotify_data.get('recent_tracks')
        listening_analytics = {}
        if recent_tracks:
            analyzer = ListeningTimeAnalyzer()
            listening_analytics = analyzer.analyze_provided_data(recent_tracks)
        analytics_data = {
            "user": user_info,
            "top_tracks": top_tracks,
            "top_artists": top_artists,
            "recent_tracks": recent_tracks,
            "listening_time_analytics": listening_analytics
        }
        return jsonify({
            "success": True,
            "data": analytics_data,
            "generated_at": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
