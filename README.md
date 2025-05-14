# Magic Scanner 🔍🃏🧙‍♂️

**DISCLAIMER 1**: I created this repo to learn something about the topic and to maybe use it in other MTG related projects (if it works)!  
**DISCLAIMER 2**: You might find this repo too easy or too explicative but it is for personal research only. All comments are made from my experience making this repo!
**DISCLAIMER 3**: This repo is fan made and is permitted under the Wizards of the Coast Fan Content Policy. The literal and graphical information presented on this site about Magic: The Gathering, including card images and mana symbols, is copyright Wizards of the Coast, LLC. Scryfall is not produced by or endorsed by Wizards of the Coast.

**What does it do?**  
Create a Magic: The Gathering card scanner model to use into your web applications with [Tensorflow.js](https://www.tensorflow.org/js)!

## Todos

- [x] Create utils to generate dataset automatically
- [x] Create training functions to generate a model with tensorflow
- [x] Convert and use the model with tensorflowjs
- [ ] Get card info with OCR
- [ ] Create demo app
- [ ] Learn something in the middle

## Project setup and get data to train the model

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

The directory for data creation is `data` and will be essential (at least for synthetic images and the annotations.csv) for the training of the model.  
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

(The venv activation command is intended for Windows users - for unix users please use the corrisponding `activate` script)  
**Prerequisites**: Python installed (Tensorflow valid versions: `v3.8/v3.9/v3.10/v3.11`) - I used v3.10.11, other version might need some requirements tweeks.

```bash
# Crete venv and activate it
py -m venv .venv
.\.venv\Scripts\Activate.ps1
# Check if the venv version is correct (python --version)
# if not remove venv and use command
# py -3.10.11 -m venv .venv (or your preferred version)

# Upgrade setuptools and wheel
pip install --upgrade pip setuptools wheel

# Install dependencies
pip install -r requirements.txt

# Run trainer
# (I run Tensorflow in cpu mode and it took some time)
py train/train_detector.py

# Create docker image for a clean conversion envirorment
docker build -t tfjs-converter .

# Once the image is loaded - use the OS specific command:
# (Unix)
docker run --rm \
  -v "%CD%":/workspace \
  tfjs-converter

# (Windows Powershell)
docker run --rm `
  -v "${PWD}:/workspace" `
  tfjs-converter
```

The image run should return the web model inside `web_model`:

```bash
web_model/
├─ tfjs_detector/
│  ├─ group1-shard1of1.bin # <--- actual model
│  ├─ model.json
```

## Running the demo app

```bash
# Make sure you have installed all packages
npm install

# Then run the Vite project
npm run dev

# (Optional) If you want to host the webapp in your local network
# (maybe to see the app on the phone) use instead
npm run dev-host

# Have fun detecting cards (i hope it works)
```
