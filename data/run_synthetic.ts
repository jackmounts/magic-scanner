import { fork } from 'child_process';
import fs from 'fs';

const totalImages = 5000;
const numWorkers = 4;
const imagesPerWorker = Math.ceil(totalImages / numWorkers);

(async () => {
  if (!fs.existsSync('data/yolo-labels/')) {
    await fs.promises.mkdir('data/yolo-labels/', { recursive: true });
  }

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
