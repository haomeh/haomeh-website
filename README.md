# haomeh 品牌網站

haomeh 是獨立開發者經營的個人品牌。此專案提供繁中靜態官網，介紹 Wealthline 與 GoodGrain 拾穀；使用已選定的「奶油圓團＋深棕短捲角」標誌。

正式網域：https://haomeh.com/ 。使用 GitHub Pages 與 HTTPS，聯絡管道為本 repository 的 Issues 及 support@haomeh.com。

## 本地執行

需求：Node.js 22+、Python 3.9+。建置本身沒有第三方套件依賴。

```sh
npm run build
npm run preview
```

開啟 http://127.0.0.1:4173 。請透過 HTTP 預覽，不直接以 `file://` 開啟：頁面資源與導覽使用建置時指定的站點絕對路徑，避免主機在巢狀不存在網址返回 404 時錯指資源。

### 根站與 Pages 子路徑

`BASE_PATH` 預設 `/`，適用自訂網域根站及上述本地預覽。Pages 專案站建置與連結檢查使用：

```sh
BASE_PATH=/haomeh-website/ npm run build
BASE_PATH=/haomeh-website/ npm test
```

尾斜線可省略，建置會補齊。請按實際掛載位置設定；輸出仍放在 `dist/`，不另產生子目錄。外連與 `#main` 這類本頁 anchor 保持原語意。測試其他 base 後，執行 `npm run build` 恢復預設根站輸出，再跑 `npm run preview`。

Python 預覽伺服器只用於正常頁面預覽，不模擬託管商自訂 404；巢狀 404 請使用下方回歸測試。

## 驗證

```sh
npm run lint
npm test
npm run test:brand
```

瀏覽器檢查使用固定版本的 Playwright，首次需安裝測試套件與 Chromium：

```sh
npm ci
npx playwright install chromium
```

保持 `npm run preview` 運作，在另一終端執行：

```sh
npm run test:browser
```

獨立回歸測試不需要預先啟動 preview server，也不修改目前的 `dist/`：

```sh
npm run test:regression
```

回歸測試複製程式至全新暫存目錄，驗證 `build → test:brand` 不依賴既有 `artifacts/`。另啟動臨時 HTTP 伺服器，以 404 狀態在原請求網址送出自訂 404 頁，涵蓋根站、Pages 子路徑、不存在的巢狀網址及其尾斜線版本；檢查 CSS、favicon、圖片、導覽、本頁鍵盤跳轉與首頁按鈕。

測試涵蓋 320、375、390、430、1280 px × 7 個頁面、水平溢位、圖片載入、鍵盤跳至主內容、導覽與瀏覽器錯誤。結果及五張首頁截圖輸出至忽略的 `artifacts/`。特殊測試環境可用 `PLAYWRIGHT_MODULE` 指定現有 Playwright 模組。

## 頁面

| 路徑 | 內容 |
| --- | --- |
| `index.html` | 品牌首頁、產品區 `#products` |
| `about.html` | 個人品牌介紹與產品範圍 |
| `contact.html` | 公開 Issues、電子郵件與私人資料提醒 |
| `privacy.html` | 品牌網站與 GitHub Pages 隱私說明 |
| `terms.html` | 展示網站使用條款 |
| `security.html` | 安全設計與非公開通報管道 |
| `404.html` | 找不到頁面與首頁連結 |

## 維護位置

- `scripts/build.mjs`：共用頁框及頁面內容，每次重建乾淨的 `dist/`。
- `src/style.css`：響應式樣式與本機字型 fallback。
- `src/brand/haomeh-selected.svg`：已選定標誌；`favicon.svg` 使用完全相同圖形與配色。
- `src/brand/wordmark-a*.svg`：原創向量字標的深淺版本，不依賴外部字型。
- `scripts/check.mjs`、`scripts/check-brand.py`、`scripts/browser-check.mjs`：靜態、SVG 與瀏覽器驗證。
- `scripts/site-path.mjs`：建置用 URL base 驗證與內部 URL 前綴。
- `scripts/regression-check.mjs`：乾淨建置與真實巢狀 404 回歸。

歷次設計提案、回退包、Library 身分資料與參考圖保留在此 repository 之外。`dist/`、截圖、壓縮包、測試依賴及環境檔不提交。

## 內容與資料範圍

Wealthline 原始碼公開，採 PolyForm Noncommercial 授權，不代表可以無限制商用。拾穀目前描述全家友善食光即期品庫存、分類與地圖導航；在地店家預約標為即將開放。產品圖與數字均標示為合成示意。

網站無執行期 JavaScript、後端、登入、資料收集表單、analytics、第三方嵌入或非必要 Cookie。GitHub Pages 會處理提供託管所需的技術資料；供應商的處理依 GitHub 隱私聲明。各產品與外連服務適用各自政策。

沒有已登記公司、ISO 認證或法域合規保證的宣稱。公開 repository 也不會自動授予品牌資產或程式碼任何額外授權；額外授權需另行確認。

## 部署與維護

目前使用 GitHub Pages 的 `gh-pages` 分支根目錄發布。來源程式在 `main`，輸出以 `BASE_PATH=/ npm run build` 產生；完成本地驗證後，將 `dist/` 內容提交至 `gh-pages`。建置每次產生 `CNAME`（`haomeh.com`），該分支保留 `CNAME` 與 `.nojekyll`，不包含來源、測試套件或私人設定。

現有 GitHub 憑證無 workflow scope，因此不新增 Actions workflow，也不擴充憑證權限。Pages 的分支發布仍會由 GitHub 產生部署 run。更新 main 不會自動更新公開網站；必須重新建置、驗證並發布 `gh-pages`。

Pages Settings 來源為 `gh-pages`、`/`，custom domain 為 `haomeh.com`。正式部署使用根路徑，不能使用 `/haomeh-website/`。DNS 由 Cloudflare 管理；新域名的 HTTPS 必須待 GitHub 憑證就緒後確認強制開啟。修改輸出時不可刪除 `CNAME`。

公開站響應式檢查：

```sh
SITE_URL=https://haomeh.com/ npm run test:browser
```

公開網站另需驗證真正不存在的巢狀網址回傳 HTTP 404，並保留樣式、logo 與回首頁導覽。正式螢幕閱讀器、跨瀏覽器稽核及法律審閱尚未完成；不得將技術驗證當作認證或法律合規保證。營運後續事項見 [維護清單](docs/LAUNCH-BLOCKERS.md)。
