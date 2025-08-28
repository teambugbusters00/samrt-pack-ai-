<h1 align="center">
  ✨ SmartPack AI ✨  
</h1>

<h3 align="center">🚀 Pack Smarter, Not Harder – with AI 🚀</h3>

<p align="center">
  <a href="https://smartpack-alpha.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live Demo-smartpack--alpha.vercel.app-blue?style=for-the-badge&logo=vercel" />
  </a>
  <br/>
  <i>Hover ➡ <b>SmartPack AI</b> ⬆️</i>
</p>

---

## ✨ Features

- 📦 **AI-Powered Box Optimization** → Suggests best box size from dimensions.  
- 🌱 **Eco-Friendly** → Calculates packaging material saved & CO₂ reduced.  
- 🔐 **Secure Authentication** (JWT-based login, signup, profile).  
- 📊 **Interactive Dashboard** with **animated charts** (Chart.js + Tailwind).  
- ⚡ **Demo Mode** → Works even without backend APIs for Hackathon judges.  

---

## 🗂 Animated Project Structure  

```bash
📦 smartpack-ai
 ┣ 📂 backend                # ⚙️ FastAPI + MongoDB
 ┃ ┣ 📜 main.py              # 🚀 API routes
 ┃ ┣ 📜 database.py          # 🗄️ MongoDB connection
 ┃ ┣ 📜 schemas.py           # ✅ Request/Response validation
 ┃ ┣ 📂 models               # 🤖 Trained ML models
 ┃ ┃ ┗ 📜 rf_model.pkl       # 🌲 Random Forest model
 ┃ ┣ 📜 train_model.py       # 📊 Model training script
 ┃ ┗ 📜 utils.py             # 🔧 Helper functions (CO₂ calc etc.)
 ┃
 ┣ 📂 frontend               # 🎨 Next.js + Tailwind + Framer Motion
 ┃ ┣ 📂 app                  # ⚛️ Pages
 ┃ ┣ 📂 components           # 🧩 Reusable components
 ┃ ┣ 📂 styles               # 🎨 Global & Tailwind styles
 ┃ ┣ 📂 assets               # 🖼️ Logos & icons
 ┃ ┣ 📂 public               # 🌍 Static files
 ┃ ┗ 📜 package.json         # 📦 Frontend deps
 ┃
 ┣ 📂 dataset                # 📑 Training Data
 ┃ ┗ 📜 sample_data.csv
 ┃
 ┣ 📂 docs                   # 📝 Docs & diagrams
 ┃ ┗ 📸 architecture.png
 ┃
 ┣ 📜 docker-compose.yml     # 🐳 Container setup
 ┗ 📜 README.md              # 📘 You are here
