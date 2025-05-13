import fs from 'fs';
import sharp from 'sharp';
import { applyAffine, randomAffine, yolo_labels } from './utils';
import cliProgress from 'cli-progress';

const startIdx = parseInt(process.argv[2] || '0', 10);
const endIdx = parseInt(process.argv[3] || '5000', 10);
const workerId = process.argv[4] || '';

const CARD_DIR = 'data/cards/';
const BG_DIR = 'data/backgrounds/';
const LABEL_DIR = 'data/yolo-labels/';
const OUT_DIR = 'data/synthetic/';
const LABELS: {
  file: string;
  points: { x: number; y: number }[];
}[] = [];
let latestCardUsed: string | null = null;

async function gen() {
  try {
    console.log(`[${workerId}] Starting synthetic data generation...`);
    await fs.promises.mkdir(OUT_DIR, { recursive: true });
    await fs.promises.mkdir(LABEL_DIR, { recursive: true });

    const cards = fs.readdirSync(CARD_DIR);
    const bgs = fs.readdirSync(BG_DIR);
    const totalImages = endIdx - startIdx;

    if (totalImages <= 0) {
      console.error(`[${workerId}] Invalid range for image generation.`);
      return;
    }
    if (cards.length === 0 || bgs.length === 0) {
      throw new Error(`[${workerId}] No cards or backgrounds found.`);
    }

    const progressBar = new cliProgress.SingleBar(
      { format: `[${workerId}] {bar} {percentage}% | {value}/{total}` },
      cliProgress.Presets.shades_classic
    );
    progressBar.start(totalImages, 0);

    for (let i = startIdx; i < endIdx; i++) {
      try {
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
          x: p.x / 1920,
          y: p.y / 1080,
        }));

        LABELS.push({
          file: `img_${i}.png`,
          points: corners,
        });

        try {
          fs.writeFileSync(`${OUT_DIR}/img_${i}.png`, compositeBuf);
        } catch (err) {
          console.error(`[${workerId}] Error writing image img_${i}.png:`, err);
        }
        try {
          fs.writeFileSync(`${LABEL_DIR}/img_${i}.txt`, yolo_labels(points));
        } catch (err) {
          console.error(`[${workerId}] Error writing label img_${i}.txt:`, err);
        }

        progressBar.update(i - startIdx + 1);
      } catch (imgErr) {
        console.error(`[${workerId}] Error processing image ${i}:`, imgErr);
        if (latestCardUsed) {
          console.error(`[${workerId}] Latest card used:`, latestCardUsed);
        }
      }
    }

    progressBar.stop();
    await fs.promises.mkdir('data/json-labels', { recursive: true });
    try {
      fs.writeFileSync(
        `data/json-labels/labels_${startIdx}_${endIdx}.json`,
        JSON.stringify(LABELS, null, 2)
      );
    } catch (err) {
      console.error(`[${workerId}] Error writing labels JSON:`, err);
    }
    console.log(
      `[${workerId}] Synthetic data generation complete for range ${startIdx}-${endIdx}.`
    );
  } catch (error) {
    console.error(`[${workerId}] Fatal error:`, error);
    if (latestCardUsed) {
      console.error(`[${workerId}] Latest card used:`, latestCardUsed);
    }
    process.exit(1);
  }
}

gen();
