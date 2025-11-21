# 🍔 UVM Burger Shop

<div align="center">

**Learn UVM Verification Through the Art of Burger Making**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-UVM_Burger_Shop-orange?style=for-the-badge)](https://rahul1990bhatia.github.io/UVMburger/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-222222?style=for-the-badge&logo=github)](https://pages.github.com/)

*An interactive educational platform that teaches Universal Verification Methodology (UVM) using the analogy of running a global burger franchise.*

[🚀 Try It Now](https://rahul1990bhatia.github.io/UVMburger/) · [📖 Report Issue](https://github.com/rahul1990bhatia/UVMburger/issues) · [✨ Request Feature](https://github.com/rahul1990bhatia/UVMburger/issues)

</div>

---

## 🎯 What is UVM Burger Shop?

UVM Burger Shop transforms complex verification concepts into relatable, real-world scenarios. Instead of dry technical manuals, you'll learn UVM by understanding how a burger franchise operates:

- **Agents** → Work Stations
- **Sequencers** → Waiters taking orders
- **Drivers** → Line Cooks flipping burgers
- **Monitors** → Food Critics observing quality
- **Scoreboards** → Shift Managers ensuring perfection

## ✨ Features

### 📚 Comprehensive Curriculum
- **11 Interactive Chapters** covering UVM from basics to advanced topics
- **OOP Fundamentals** explained through cooking metaphors
- **Real Code Examples** in SystemVerilog
- **Progressive Learning Path** from "Street Stall" to "Global Franchise"

### 🎨 Modern User Experience
- **Glassmorphism UI** with smooth animations
- **Dark Mode** optimized for extended reading
- **Responsive Design** works on all devices
- **Animated Burger Graphic** on every page
- **Customer Reviews** - Leave notes on each chapter (stored locally)

### 🛠️ Technology Stack
- **Content**: Markdown with YAML Frontmatter
- **Build Pipeline**: Python + `uv` for content generation
- **Frontend**: React 19 + Vite 7
- **Styling**: Tailwind CSS 3 + Framer Motion
- **Deployment**: GitHub Actions → GitHub Pages

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **Python** 3.10 or higher
- **uv** - Python package manager ([installation guide](https://github.com/astral-sh/uv))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/rahul1990bhatia/UVMburger.git
   cd UVMburger
   ```

2. **Generate content JSON**
   ```bash
   uv run src/build_content.py
   ```

3. **Install frontend dependencies**
   ```bash
   cd app
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📂 Project Structure

```
UVMburger/
├── content/              # Markdown source files for chapters
│   ├── 00_index.md      # Roadmap
│   ├── 01_intro.md      # The Franchise Philosophy
│   └── ...              # Chapters 2-11
├── app/                 # React frontend application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── layouts/     # Layout components
│   │   └── data/        # Generated modules.json
│   └── package.json
├── src/                 # Python build tools
│   └── build_content.py # Content generator script
└── .github/
    └── workflows/
        └── deploy.yml   # Automated deployment
```

## 🌐 Deployment

This project uses **GitHub Actions** for automated deployment to GitHub Pages.

### Automated Deployment (Default)

Every push to the `main` branch automatically:
1. ✅ Generates content JSON from Markdown
2. ✅ Builds the React application
3. ✅ Deploys to GitHub Pages

**Live Site**: [https://rahul1990bhatia.github.io/UVMburger/](https://rahul1990bhatia.github.io/UVMburger/)

### Manual Deployment

If you prefer manual control:

```bash
cd app
npm run deploy
```

> **Note**: Update `base` in `vite.config.js` to match your repository name.

## 📖 Course Outline

| Chapter | Title | Analogy | Concept |
|---------|-------|---------|---------|
| 0 | The Roadmap | The Menu | Course Overview |
| 1 | The Franchise Philosophy | Street Stall vs. Franchise | Why UVM? |
| 2 | The Ingredients | Recipes | OOP Basics |
| 3 | The Kitchen Equipment | The Grill | DUT & Interfaces |
| 4 | The Order Ticket | Customer Orders | `uvm_sequence_item` |
| 5 | The Waiter | Traffic Control | `uvm_sequencer` |
| 6 | The Line Cook | Flipping Burgers | `uvm_driver` |
| 7 | The Food Critic | Silent Observer | `uvm_monitor` |
| 8 | The Shift Manager | Quality Control | `uvm_scoreboard` |
| 9 | The Work Station | Organizing Staff | `uvm_agent` |
| 10 | The Grand Opening | Restaurant Launch | `uvm_env` & `uvm_test` |
| 11 | The Franchise Launch | Opening Day | Simulator Commands |

## 🤝 Contributing

Contributions are welcome! Whether it's:
- 🐛 Bug fixes
- 📝 Content improvements
- 🎨 UI enhancements
- 📚 Additional chapters

Please feel free to open an issue or submit a pull request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **UVM Methodology** - Accellera Systems Initiative
- **Verification Community** - For inspiring better ways to teach complex concepts
- **Design Inspiration** - Modern web design trends in education

---

<div align="center">

**Built with ❤️ for the Verification Community**

[⬆ Back to Top](#-uvm-burger-shop)

</div>
