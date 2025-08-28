<!-- Typing Animation Heading -->
[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=28&duration=3000&pause=1000&color=00F700&center=true&vCenter=true&width=650&lines=🚀+SmartPack+AI;📦+Pack+Smarter,+Not+Harder;🤖+AI+Driven+Sustainability;🌱+Optimize+Space,+Maximize+Impact)](https://git.io/typing-svg)

---

## 🔗 Live Demo  
[![Live Demo](https://img.shields.io/badge/🔴%20LIVE%20DEMO-smartpack--alpha.vercel.app-blue?style=for-the-badge&logo=vercel)](https://smartpack-alpha.vercel.app)  
_Hover ➡ SmartPack AI_

---

## ✨ Features  
- 📦 **AI-Powered Box Optimization** → Suggests best box size from dimensions.  
- 🌱 **Eco-Friendly** → Calculates packaging material saved & CO₂ reduced.  
- 🔐 **Secure Authentication** → JWT-based login, signup, profile.  
- 📊 **Interactive Dashboard** → Animated charts (Chart.js + Tailwind).  
- ⚡ **Demo Mode** → Works even without backend APIs (for Hackathon judges).  

---

## 📂 Animated Project Structure  

<details open>
<summary>📦 smartpack-ai (click to expand)</summary>

```bash
📦 smartpack-ai
 ┣ 📂 backend
 ┃ ┣ 📜 main.py              # API routes
 ┃ ┣ 📜 database.py          # MongoDB connection
 ┃ ┣ 📜 schemas.py           # Request/Response validation
 ┃ ┣ 📂 models
 ┃ ┃ ┗ 📜 rf_model.pkl       # Random Forest trained model
 ┃ ┣ 📜 train_model.py       # Model training script
 ┃ ┗ 📜 utils.py             # Helper functions (CO₂ calc, etc.)
 ┃
 ┣ 📂 frontend
 ┃ ┣ 📂 app                  # Next.js pages
 ┃ ┣ 📂 components           # Reusable components
 ┃ ┣ 📂 styles               # Tailwind + global styles
 ┃ ┣ 📂 assets               # Logos, icons
 ┃ ┣ 📂 public               # Static files
 ┃ ┗ 📜 package.json         # Frontend dependencies
 ┃
 ┣ 📂 dataset
 ┃ ┗ 📜 sample_data.csv      # Training data
 ┃
 ┣ 📂 docs
 ┃ ┗ 📸 architecture.png     # Architecture diagram
 ┃
 ┣ 📜 docker-compose.yml     # Container setup
 ┗ 📜 README.md              # You are here
