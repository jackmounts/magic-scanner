import * as tf from '@tensorflow/tfjs-node';

export function buildDetector(): tf.LayersModel {
  const input = tf.input({ shape: [488, 680, 3] });
  let x = tf.layers
    .conv2d({ filters: 16, kernelSize: 3, strides: 2, activation: 'relu' })
    .apply(input) as tf.SymbolicTensor;
  x = tf.layers.maxPooling2d({ poolSize: 2 }).apply(x) as tf.SymbolicTensor;
  x = tf.layers
    .conv2d({ filters: 32, kernelSize: 3, strides: 2, activation: 'relu' })
    .apply(x) as tf.SymbolicTensor;
  x = tf.layers.flatten().apply(x) as tf.SymbolicTensor;
  x = tf.layers
    .dense({ units: 128, activation: 'relu' })
    .apply(x) as tf.SymbolicTensor;
  const output = tf.layers
    .dense({ units: 4, activation: 'sigmoid' })
    .apply(x) as tf.SymbolicTensor;
  const model = tf.model({ inputs: input, outputs: output });
  model.compile({ optimizer: tf.train.adam(0.001), loss: 'meanSquaredError' });
  return model;
}
