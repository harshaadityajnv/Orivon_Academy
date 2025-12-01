import os
import requests
import json

# Fetch courses from Supabase and write to frontend/data/tracks.ts
# Expects SUPABASE_URL and SUPABASE_KEY in env

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print('Please set SUPABASE_URL and SUPABASE_KEY environment variables.')
    print('PowerShell example:')
    print('$env:SUPABASE_URL="https://<your-project>.supabase.co"; $env:SUPABASE_KEY="<service_key>"; python scripts\\download_courses_to_tracks.py')
    exit(1)

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
}

endpoint = SUPABASE_URL.rstrip('/') + '/rest/v1/courses?select=id,title,badge,desc,img,price&order=id.asc'
print('Fetching courses from', endpoint)
resp = requests.get(endpoint, headers=headers)
if resp.status_code != 200:
    print('Failed to fetch courses:', resp.status_code)
    try:
        print(resp.json())
    except Exception:
        print(resp.text)
    exit(1)

courses = resp.json()
print(f'Fetched {len(courses)} rows')

# Build TypeScript file content
lines = []
lines.append("import { CourseTrack } from '../types';\n")
lines.append('export const TRACKS: CourseTrack[] = [')

for row in courses:
    title = row.get('title') or ''
    badge = row.get('badge') or ''
    desc = row.get('desc') or ''
    img = row.get('img') or ''
    price = row.get('price') if row.get('price') is not None else 0

    # JSON-encode strings so special chars are escaped properly in TS
    title_js = json.dumps(title, ensure_ascii=False)
    badge_js = json.dumps(badge, ensure_ascii=False)
    desc_js = json.dumps(desc, ensure_ascii=False)
    img_js = json.dumps(img, ensure_ascii=False)

    block = f"  {{\n      title: {title_js},\n      badge: {badge_js},\n      desc: {desc_js},\n      img: {img_js},\n      price: {price},\n      originalPrice: {price}\n  }},"
    lines.append(block)

lines.append('];\n')

content = '\n'.join(lines)

target_path = os.path.join('frontend', 'data', 'tracks.ts')
print('Writing to', target_path)
with open(target_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done. Updated', target_path)
