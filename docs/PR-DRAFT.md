# Add haomeh brand website draft

建立 haomeh 個人軟體品牌的獨立繁中官網，呈現 Wealthline 與 GoodGrain 拾穀的現有功能。首頁、共用導覽、頁尾與 favicon 使用已選定的奶油羊毛／深棕羊角標誌；產品介面明確標為示意。

採無執行期依賴的靜態 HTML/CSS，包含關於、聯絡、隱私、條款、安全說明與 404。無後端、表單、分析追蹤或第三方嵌入。聯絡、經營者與託管政策尚待補齊，保留草稿警示與 noindex；不包含部署 workflow 或網域設定。建置可用 BASE_PATH 指定根站 `/` 或 Pages 專案 `/haomeh-website/`，404 頁的資源與導航不再依賴缺失網址所在目錄。

Validation: build、JavaScript 語法、7 頁內部連結與 anchor、SVG、選定標誌一致性檢查通過；Chromium 驗證五種寬度共 35 組頁面、圖片載入、鍵盤 skip link 與導覽。新增乾淨暫存 checkout 的 build → test:brand 測試，以及根站／Pages 子路徑的真正巢狀 404、尾斜線、CSS／favicon／標誌／導航及鍵盤回歸，均通過。正式螢幕閱讀器、跨瀏覽器及託管環境檢查仍待進行。

PR 已是 ready for review；網站內容仍保留草稿警示、noindex 與上線阻擋項目（docs/LAUNCH-BLOCKERS.md）。不要 merge 或部署，直到發布範圍與必要內容獲確認。
