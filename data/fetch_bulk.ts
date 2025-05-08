import fs from 'fs';
import https from 'https';
import { pipeline } from 'stream';
import { promisify } from 'util';

const BULK_URL =
  'https://data.scryfall.io/default-cards/default-cards-20250507213144.json';
const pipe = promisify(pipeline);

async function fetchBulk() {
  console.log('Starting bulk data fetch...');

  const json: any[] = await new Promise((res, rej) => {
    https.get(BULK_URL, (r) => {
      let data = '';
      const total = parseInt(r.headers['content-length'] || '0', 10);
      let received = 0;

      r.on('data', (chunk) => {
        received += chunk.length;
        data += chunk;
        if (total) {
          const percentage = ((received / total) * 100).toFixed(2);
          process.stdout.write(`\rDownloading bulk data: ${percentage}%`);
        }
      });

      r.on('end', () => {
        process.stdout.write('\n');
        res(JSON.parse(data));
      });

      r.on('error', rej);
    });
  });

  console.log('Bulk data downloaded. Saving to file...');
  fs.writeFileSync('data/bulk.json', JSON.stringify(json));
  console.log('Bulk data saved to data/bulk.json.');

  console.log('Creating images directory...');
  await fs.promises.mkdir('data/cards', { recursive: true });

  console.log('Starting image downloads...');
  for (const [index, card] of json.slice(0, 5000).entries()) {
    const url = card.image_uris?.normal;
    if (!url) continue;
    const outPath = `data/cards/card_${index}.jpg`;

    await new Promise((res, rej) => {
      https
        .get(url, (resp) => {
          const total = parseInt(resp.headers['content-length'] || '0', 10);
          let received = 0;

          resp.on('data', (chunk) => {
            received += chunk.length;
            if (total) {
              const percentage = ((received / total) * 100).toFixed(2);
              process.stdout.write(
                `\rDownloading image ${index + 1}/5000: ${percentage}%`
              );
            }
          });

          resp.on('end', () => {
            process.stdout.write('\n');
          });

          pipe(resp, fs.createWriteStream(outPath)).then(res).catch(rej);
        })
        .on('error', rej);
    });
  }

  console.log('All images downloaded.');
  console.log('Bulk and images download complete.');
}

fetchBulk().catch(console.error);
