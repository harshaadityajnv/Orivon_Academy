export async function generateCertificatePNG(name: string, courseTitle: string): Promise<Blob> {
  // Use the backend-served template image and overlay name & course
  const width = 1600;
  const height = 1000;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // load template from backend
  // prefer explicit backend URL from env, otherwise default to localhost backend
  const backend = ((import.meta as any)?.env?.VITE_BACKEND_URL) || 'http://localhost:8000';
  const url = `${backend.replace(/\/$/, '')}/payments/certificates/template`;

  const img = new Image();
  img.crossOrigin = 'anonymous';

  // attach handlers before setting src to avoid missing cached loads
  const loadPromise = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load template image'));
  });
  img.src = url;

  // try to load template; if it fails, fall back to a plain white background
  try {
    await loadPromise;
    // draw template
    ctx.drawImage(img, 0, 0, width, height);
  } catch (err) {
    // fallback: plain background
    console.warn('Could not load certificate template, drawing fallback background:', err);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  // overlay adjustments: match positions on template
  ctx.textAlign = 'center';

  // Place course title where the name used to be (center area)
  ctx.fillStyle = '#0f172a';
  let courseFontSize = 56;
  ctx.font = `700 ${courseFontSize}px sans-serif`;
  let courseMeasured = ctx.measureText(courseTitle).width;
  while (courseMeasured > width - 300 && courseFontSize > 28) {
    courseFontSize -= 2;
    ctx.font = `700 ${courseFontSize}px sans-serif`;
    courseMeasured = ctx.measureText(courseTitle).width;
  }
  // outline for readability
  ctx.lineWidth = Math.max(6, Math.round(courseFontSize / 8));
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  // Move course title one line down from its previous position
  const courseY = 430 + Math.round(courseFontSize * 1.2);
  ctx.strokeText(courseTitle, width / 2, courseY);
  ctx.fillText(courseTitle, width / 2, courseY);

  // Place recipient name below the "PRESENTED TO" in the template
  // (reduced size per request)
  ctx.fillStyle = '#0f172a';
  let nameFontSize = 40; // reduced size
  ctx.font = `800 ${nameFontSize}px serif`;
  let nameMeasured = ctx.measureText(name).width;
  while (nameMeasured > width - 320 && nameFontSize > 20) {
    nameFontSize -= 1;
    ctx.font = `800 ${nameFontSize}px serif`;
    nameMeasured = ctx.measureText(name).width;
  }
  ctx.lineWidth = Math.max(4, Math.round(nameFontSize / 10));
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  // y-position: a bit below the "PRESENTED TO" label — choose 520 to avoid overlap
  const nameY = 660;
  ctx.strokeText(name, width / 2, nameY);
  ctx.fillText(name, width / 2, nameY);

  // Do NOT render the tagline or date — the background already contains them.

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Failed to render certificate'));
    }, 'image/png');
  });
}
