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

export function yolo_labels(points: { x: number; y: number }[]): string {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const x_center = ((minX + maxX) / 2).toFixed(6);
  const y_center = ((minY + maxY) / 2).toFixed(6);
  const width = (maxX - minX).toFixed(6);
  const height = (maxY - minY).toFixed(6);

  // Class id 0 for every card
  return `0 ${x_center} ${y_center} ${width} ${height}`;
}
