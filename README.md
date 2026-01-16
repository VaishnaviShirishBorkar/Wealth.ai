
# 💰 Wealth.ai — Personal Finance Management System

Wealth.ai is a **full-stack personal finance & expense management web application** that helps users track accounts, manage transactions, monitor monthly budgets, and receive automated email alerts when spending exceeds predefined limits.

The project follows **real-world production practices**, including secure authentication, background job automation, cloud deployment, and environment-based configuration management.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based user registration and login
- Secure protected routes

### 🏦 Account Management
- Create multiple accounts (Savings / Current)
- Set monthly saving goals
- Mark a default account
- Edit and delete accounts

### 💸 Transactions
- Add income and expense transactions
- Automatic balance updates
- Category-based expense tracking
- Edit and delete transactions

### 📊 Dashboard & Analytics
- Total balance across all accounts
- Monthly saving goal summary
- Account-wise transaction history
- Interactive charts and insights

### ⚠️ Budget Alert Automation
- Monthly budget monitoring
- **Automated email alert at 90% budget usage**
- Cron job runs in the background
- Alert sent only once per month to avoid spam

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Node-Cron
- Nodemailer

### DevOps & Deployment
- AWS EC2 (Free Tier)
- NGINX (Static hosting & reverse proxy)
- PM2 (Process manager)
- MongoDB Atlas
- Gmail SMTP

---

## 📂 Project Structure

```

Wealth.ai/
├── frontend/
│   ├── src/
│   ├── dist/
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── cron/
│   ├── utils/
│   └── index.js
│
└── README.md

````

---

## ⚙️ Environment Variables

Create a `.env` file inside the **backend** folder:

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
````

⚠️ **Note:**
Use a **Gmail App Password**, not your actual Gmail password.

---

## 🧪 Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:5001](http://localhost:5001)

---

## 🌍 Production Deployment (AWS EC2)

### Backend (PM2)

```bash
pm2 start index.js --name wealth-backend
pm2 save
pm2 startup
```

### Frontend (NGINX)

```bash
npm run build
scp -i your-key.pem -r dist ubuntu@EC2_PUBLIC_IP:/var/www/html
```

NGINX serves the frontend on **port 80**.

---

## 🔁 NGINX Reverse Proxy (API Configuration)

```nginx
location /api/ {
    proxy_pass http://localhost:5001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
}
```

---

## 📧 Budget Alert Cron Job

* Runs periodically in the background
* Checks monthly expenses
* Sends an email alert when usage reaches 90%
* Prevents duplicate alerts within the same month

---

## 🧠 Key Learnings

* MERN full-stack architecture
* Secure authentication and API design
* Background job automation with cron
* Cloud deployment using AWS
* Real-world finance and budgeting logic

---

## 🔮 Future Enhancements

* HTTPS (SSL with Certbot)
* Category-wise budget limits
* Export reports (CSV / PDF)
* Mobile responsiveness
* AI-based spending insights

---

## 👩‍💻 Author

**Vaishnavi Borkar**
Final-Year Engineering Student
Aspiring Software Engineer

