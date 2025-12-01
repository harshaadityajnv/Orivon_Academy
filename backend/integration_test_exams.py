from fastapi.testclient import TestClient
from app.main import app
from app.auth import get_current_user
import json

# Override authentication dependency so TestClient requests run as a fake user
app.dependency_overrides[get_current_user] = lambda: {
    'User_id': 'test-user-1',
    'role': 'student',
    'email': 'integration@test.local',
    'display_name': 'Integration Tester'
}

client = TestClient(app)

print('Creating exam attempt...')
resp = client.post('/exams', json={'title': 'Integration Test Course', 'certification_id': 'test-cert-001'})
print('POST /exams ->', resp.status_code)
try:
    print(resp.json())
except Exception:
    print(resp.text)

if resp.status_code not in (200, 201):
    print('Create attempt failed; aborting')
    raise SystemExit(1)

exma_id = resp.json().get('exma_id')
if not exma_id:
    print('No exma_id returned; aborting')
    raise SystemExit(1)

print('Completing exam with passing score... exma_id=', exma_id)
payload = {
    'exma_id': exma_id,
    'title': 'Integration Test Course',
    'certification_id': 'test-cert-001',
    'passing_score': 85,
    'questions': 10,
    'nameofuser': 'Integration Tester',
    'pass_status': True
}
resp2 = client.put(f'/exams/{exma_id}', json=payload)
print('PUT /exams/{id} ->', resp2.status_code)
try:
    print(resp2.json())
except Exception:
    print(resp2.text)

print('Checking availability...')
resp3 = client.get('/exams/certification/test-cert-001/availability')
print('GET availability ->', resp3.status_code)
try:
    print(json.dumps(resp3.json(), indent=2))
except Exception:
    print(resp3.text)

print('Done')
