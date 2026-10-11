# haomeh 品牌網站草稿

haomeh 是個人經營的獨立軟體品牌。此專案提供繁中靜態官網，介紹 Wealthline 與 GoodGrain 拾穀；使用已選定的「奶油圓團＋深棕短捲角」標誌。

PR 目前為 ready for review；網站內容仍是僅供審閱、尚未發布的草稿。所有頁面保留草稿標示與 `noindex`；`robots.txt` 禁止索引。這些標記不等於存取控制。正式經營者、聯絡資訊及託管政策仍須補齊，見 [發布前清單](docs/LAUNCH-BLOCKERS.md)。

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
| `contact.html` | 回饋連結、正式聯絡資訊待填說明 |
| `privacy.html` | 品牌網站隱私草稿 |
| `terms.html` | 展示網站使用條款草稿 |
| `security.html` | 已知安全設計與待確認事項 |
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

網站無執行期 JavaScript、後端、登入、資料收集表單、analytics、第三方嵌入或非必要 Cookie。託管/CDN 仍可能處理 IP、時間、URL、瀏覽器及錯誤紀錄，須按實際供應商補充政策。各產品與外連服務適用各自政策。

沒有已登記公司、ISO 認證或法域合規保證的宣稱。公開 repository 也不會自動授予品牌資產或程式碼任何額外授權；發布前需決定授權方式。

## 發布狀態與限制

公開 repository： https://github.com/howmay/haomeh-website 。未配置部署 workflow、CNAME 或網域。未完成正式螢幕閱讀器稽核、跨瀏覽器檢查、實際託管安全標頭或外部產品可用性重驗。標誌 16 px 主要以輪廓與配色辨識，細捲弱於大尺寸。

未確認發布範圍及完成 [發布前清單](docs/LAUNCH-BLOCKERS.md) 前，不應移除草稿標示或部署。若日後使用靜態託管，建置命令為 `npm run build`，輸出目錄為 `dist`；此說明本身不執行部署。
