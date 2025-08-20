// generate-readme.js
const fs = require("fs");

const readmeContent = `
# 📦 SmartPack AI – SaaS Packaging Optimization Platform

### 🔗 Live Demo
[SmartPack AI – Live on Vercel](https://v0-empty-conversation-bice-xi.vercel.app/)

---

## 📖 About
SmartPack AI is a SaaS web application designed to help SMEs optimize packaging decisions using AI-driven insights.
It reduces material waste, saves costs, and improves sustainability by suggesting the best box sizes, materials, and estimating CO₂ reduction.

---

## 🚀 Features
- 🔐 Authentication (Login/Signup with role-based access)
- 📊 Dashboard (animated SaaS-style interface)
- 📂 Upload Data (CSV/Excel import)
- 🤖 AI Optimization (mock AI engine for box size, material, cost savings, CO₂ reduction)
- 📈 Results Visualization (tables + charts)
- 🌍 Sustainability Impact metrics
- 📑 Reports export (PDF/CSV)
- ⚙️ Settings (Profile + Subscription plans)
- 🎨 Dark Futuristic UI (TailwindCSS + Framer Motion)

---

## 🛠️ Tech Stack
Frontend: React (Next.js), TailwindCSS, Framer Motion, Recharts
Backend: Node.js + Express (Supabase/Firebase optional)
Database: PostgreSQL / Supabase
Auth: JWT / Supabase Auth
Reports: jsPDF / PDFKit

---

## ⚡ Quick Start

1. Clone the repo
   \`\`\`bash
   git clone https://github.com/your-repo/smartpack-ai.git
   cd smartpack-ai
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

3. Setup environment variables
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:5000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_secret_key
   \`\`\`

4. Run development servers
   - Frontend: \`npm run dev\`
   - Backend: \`cd server && npm install && npm start\`

---

## 👥 Contributors
- Raj Kumar Chaudhary
- Yashoratnam
- Vijay Ramdev
- Shreyas Mishra
`;

fs.writeFileSync("README.txt", readmeContent.trim());
console.log("✅ README.txt generated successfully!");
