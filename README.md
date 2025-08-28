!-- Typing Animation Heading -->
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

</details>
---

⚙️ How to Run

<details open>
<summary>🚀 Backend Setup</summary># Go to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload

👉 Runs at: http://127.0.0.1:8000

</details><details>
<summary>🎨 Frontend Setup</summary># Go to frontend
cd frontend

# Install dependencies
npm install   # or pnpm install / yarn install

# Start Next.js app
npm run dev

👉 Runs at: http://localhost:3000

</details><details>
<summary>🐳 Docker Setup (Optional)</summary># Run everything in containers
docker-compose up --build

</details>
---

🛠️ Tech Stack

⚡ Backend: FastAPI + MongoDB + Uvicorn

🎨 Frontend: Next.js + TailwindCSS + Framer Motion

🤖 ML Model: Random Forest (sklearn + joblib)

📊 Charts: Chart.js / Recharts

🐳 Deployment: Vercel (Frontend) + Docker (Optional)



---

📸 Demo Screenshots

Landing Page	Dashboard	Profile

		



---

🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.


---

📜 License

This project is licensed under the MIT License.
