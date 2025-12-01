Upload TRACKS to Supabase `courses` table

This script will POST multiple rows to your Supabase `courses` table. It expects two environment variables:

- `SUPABASE_URL` — your Supabase project URL (e.g. https://xxxxx.supabase.co)
- `SUPABASE_KEY` — your Supabase API key (service_role recommended for inserts)

Run (PowerShell):

```powershell
$env:SUPABASE_URL="https://<your-project>.supabase.co"
$env:SUPABASE_KEY="<your-service-role-key>"
python scripts\upload_tracks_to_supabase.py
```

Note: Ensure the `courses` table has columns: `id` (int), `title` (text), `badge` (text), `desc` (text), `img` (text), `price` (numeric/int). Adjust the script if your column names differ.
