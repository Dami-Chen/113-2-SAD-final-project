# CoBuy —— Dorm Group-Buying System 宿舍團購媒合系統

提供學生之間發起、參與與管理團購訂單的功能。系統分為前端（React Native + Expo）與後端（Node.js + Express），資料庫使用 PostgreSQL，資料庫及後端 server 皆部署於 Railway。

## 🚀 專案啟動流程

1. Clone 專案並進入目錄：
   ```bash
   git clone https://github.com/Dami-Chen/113-2-SAD-final-project.git
   cd cobuy
   ```
2. 安裝依賴：
    ```bash
    npm install
    # 或 yarn
    ```
3. 啟動專案：
    ```bash
    # run CoBuy on ios stimulator
    npx expo run:ios 
    # run CoBuy on android stimulator
    npx expo run:android 
    ```
    
## 🧑🏻‍💻 可註冊新帳號或直接登入測試帳號
| 帳號      | 密碼       | 備註      |
| ------- | -------- | ------- |
| `admin` | `admin`  | 預設測試用帳號 |
| `user1` | `user1` | 測試使用者   |

## 📌 功能特色

-  **使用者註冊 / 登入**：採用 JWT / AsyncStorage 保存登入狀態，支持自動登入。
-  **發起團購 & 加入團購**：可以分享商品資訊與數量，其他人可搜尋並加入。
-  **訂單歷史頁面**：分為「開團」與「參與」兩種訂單查看模式。
-  **通知系統**：顯示未讀與全部通知，支援點擊查看細節。
-  **會員資料頁**：可修改宿舍、真實姓名、Email 等個人資訊。
-  **深度整合 React Native 功能**：如 OneSignal 推播、lines、axios 擷取後端 API。
  
## 📚 OpenAPI 文件
本專案使用 Swagger UI 搭配 OpenAPI 3.0 撰寫後端 API 文件，方便開發者快速查閱與測試各項 API 端點。
若要開啟文件，請依下列步驟操作：
```bash
cd cobuy/server
node index.js
```
啟動後端伺服器後，於瀏覽器開啟以下網址即可進入 Swagger 介面：
```bash
http://localhost:3001/api-docs
```
可以在該介面查看每個 API 的請求方法、參數格式與回應內容，並可直接在頁面上發送測試請求，協助開發與除錯。

## 🧪 測試與品質保證

本專案採用 **Jest** 搭配 **Supertest** 進行後端整合測試，確保各 API 功能的正確性與穩定性。

* 目前已針對「**新增訂單**」的 API 進行測試，模擬使用者以 HTTP POST 發送請求，驗證回傳狀態碼與資料格式，並確認是否正確寫入 PostgreSQL 測試資料庫。
* 整合 **GitHub Actions** 自動化測試流程，每次推送程式碼至 GitHub，CI 工具會自動執行測試腳本，若測試未通過則中斷流程，幫助團隊即時掌握錯誤。
* 未來可持續擴充測試案例，涵蓋更多 API 與錯誤處理場景，提升系統的可維護性與可靠性。

## 📁 專案重點結構
```bash
cobuy/  
├── app/
│   ├── (auth)/             # Auth 群組頁面 → 登入、註冊頁
│   ├── (tabs)/             # 分頁式主畫面 → 主畫面、開單、歷史訂單、通知、個人資訊頁
│   ├── (stack)/            # 堆疊式資訊頁 → 訂單詳細資訊、拼單者資訊頁
│   └── index.tsx           # 首頁（搭配 Expo Router）
│
├── contexts/                   
│   └── auth-context.tsx       # 登入狀態管理 Context 
│
├── assets/                    # 前端 logo / 字型等資源   
│  
├── server/                    # ✅ 後端（Node.js + Express）  
│   ├── routes/                # 各 API 分路由管理   
│   ├── sql/                   # 統一管理所有 SQL 指令  
│   ├── db.js                  # PostgreSQL 資料庫連線設定  
│   ├── index.js               # Express Server 進入點  
│   └── .env                   # 資料庫連線  
│  
└── package.json               # 專案依賴設定  
```
