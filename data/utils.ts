export interface AffineParams {
  a: number;
  b: number;
  c: number;
  d: number;
  targetW: number;
  targetH: number;
  dx: number;
  dy: number;
}

export function randomAffine(): AffineParams {
  const bgW = 1280;
  const bgH = 720;
  const cardW = 488;
  const cardH = 680;
  const aspect = cardW / cardH;
  const scale = 0.65 + Math.random() * 0.45; // from 65% to 110% of the scale
  const targetH = Math.floor(cardH * scale);
  const targetW = Math.floor(targetH * aspect);
  const angle = (Math.random() - 0.5) * 2 * Math.PI; // -PI to +PI (full rotation) --> -180 to +180 degrees
  const shearX = (Math.random() - 0.5) * (Math.PI / 36);
  const shearY = (Math.random() - 0.5) * (Math.PI / 36);

  const a = Math.cos(angle) * scale;
  const b = Math.sin(angle) * scale;
  const c = -Math.sin(angle + shearY) * scale;
  const d = Math.cos(angle + shearX) * scale;

  // Ensure the card fits within the new background size
  const dx = Math.floor(Math.random() * (bgW - targetW));
  const dy = Math.floor(Math.random() * (bgH - targetH));

  return { a, b, c, d, targetW, targetH, dx, dy };
}

export function applyAffine(
  x: number,
  y: number,
  a: number,
  b: number,
  c: number,
  d: number,
  dx: number,
  dy: number
) {
  return {
    x: a * x + b * y + dx,
    y: c * x + d * y + dy,
  };
}
