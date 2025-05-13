import { fork } from 'child_process';
import fs from 'fs';

const totalImages = 5000;
const numWorkers = 4;
const imagesPerWorker = Math.ceil(totalImages / numWorkers);
const CSV_PATH = 'data/annotations.csv';

(async () => {
  fs.writeFileSync(CSV_PATH, 'filename,x_min,y_min,width,height\n');

  for (let i = 0; i < numWorkers; i++) {
    const start = i * imagesPerWorker;
    const end = Math.min(start + imagesPerWorker, totalImages);

    fork(
      'data/gen_synthetic.ts',
      [start.toString(), end.toString(), `worker${i}`],
      {
        // TODO: aggregated progress bars
        stdio: 'inherit',
      }
    );
  }
})();
