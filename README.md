# CoBuy —— Dorm Group-Buying System 宿舍團購媒合系統

提供學生之間發起、參與與管理團購訂單的功能。系統分為前端（React Native + Expo）與後端（Node.js + Express），資料庫使用 PostgreSQL 並部署於 Railway。

## 🚀 專案啟動流程

### 1. 安裝必要套件（請確認都已安裝）

| 工具                   | 安裝指令                                     | 說明                 |
| -------------------- | ---------------------------------------- | ------------------ |
| Node.js              | [https://nodejs.org](https://nodejs.org) | 建議版本 v18 或以上       |
| Expo CLI             | `npm install -g expo-cli`                | 前端 React Native 使用 |
| npm                  | 已隨 Node.js 一起安裝                          | 套件管理工具             |

### 2. 後端啟動（Express server）

cd server                    # 進入後端資料夾  
npm install                  # 安裝後端相依套件（只需一次）  
node index.js                # 啟動伺服器（預設跑在 localhost:3001）  

若成功啟動，終端機應會出現：  
Server running on port 3001

### 3. 啟動前端（React Native + Expo）

（以下是直接用手機瀏覽的方法，因為我的模擬器不是打不開就是很不穩，手機記得載 Expo Go App）  

cd app                      # 進入前端資料夾   
npm install                 # 安裝前端相依套件（只需一次）  
npm start                   # 啟動 Expo Server（可掃 QR Code 開啟 App）  

若成功，終端機會出現 Expo QR code，手機用 Expo Go App 掃描即可預覽  

## 🧪 測試帳號
| 帳號      | 密碼       | 備註      |
| ------- | -------- | ------- |
| `admin` | `admin`  | 預設測試用帳號 |
| `user1` | `user1` | 測試使用者   |

## 📁 專案結構

cobuy/  
├── app/                        # ✅ 前端（React Native + Expo）  
│   ├── (auth)/                 # 登入/註冊相關頁面  
│   │   └── login.tsx          # 登入頁面  
│   ├── (tabs)/                 # 主畫面頁籤群組  
│   │   ├── index.tsx          # 首頁  
│   │   ├── create_order.tsx   # 發起訂單  
│   │   ├── history_order.tsx  # 訂單紀錄  
│   │   ├── notification.tsx   # 通知中心  
│   │   ├── profile.tsx        # 個人頁面  
│   │   └── _layout.tsx        # Tabs 導覽配置  
│   ├── commodities/           # 商品相關（可擴充）  
│   └── _layout.tsx            # Expo Router 全域配置  
│  
├── assets/                    # 前端圖片 / 字型等資源  
├── contexts/                   
│   └── auth-context.tsx       # 登入狀態管理 Context  
│  
├── server/                    # ✅ 後端（Node.js + Express）  
│   ├── routes/                # 各 API 分路由管理    
│   │   ├── auth.js            # /api/login、/api/register 等  
│   │   ├── orders.js          # /api/orders、/api/join 等  
│   │   └── users.js           # /api/profile 等  
│   ├── sql/                    
│   │   └── queries.js         # 統一管理所有 SQL 指令  
│   ├── db.js                  # PostgreSQL 資料庫連線設定  
│   ├── index.js               # Express Server 進入點  
│   └── .env                   # 資料庫連線字串  
│  
├── package.json               # 前端 npm 設定檔  
└── README.md                  # 專案說明文件  
