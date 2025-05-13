import * as fs from 'fs';
import * as path from 'path';

const inputDir = path.join(__dirname, 'json-labels');
const outputFile = path.join(__dirname, 'labels.json');

function aggregateJsonFiles() {
  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory "${inputDir}" does not exist.`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(inputDir)
    .filter((file) => file.endsWith('.json'));
  const aggregatedData: Record<string, any>[] = [];

  files.forEach((file) => {
    const filePath = path.join(inputDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    try {
      const jsonData = JSON.parse(fileContent);
      if (Array.isArray(jsonData)) {
        aggregatedData.push(...jsonData);
      } else {
        aggregatedData.push(jsonData);
      }
    } catch (error) {
      console.error(`Failed to parse JSON file: ${filePath}`, error);
    }
  });

  // Delete old JSON files
  files.forEach((file) => {
    const filePath = path.join(inputDir, file);
    fs.unlinkSync(filePath);
    console.log(`Deleted file: ${filePath}`);
  });

  fs.writeFileSync(
    outputFile,
    JSON.stringify(aggregatedData, null, 2),
    'utf-8'
  );
  console.log(`Aggregated JSON written to "${outputFile}"`);
}

aggregateJsonFiles();
