export async function signInWithGoogle(id_token: string) {
  const API_URL = import.meta.env.VITE_API_URL || '';
  const url = `${API_URL.replace(/\/$/, '')}/auth/google`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || 'Google sign-in failed');
    }

    return res.json();
  } catch (err: any) {
    console.error('signInWithGoogle network error', { url, err });
    throw new Error(err?.message || 'Network error while contacting auth service');
  }
}
