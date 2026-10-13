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

## 6. Deploy on Azure Static Web Apps (free)

1. In the [Azure portal](https://portal.azure.com): **Create a resource → Static Web App**.
2. Plan type **Free**. Deployment details: choose **Other** (the GitHub Action in this repo does the deploying). Create it.
3. Open the new resource → **Manage deployment token** → copy the token.
4. On GitHub: repo **Settings → Secrets and variables → Actions → New repository secret**. Name `AZURE_STATIC_WEB_APPS_API_TOKEN`, value: the token.
5. On GitHub: **Actions → Deploy website → Run workflow**. After it goes green, open the URL shown on the Azure resource's **Overview** page.

From then on, every push to `main` that changes `web/` redeploys the site.

## 7. Share it

- Put the live link at the top of `README.md`.
- Add it to your resume, LinkedIn Featured section and GitHub profile README.
- Before sharing, open it once on your phone and in a private browser window.

## Local-only files

`AutismDataset.zip` is your one local copy of the dataset (upload it to Google Drive if you ever retrain). It is excluded from git, as are `web/node_modules/` and `.DS_Store` files.
