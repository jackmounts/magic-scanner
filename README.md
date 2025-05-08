# Magic Scanner (WIP)

Node module for scanning mtg cards on the go on all js apps

## Todos

- [ ] Create utils to generate dataset automatically
- [ ] Create training functions to generate a model with tensorflow.js
- [ ] Create APIs for the module (like "detectCard(...)")
- [ ] Create CICD pipes w/npm pub integration
- [ ] Learn something in the middle

## Commands

```bash
# Install dependencies
npm install

# (Optional) Get card and background images
npm run fetch-bulk

# Generate randomic images (bg+(card+saturation+brightness+rotation)) and create labels for dataset
npm run gen-syn

# Create model, train it and quantize it
npm run train
```
