import * as tf from '@tensorflow/tfjs';

let model: tf.GraphModel | null = null;

export async function loadModel() {
  if (!model) {
    model = await tf.loadGraphModel('/web_model/tfjs_detector/model.json');
  }
}

export async function detectCard(video: HTMLVideoElement) {
  if (!model) throw new Error('Model not loaded');

  const inputTensor = tf.tidy(() => {
    const frame = tf.browser.fromPixels(video).toFloat();
    const resized = tf.image.resizeBilinear(frame, [224, 224]);
    const normalized = resized.div(255);
    return normalized.expandDims(0);
  });

  const result = model.execute({ input_1: inputTensor }) as tf.Tensor;

  const data = await result.data();
  tf.dispose([inputTensor, result]);

  const [x, y, w, h] = data;
  return { x, y, w, h };
}
