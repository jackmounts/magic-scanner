# Magic Scanner (WIP)

Node module for scanning mtg cards on the go on all js apps.

## Todos

- [x] Create utils to generate dataset automatically
- [ ] Create training functions to generate a model with tensorflow.js
- [ ] Create APIs for the module (like "detectCard(...)")
- [ ] Create CICD pipes w/npm pub integration
- [ ] Learn something in the middle

## Project setup and get data to train the model

```bash
# Insall dependencies
npm install

# (optional) Fetch card images and backgrounds (scryfall.com)
# To use your own card images and background, add them in the respective folders
npm run fetch-bulk

# Generate synthetics, yolo and json labels in multiple async processes
npm run gen-syn

# Aggregate json labels
npm run group-labels
```

The directory for data creation is inside `data`.  
All the relevant files that are fetched or generated are in the following strucure:

```bash
data/
├─ backgrounds/ # <--- fetched
├─ cards/ # <--- fetched
├─ json-labels/ # <--- generated
├─ yolo-labels/ # <--- generated
├─ synthetic/ # <--- generated
├─ labels.json # <--- generated
```
