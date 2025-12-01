Download courses from Supabase and update `frontend/data/tracks.ts`

This script fetches rows from the Supabase `courses` table and writes them into `frontend/data/tracks.ts` as the `TRACKS` array.

Requirements
- Python 3.x
- `requests` package: `pip install requests`
- Environment variables set: `SUPABASE_URL` and `SUPABASE_KEY` (service_role key recommended for read access if RLS present)

Run (PowerShell):

```powershell
$env:SUPABASE_URL = "https://<your-project>.supabase.co"
$env:SUPABASE_KEY = "<your-service-key>"
python scripts\download_courses_to_tracks.py
```

Behavior
- The script calls the Supabase REST endpoint `/rest/v1/courses?select=id,title,badge,desc,img,price` and orders rows by `id`.
- It creates/overwrites `frontend/data/tracks.ts` with the fetched rows, mapping table columns to object fields:
  - `title` -> `title`
  - `badge` -> `badge`
  - `desc`  -> `desc`
  - `img`   -> `img`
  - `price` -> `price` and `originalPrice`
- Make a backup of your `frontend/data/tracks.ts` if you have local edits you want to preserve.

If your `courses` table uses different column names, edit the script accordingly.
