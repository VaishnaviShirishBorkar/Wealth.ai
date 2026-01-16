# 💰 Wealth.ai — Personal Finance Management System

Wealth.ai is a **full-stack personal finance & expense management web application** that helps users track accounts, manage transactions, monitor monthly budgets, and receive automated email alerts when spending exceeds limits.

This project follows **real-world production practices** including authentication, background jobs, cloud deployment, and secure API handling.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login & registration
- Secure protected routes

### 🏦 Account Management
- Create multiple accounts (Savings / Current)
- Set monthly saving goals
- Mark default account
- Edit & delete accounts

### 💸 Transactions
- Add income & expense transactions
- Automatic balance updates
- Category-based tracking
- Edit & delete transactions

### 📊 Dashboard & Analytics
- Total balance across all accounts
- Monthly saving goal summary
- Account-wise transaction history
- Interactive charts

### ⚠️ Budget Alert Automation
- Monthly budget monitoring
- **Email alert at 90% budget usage**
- Cron job runs in background
- Alert sent only once per month

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
- MongoDB + Mongoose
- JWT Authentication
- Node-Cron
- Nodemailer

### DevOps / Deployment
- AWS EC2 (Free Tier)
- NGINX (Static hosting & reverse proxy)
- PM2 (Process manager)
- MongoDB Atlas
- Gmail SMTP

---

## 📂 Project Structure

