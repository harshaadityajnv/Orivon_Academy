from fastapi import APIRouter, HTTPException
from ..db import supabase_client

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("")
def list_courses():
    try:
        # fetch raw fields and map to frontend-friendly keys
        res = supabase_client.table('courses').select('id,title,badge,desc,img,price').order('id', desc=False).execute()
        rows = res.data or []
        # map 'desc' -> 'description', 'img' -> 'imageUrl'
        mapped = []
        for r in rows:
            mapped.append({
                'id': r.get('id'),
                'title': r.get('title'),
                'badge': r.get('badge'),
                'description': r.get('desc'),
                'imageUrl': r.get('img'),
                'price': r.get('price'),
            })
        return mapped
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
