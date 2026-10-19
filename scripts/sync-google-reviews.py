#!/usr/bin/env python3
"""Refresh public review totals using Google Places API (New) server-side."""
import json
import os
import sys
from pathlib import Path
from urllib.request import Request, urlopen

key = os.getenv('GOOGLE_PLACES_API_KEY')
place_id = os.getenv('GOOGLE_PLACE_ID')
if not key or not place_id:
    sys.exit('Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID configuration')
if not place_id.startswith('ChIJ') and not place_id.startswith('places/'):
    sys.exit('Unexpected Google Place ID format')
place_id = place_id.removeprefix('places/')
url = 'https://places.googleapis.com/v1/places/' + place_id
request = Request(url, headers={'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount', 'Accept': 'application/json'})
with urlopen(request, timeout=20) as resp:
    data = json.load(resp)
name = data.get('displayName', {}).get('text', '')
if 'jeff electric' not in name.lower():
    sys.exit('Google returned a different business; refusing to change website review count')
n = data.get('userRatingCount')
r = data.get('rating')
if not isinstance(n, int) or isinstance(n, bool) or n < 0 or not isinstance(r, (int, float)) or not 1 <= r <= 5:
    sys.exit('Invalid Google review metrics')
result = {'rating': round(r, 1), 'userRatingCount': n, 'source': 'google-places-api'}
Path('google-reviews.json').write_text(json.dumps(result, indent=2) + '\\n', encoding='utf-8')
print(f'Google reviews refreshed: {n} reviews, {r:.1f} stars')
