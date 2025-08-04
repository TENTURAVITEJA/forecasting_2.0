# 🚀 AI-Powered Production Forecasting & Planning System

A modular, scalable, and user-friendly AI tool built to help manufacturing companies — especially MSMEs — accurately forecast demand, plan production, and optimize raw material inventory.

## 🧠 Project Summary

This FastAPI-powered system uses machine learning models (SARIMAX, Prophet, etc.) to generate accurate sales forecasts based on uploaded data. It integrates seamlessly with ERP systems and supports real-time alerts, visualization, and zero-code interaction for non-technical users.

## 📦 Key Features

- ✅ **Automated Sales Forecasting**
- 📊 **Visual Insights with Confidence Intervals**
- ⚠️ **Real-time Alerts for Stockouts & Overproduction**
- 🧾 **Custom File Upload Support (Dynamic Columns)**
- 🔁 **Adaptive Model Selection (SARIMAX / Prophet / Random Forest)**
- 🔍 **Noise Feature Integration (e.g., holidays, inflation, rainfall)**
- 🌐 **Open Architecture with REST APIs**
- 🧩 **Modular Design for Reusability**
- 🧑‍💻 **Zero-code Interface (HTML + Tailwind + Dropzone)**

## 🧱 Tech Stack

| Layer        | Tools Used                      |
|--------------|----------------------------------|
| Backend      | Python, FastAPI                  |
| Frontend     | HTML, TailwindCSS, Dropzone.js   |
| Forecasting  | Prophet, SARIMAX (statsmodels), RandomForest |
| Deployment   | Docker, Azure App Services, or On-prem |

## 🌍 Market Opportunity

With over **63 million MSMEs in India**, poor forecasting leads to massive inventory and production inefficiencies. Even **1% adoption** at a SaaS rate of ₹500–₹1000/month can generate:

- 💰 **₹113–₹226 crore per year** domestically  
- 🌐 **₹1890 crore (~$226.8M USD)** in potential global revenue

> This product is built as a plug-and-play SaaS that scales easily across industries and countries.

## 💡 Innovativeness

- ⚙️ **Model-Agnostic Design**: Uses the best-fit ML model based on input patterns.
- 📈 **Noise Integration**: Accounts for holidays, external events, etc.
- 🧠 **Dynamic Data Parsing**: No fixed column names required.
- 🔓 **Open REST API**: Easy integration with ERP and cloud systems.

## 🚀 Deployment

### Local Development

```bash
git clone https://github.com/your-repo-name.git
cd your-repo-name
pip install -r requirements.txt
uvicorn main:app --reload
