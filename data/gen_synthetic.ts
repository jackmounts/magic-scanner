import fs from 'fs';
import sharp from 'sharp';
import { applyAffine, randomAffine } from './utils';
import cliProgress from 'cli-progress';

const CARD_DIR = 'data/cards/';
const BG_DIR = 'data/backgrounds/';
const OUT_DIR = 'data/synthetic/';
const LABELS: {
  file: string;
  points: { x: number; y: number }[];
}[] = [];
let latestCardUsed: string | null = null;

async function gen() {
  console.log('Starting synthetic data generation...');
  await fs.promises.mkdir(OUT_DIR, { recursive: true });
  const cards = fs.readdirSync(CARD_DIR);
  const bgs = fs.readdirSync(BG_DIR);
  const totalImages = 5000;

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  progressBar.start(totalImages, 0);

  for (let i = 0; i < totalImages; i++) {
    const cardFile = cards[i % cards.length];
    latestCardUsed = cardFile;
    const bgFile = bgs[Math.floor(Math.random() * bgs.length)];
    const { a, b, c, d, targetW, targetH, dx, dy } = randomAffine();
    let cardSharp = sharp(`${CARD_DIR}/${cardFile}`)
      .resize({ width: targetW, height: targetH })
      .modulate({
        brightness: 0.8 + Math.random() * 0.4,
        saturation: 0.9 + Math.random() * 0.2,
      })
      .affine(
        [
          [a, b],
          [c, d],
        ],
        {
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        }
      );
    const cardBuffer = await cardSharp.png().toBuffer();
    const compositeBuf = await sharp(`${BG_DIR}/${bgFile}`)
      .resize(1920, 1080)
      .composite([{ input: cardBuffer, left: dx, top: dy }])
      .png()
      .toBuffer();

    const corners = [
      applyAffine(0, 0, a, b, c, d, dx, dy),
      applyAffine(targetW, 0, a, b, c, d, dx, dy),
      applyAffine(targetW, targetH, a, b, c, d, dx, dy),
      applyAffine(0, targetH, a, b, c, d, dx, dy),
    ];
    const points = corners.map((p) => ({
      x: p.x / 1280,
      y: p.y / 720,
    }));

    LABELS.push({
      file: `img_${i}.png`,
      points,
    });
    fs.writeFileSync(`${OUT_DIR}/img_${i}.png`, compositeBuf);

    progressBar.update(i + 1);
  }

  progressBar.stop();
  fs.writeFileSync('data/labels.json', JSON.stringify(LABELS, null, 2));
  console.log('Synthetic data generation complete.');
}

gen().catch((error) => {
  console.error('An error occurred:', error);
  if (latestCardUsed) {
    console.error('Latest card used:', latestCardUsed);
  }
  process.exit(1);
});
