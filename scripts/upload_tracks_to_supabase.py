import os
import json
import requests

# Script to upload TRACKS from frontend/data/tracks.ts into Supabase 'courses' table.
# Requires environment variables SUPABASE_URL and SUPABASE_KEY (service_role or anon with insert privileges).

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print('Please set SUPABASE_URL and SUPABASE_KEY environment variables before running.')
    print('Example (PowerShell):')
    print('$env:SUPABASE_URL="https://<your-project>.supabase.co"; $env:SUPABASE_KEY="<service-key>"; python scripts\\upload_tracks_to_supabase.py')
    exit(1)

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

# Data copied from frontend/data/tracks.ts
tracks = [
    {
        'id': 1001,
        'title': 'Orivon Certified Generative AI & LLM Engineer',
        'badge': 'Artificial Intelligence',
        'desc': 'Build expertise in Generative AI and LLMs. Master concepts, models, and workflows in Artificial Intelligence.',
        'img': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=60',
        'price': 7000
    },
    {
        'id': 1002,
        'title': 'Orivon Certified AI & Data Analyst – Foundation',
        'badge': 'Cloud Computing',
        'desc': 'Master AWS services, architecture, and security. Prepare for Solutions Architect exams.',
        'img': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=60',
        'price': 3500
    },
    {
        'id': 1003,
        'title': 'Orivon Certified AI Automation & No-Code Engineer',
        'badge': 'Industry Standard',
        'desc': 'CI/CD pipelines, Docker, Kubernetes, Terraform, and infrastructure as code.',
        'img': 'https://images.unsplash.com/photo-1667372393119-c85c02088947?auto=format&fit=crop&w=800&q=60',
        'price': 7000
    },
    {
        'id': 1004,
        'title': 'Orivon Certified Cloud & DevOps Architect',
        'badge': 'Trending',
        'desc': 'Build LLM apps with LangChain, master prompt engineering, and implement RAG systems.',
        'img': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=60',
        'price': 7000
    },
    {
        'id': 1005,
        'title': 'Orivon Certified Cybersecurity & Ethical Hacking Specialist',
        'badge': 'Big Data',
        'desc': 'Data warehousing, ETL pipelines, Apache Spark, and modern data stack tools.',
        'img': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=60',
        'price': 7000
    },
    {
        'id': 1006,
        'title': 'Orivon Certified Full Stack Developer – Foundation',
        'badge': 'Web Dev',
        'desc': 'React, Node, DBs & deployment end-to-end.',
        'img': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=60',
        'price': 3500
    }
]

endpoint = SUPABASE_URL.rstrip('/') + '/rest/v1/courses'

print(f'Uploading {len(tracks)} tracks to {endpoint} ...')

resp = requests.post(endpoint, headers=headers, data=json.dumps(tracks))

if resp.status_code in (200, 201):
    try:
        returned = resp.json()
        print('Success. Inserted rows:')
        print(json.dumps(returned, indent=2))
    except Exception:
        print('Success. Response:')
        print(resp.text)
else:
    print(f'Failed to insert. Status: {resp.status_code}')
    try:
        print(resp.json())
    except Exception:
        print(resp.text)
