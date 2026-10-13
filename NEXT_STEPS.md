# Next steps: from code to a live site

Everything is in place, including the trained models. Steps 3, 5, 6 and 7 are what's left.

## 1–2. Train the models and add them to the site (done)

The trained models are in `web/public/models/` and the figures are in `assets/figures/`. The README results table is filled in.

To retrain later, upload `AutismDataset.zip` to the top level of My Drive, open `training/autix_train.ipynb` in Colab with a T4 GPU, choose **Runtime → Run all**, then unzip the downloaded `autix_export.zip` and copy `models/` into `web/public/models/` and `figures/` into `assets/figures/`.

## 3. Try the site on your Mac

1. Install Node.js 22 if you don't have it: `brew install node@22`, or the installer from [nodejs.org](https://nodejs.org).
2. In Terminal:
   ```bash
   cd ~/Documents/Autix/web
   npm install
   npm run dev
   ```
3. Open http://localhost:5173, upload a face photo, tick the box and click **Analyze**. The first load takes a few seconds while about 80 MB of models download.

## 5. Push to GitHub

Your existing repo `Srinivas-Vengaldas/Autix` has only a README. This replaces it with the full project:

```bash
git init
git add .
git status            # check: no dataset folders, no node_modules
git commit -m "Retrained Xception and VGG19, browser demo with React and TensorFlow.js"
git branch -M main
git remote add origin https://github.com/Srinivas-Vengaldas/Autix.git
git fetch origin
git merge origin/main --allow-unrelated-histories -X ours -m "Merge old README"
git push -u origin main
```

The datasets, `node_modules` and build output are excluded by `.gitignore`. The first push uploads about 85 MB of model files, so give it a minute.

## 6. Deploy on GitHub Pages (free)

1. On GitHub, open the Autix repo → **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
2. Push the latest changes (`git add . && git commit -m "Deploy to GitHub Pages" && git push`). The **Deploy website** workflow builds and publishes the site.
3. After the run goes green (repo → **Actions**), the site is at https://srinivas-vengaldas.github.io/Autix/

From then on, every push to `main` that changes `web/` redeploys the site.

## 7. Share it

- Add it to your resume, LinkedIn Featured section and GitHub profile README.
- Before sharing, open it once on your phone and in a private browser window.

## Local-only files

`AutismDataset.zip` is your one local copy of the dataset (upload it to Google Drive if you ever retrain). It is excluded from git, as are `web/node_modules/` and `.DS_Store` files.
