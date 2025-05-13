# Magic Scanner 🔍🃏🧙‍♂️

Node module for scanning mtg cards on the go on all js apps.

## Todos

- [x] Create utils to generate dataset automatically
- [x] Create training functions to generate a model with tensorflow
- [ ] Convert and use the model with tensorflowjs
- [ ] Create APIs for the module (like "detectCard(...)")
- [ ] Create CICD pipes w/npm pub integration
- [ ] Learn something in the middle

## Project setup and get data for train the model

```bash
# Insall dependencies
npm install

# (optional) Fetch card images and backgrounds (scryfall.com)
# To use your own card images and background, add them in the respective folders
npm run fetch-bulk

# Generate synthetics, dataset.csv and json labels in multiple async processes
# (TODO: adjust logs when you have time)
npm run gen-syn

# Aggregate json labels
npm run group-labels
```

The directory for data creation is inside `data` and are all going to be usefull for the tensorflow implementation.
All the relevant files that are fetched or generated are in the following strucure:

```bash
data/
├─ backgrounds/ # <--- fetched
├─ cards/ # <--- fetched
├─ json-labels/ # <--- generated
├─ synthetic/ # <--- generated
├─ annotations.csv # <--- generated
├─ labels.json # <--- generated
```

## Training the model

(The installation part is intended for Windows users with Python installed (`v3.8/v3.9/v3.10/v3.11`) - for unix users please use activate script)

```bash
# Crete venv and activate it
py -m venv .venv
.\.venv\Scripts\Activate.ps1

# Upgrade setuptools and wheel
pip install --upgrade pip setuptools wheel

# Install dependencies
pip install -r requirements.txt

# Run trainer
py train/train_detector.py
```
