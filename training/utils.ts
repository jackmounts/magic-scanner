import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export async function loadDataset(batch = 16) {
  const labels: Rect[] = JSON.parse(
    fs.readFileSync('data/labels.json', 'utf-8')
  );
  return tf.data
    .generator(function* () {
      for (let i = 0; i < labels.length; i++) {
        const img = tf.node
          .decodeImage(fs.readFileSync(`data/synthetic/img_${i}.png`), 3)
          .resizeBilinear([480, 640])
          .div(255);
        yield {
          xs: img,
          ys: tf.tensor1d([labels[i].x, labels[i].y, labels[i].w, labels[i].h]),
        };
      }
    })
    .batch(batch)
    .shuffle(1000);
}
