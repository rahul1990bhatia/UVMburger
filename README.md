# 🍔 UVM Burger Shop

**"Zero to Hero" UVM Verification Roadmap**

Welcome to the **UVM Burger Shop**, an interactive educational platform that teaches the **Universal Verification Methodology (UVM)** using the analogy of running a global burger franchise.

## 🚀 Features

- **Interactive Course**: 11 Chapters taking you from Verilog basics to a full UVM Testbench.
- **Analogies**: Learn complex concepts (Agents, Sequencers, Scoreboards) through relatable restaurant roles (Stations, Waiters, Managers).
- **Modern UI**: A beautiful, glassmorphism-inspired interface built with React and Tailwind CSS.
- **Progress Tracking**: "Customer Reviews" section to leave notes on each chapter (persisted locally).

## 🛠️ Tech Stack

- **Content**: Markdown with Frontmatter metadata.
- **Build Tool**: Python (`uv`) script to compile content to JSON.
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion.

## 🏃‍♂️ How to Run Locally

1.  **Prerequisites**:
    - Node.js (v18+)
    - Python (v3.10+)
    - `uv` (Python package manager)

2.  **Build Content**:
    ```bash
    # Compiles markdown files in content/ to app/src/data/modules.json
    uv run src/build_content.py
    ```

3.  **Run Frontend**:
    ```bash
    cd app
    npm install
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## 🌐 Deployment (GitHub Pages)

This project is configured for **automatic deployment** to GitHub Pages using GitHub Actions.

### Automated Deployment (Recommended)

1.  **Enable GitHub Pages**:
    - Go to your repository **Settings** → **Pages**.
    - Under "Build and deployment", select **Source**: "GitHub Actions".

2.  **Push to Main**:
    ```bash
    git add .
    git commit -m "Your commit message"
    git push origin main
    ```
    The workflow will automatically build and deploy your site.

3.  **Access Your Site**:
    Your site will be live at: `https://<YOUR_USERNAME>.github.io/<REPO_NAME>/`

### Manual Deployment (Alternative)

If you prefer to deploy manually:

1.  **Update `vite.config.js`**:
    Ensure the `base` property matches your repository name:
    ```js
    base: '/<REPO_NAME>/',
    ```

2.  **Deploy**:
    ```bash
    cd app
    npm run deploy
    ```
    This script builds the project and pushes the `dist` folder to the `gh-pages` branch.

## 📜 License

MIT

