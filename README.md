# 🏭 SaaS EMS Platform

> **Energy Management System** - 智慧能源管理與優化分析平台

一個全端（Full-Stack）的 SaaS 能源管理平台，結合 **Next.js 前端** 與 **Python FastAPI 後端**，提供 HVAC 冰水主機系統的即時監控、AI 預測、能耗優化與報告生成功能。

---

## 🏗️ 專案架構

```
/saas-ems-platform
├── /frontend        # Next.js 15 + React 19 + Tailwind CSS v4
├── /backend         # Python FastAPI + ML Models
├── /docs            # 專案文件 & PRD
├── /supabase        # Supabase 配置 (未來)
├── docker-compose.yml
└── README.md
```

## ⚡ 技術棧

### 前端
- **Framework**: Next.js 15 (App Router + Turbopack)
- **UI**: React 19 + Tailwind CSS v4
- **狀態管理**: Zustand
- **資料獲取**: TanStack React Query
- **圖表**: Recharts
- **動畫**: Framer Motion

### 後端
- **Framework**: FastAPI
- **資料處理**: Polars, Pandas
- **機器學習**: Scikit-learn, XGBoost
- **優化引擎**: SciPy (SLSQP)
- **報告生成**: ReportLab

### 基礎設施
- **資料庫**: Supabase (PostgreSQL)
- **部署**: Docker + Docker Compose
- **版控**: Git

---

## 🚀 快速開始

### 前置條件

- Node.js >= 18
- pnpm >= 8
- Python >= 3.9

### 1. 安裝前端依賴

```bash
cd frontend
pnpm install
```

### 2. 安裝後端依賴

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. 設定環境變數

```bash
cp .env.example .env
# 編輯 .env 填入 Supabase 等設定
```

### 4. 啟動開發伺服器

**分別啟動：**

```bash
# Terminal 1 - Frontend (http://localhost:3000)
cd frontend && pnpm dev

# Terminal 2 - Backend (http://localhost:8000)
cd backend && uvicorn app.main:app --reload --port 8000
```

**或使用根目錄指令同時啟動：**

```bash
npm install   # 安裝 concurrently
npm run dev   # 同時啟動前後端
```

---

## 📡 API 文檔

啟動後端後，訪問以下 URL 查看 API 文檔：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 核心 API 端點

| 端點 | 方法 | 說明 |
|---|---|---|
| `/api/v1/etl/parse` | POST | 解析 CSV 檔案 |
| `/api/v1/etl/clean` | POST | 清洗與驗證資料 |
| `/api/v1/etl/pipeline` | POST | 完整 ETL + 訓練管道 |
| `/api/v1/predict/energy` | POST | 能耗預測 |
| `/api/v1/optimize/run` | POST | 冰水主機優化 |
| `/api/v1/topology/{site_id}` | GET | 設備拓撲 |

---

## 🧪 測試

```bash
# 後端測試
cd backend && python -m pytest tests/ -v

# 前端 lint
cd frontend && pnpm lint
```

---

## 📄 License

MIT
