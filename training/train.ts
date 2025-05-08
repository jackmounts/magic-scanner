import { buildDetector } from './model';
import { loadDataset } from './utils';

(async () => {
  const model = buildDetector();
  const ds = await loadDataset(8);
  await model.fitDataset(ds, { epochs: 30 });
  await model.save('file://tfjs_model');
  console.log('Detector ready!');
})();
