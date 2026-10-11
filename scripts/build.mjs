import { getBasePath, prefixSiteUrls } from "./site-path.mjs";
import { mkdir, readFile, writeFile, copyFile, rm } from "node:fs/promises";
const basePath = getBasePath();
const out = new URL("../dist/", import.meta.url);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const css = await readFile(
  new URL("../src/style.css", import.meta.url),
  "utf8",
);
const brand = `<span class="brand-lockup"><img class="brand-sheep" src="brand/haomeh-selected.svg" width="36" height="36" alt=""><img src="brand/wordmark-a.svg" width="150" height="37" alt="haomeh"><span class="brand-zh">好咩</span></span>`;
const nav = `<a class="skip" href="#main">跳至主要內容</a><div class="draft">設計審閱版 · 尚未正式發布 <a href="contact.html">查看上線待確認事項 ↗</a></div><header class="wrap"><a class="wordmark" href="index.html" aria-label="haomeh 好咩 首頁">${brand}</a><nav aria-label="主要導覽"><a href="index.html#products">產品</a><a href="about.html">關於</a><a href="contact.html">聯絡 <span aria-hidden="true">↗</span></a></nav></header>`;
const foot = `<footer class="wrap"><div class="footer-top"><a class="wordmark" href="index.html" aria-label="haomeh 好咩 首頁">${brand}</a><p>把日子裡的小事，做得更好。</p><a href="contact.html">與我們聯絡 ↗</a></div><div class="footer-bottom"><span>© 2026 haomeh · 品牌網站草稿</span><nav aria-label="頁尾導覽"><a href="privacy.html">隱私</a><a href="terms.html">使用條款</a><a href="security.html">安全說明</a></nav></div></footer>`;
const shell = (title, body) =>
  prefixSiteUrls(
    `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="haomeh 品牌網站審閱草稿。認識 Wealthline 與 GoodGrain 拾穀，讓軟體貼近日常。"><title>${title} — haomeh</title><link rel="stylesheet" href="style.css"><link rel="icon" type="image/svg+xml" href="brand/favicon.svg"></head><body>${nav}<main id="main">${body}</main>${foot}</body></html>`,
    basePath,
  );
const home = `<section class="hero wrap"><div class="eyebrow"><span class="square"></span> INDEPENDENT SOFTWARE, EVERYDAY LIFE.</div><h1>把日常，<br>做得<span class="serif">更好一點。</span></h1><div class="hero-bottom"><p>從看清自己的財務，到發現附近的好食物。<br>我們做貼近生活的軟體，讓重要的事更簡單。</p><a class="text-link" href="#products">認識我們的產品 <span>↓</span></a></div><div class="hero-index" aria-hidden="true">HAOMEH / 好咩<br>從日常的小事開始。</div></section>
<section class="products wrap" id="products"><div class="section-heading"><h2>日常裡的兩個好幫手</h2><span>OUR PRODUCTS / 01—02</span></div><article class="product wealth"><div class="product-copy"><div class="product-kicker">01 / 個人財務</div><h3>Wealthline<span>看見每一步累積。</span></h3><p>把資產與負債整理在一起。透過淨資產歷史，認識自己的財務變化，留出更多心力給生活。</p><ul class="tags"><li>多幣別</li><li>資產與負債</li><li>自己的資料自己掌握</li></ul><a class="button" href="https://wealthline.haomeh.com">探索 Wealthline <span>↗</span></a><a class="sub-link" href="https://github.com/howmay/Wealthline">查看公開原始碼 ↗</a></div><div class="product-visual"><div class="finance-ui"><div class="ui-top"><strong><span class="mini-mark">w</span> Wealthline</strong><span>資產總覽</span></div><div class="balance"><span>淨資產 / TWD</span><strong>1,284,600<span>.00</span></strong><small>你的累積，慢慢成形。</small></div><svg viewBox="0 0 480 140" role="img" aria-label="示意淨資產曲線逐漸上升"><path class="grid-line" d="M0 25H480 M0 80H480 M0 135H480"/><path class="chart-line" d="M0 116L35 110L70 115L105 88L140 94L175 74L210 83L245 62L280 69L315 44L350 51L385 24L420 33L450 14L480 8"/></svg><div class="chart-labels"><span>1 月</span><span>6 月</span><span>12 月</span></div><div class="asset-row"><span><i class="asset-dot"></i>銀行帳戶</span><strong>NT$ 420,000</strong></div><div class="asset-row"><span><i class="asset-dot blue"></i>股票與基金</span><strong>NT$ 764,600</strong></div><div class="asset-row"><span><i class="asset-dot gold"></i>加密資產</span><strong>NT$ 100,000</strong></div></div><p class="caption">介面概念示意 · 非實際帳戶資料</p></div></article>
<article class="product grain"><div class="product-copy"><div class="product-kicker">02 / 惜食生活</div><h3>GoodGrain <span class="grain-name">拾穀</span><span>附近的好食光，別錯過。</span></h3><p>看看附近全家友善食光的即期品庫存，依分類找喜歡的食物，再用地圖導航出發。</p><ul class="tags"><li>門市庫存</li><li>食物分類</li><li>地圖導航</li></ul><a class="button" href="https://goodgrain.haomeh.com/explore">尋找附近好食 ↗</a><p class="coming">在地店家預約功能 · 即將開放</p></div><div class="product-visual"><div class="grain-ui"><div class="ui-top"><strong><span class="grain-icon">✳</span> 拾穀</strong><span>發現好食</span></div><h4>今天，附近有什麼？</h4><div class="filters"><span class="selected">全部</span><span>飯糰</span><span>麵包</span><span>鮮食</span></div><div class="food-row"><div class="food-icon rice" aria-hidden="true">◒</div><div><strong>鮭魚飯糰</strong><small>示意門市 · 友善食光</small></div><span class="stock">庫存 3</span></div><div class="food-row"><div class="food-icon bread" aria-hidden="true">≋</div><div><strong>奶油餐包</strong><small>示意門市 · 友善食光</small></div><span class="stock">庫存 2</span></div><div class="map-strip"><span class="map-pin" aria-hidden="true">●</span><span>從附近開始，讓好食物被看見。</span></div><p class="ui-note">實際品項與庫存以產品及門市資訊為準</p></div><p class="caption">介面概念示意 · 非即時門市或庫存資料</p></div></article></section>
<section class="approach wrap"><div><div class="eyebrow">THE WAY WE BUILD</div><h2>好用，是從<br>理解生活開始。</h2><a class="text-link" href="about.html">關於 haomeh ↗</a></div><div class="principles"><div><span>01</span><h3>從真正的小事開始</h3><p>整理一筆資產，找到一份晚餐。把具體的需求做好，就是產品存在的理由。</p></div><div><span>02</span><h3>把選擇留給你</h3><p>清楚說明功能、資料與使用範圍，讓你知道自己正在使用什麼。</p></div><div><span>03</span><h3>讓簡單經得起日常</h3><p>少一點不必要的步驟，多一點值得留下來的細節。</p></div></div></section><section class="hello wrap"><div class="eyebrow">A GOOD CONVERSATION STARTS HERE</div><h2>有個想法，想跟我們聊聊？</h2><a href="contact.html" class="button">聯絡與回饋 ↗</a></section>`;
const pages = {
  "about.html": [
    "關於我們",
    "ABOUT HAOMEH",
    "從日常出發，<br>把軟體做好。",
    `<p class="lead">haomeh 是個人經營的獨立軟體品牌，關注那些每天都會遇到，卻還能更簡單一點的事。</p><h2>我們正在做的產品</h2><p>Wealthline 協助整理個人資產、負債與淨資產歷史，支援銀行、股票、基金、加密資產與多幣別；資料可保留在本機或使用者自己的 Google Drive。</p><p>GoodGrain 拾穀提供全家友善食光的即期品門市庫存、分類與地圖導航。在地店家預約仍屬即將開放功能。</p><h2>清楚，是基本要求</h2><p>我們不以未上線的功能或尚未取得的認證宣傳產品。Wealthline 原始碼公開，採 PolyForm Noncommercial 授權；使用與商業用途限制請查看其儲存庫授權文件。</p><a href="index.html#products" class="text-link">回到產品介紹 ↗</a>`,
  ],
  "contact.html": [
    "聯絡",
    "CONTACT",
    "把話說清楚，<br>從聯絡開始。",
    `<div class="blocker"><strong>上線前必須完成</strong><p>正式聯絡信箱、服務提供者的法律名稱與所在地尚待確認。本頁目前不接受訊息，也不收集表單資料。</p></div><h2>產品回饋</h2><p>Wealthline 的程式問題可透過公開的 GitHub Issues 提出。請勿張貼帳戶、財務紀錄或其他個人敏感資訊。</p><a class="button" href="https://github.com/howmay/Wealthline/issues">Wealthline Issues ↗</a><h2>合作、隱私與安全聯絡</h2><p>待正式聯絡管道確認後公布。此草稿不提供臨時或私人電子郵件地址。</p><h2>發布檢核</h2><ul><li>確認品牌與法律實體、所在地及適用法域。</li><li>確認正式客服、隱私與安全通報管道。</li><li>確認託管服務、伺服器紀錄用途與保存期間。</li><li>確認 GitHub repo、部署平台、網域既有設定與發布範圍。</li><li>釐清是否有 ISO 認證、證書範圍與有效性；確認前不作認證宣稱。</li><li>完成政策與條款審閱後移除草稿標示及 noindex。</li></ul>`,
  ],
  "privacy.html": [
    "隱私說明",
    "PRIVACY / DRAFT",
    "你的瀏覽，<br>需要清楚的說明。",
    `<div class="blocker"><strong>隱私說明草稿 · 尚未生效</strong><p>適用主體、聯絡窗口、託管供應商及紀錄保存期間待確認。本頁不是任何法域合規認證。</p></div><h2>本品牌網站的範圍</h2><p>本網站提供品牌與產品介紹。此版本未加入分析追蹤、廣告、第三方嵌入、非必要 Cookie 或資料收集表單；字型使用裝置本機字型，不向外部字型服務傳送請求。</p><h2>網站存取紀錄</h2><p>瀏覽網站時，實際託管或網路服務商可能處理 IP 位址、請求時間、瀏覽器資訊與錯誤紀錄，以提供網站及維護安全。供應商、具體欄位、用途、保存期間及處理地點須在發布前核實並補充。</p><h2>前往其他產品</h2><p>Wealthline、GoodGrain、GitHub 與 Google Drive 是不同的服務情境。開啟外部連結後，其各自的政策與設定適用。本品牌網站的說明不代表所有產品的資料處理方式。</p><h2>聯絡與權利請求</h2><p>正式隱私聯絡窗口尚待確認，請參閱<a href="contact.html">聯絡頁的上線待確認事項</a>。發布前將補上可用管道、處理流程及適用法域所要求的資訊。</p><h2>版本</h2><p>審閱日期：2026 年 10 月 11 日。此版本尚未正式發布或生效。</p>`,
  ],
  "terms.html": [
    "使用條款",
    "TERMS / DRAFT",
    "使用之前，<br>先把範圍說明白。",
    `<div class="blocker"><strong>使用條款草稿 · 尚未生效</strong><p>服務提供者、法律實體、所在地、適用法律與爭議處理方式尚待確認，需完成法務審閱後發布。</p></div><h2>網站用途</h2><p>本品牌網站用於介紹 haomeh 及其產品。產品的實際功能、可用性與使用條件，以各產品當下提供的說明及條款為準。</p><h2>產品資訊與示意畫面</h2><p>標示為示意的介面、數字及品項僅為設計展示，不是財務紀錄、即時庫存或可購買要約。Wealthline 是個人財務整理工具，不應將本網站內容視為投資建議。拾穀庫存可能隨門市狀況變動。</p><h2>程式碼與內容授權</h2><p>Wealthline 原始碼公開並採 PolyForm Noncommercial 授權，不代表可無限制商用。詳細權利與限制請查看<a href="https://github.com/howmay/Wealthline">官方儲存庫授權文件</a>。本品牌網站並未另外授予產品商標、文字或程式碼的使用權。</p><h2>外部服務</h2><p>外連網站由各服務提供者運作。使用其服務前，請查看對應條款與隱私說明。</p><h2>待確認條款</h2><p>責任範圍、法定權利、適用法律、爭議處理、變更通知與正式聯絡管道，需依實際經營主體及服務地區審閱，不能直接以此草稿取代完整契約。</p>`,
  ],
  "security.html": [
    "安全說明",
    "SECURITY",
    "信任，<br>從如實說明開始。",
    `<div class="blocker"><strong>發布前待核實</strong><p>正式安全通報窗口及託管環境尚未確認。目前不宣稱取得 ISO 27001 或其他安全認證。</p></div><h2>此網站的設計</h2><p>品牌網站採靜態頁面，不設登入、資料庫或資料收集表單；無前端分析追蹤與第三方嵌入。這些設計減少資料處理範圍，但不代表任何系統絕無風險。</p><h2>產品與資料</h2><p>Wealthline 的本機與使用者自身 Google Drive 儲存方式，應依產品設定及文件理解。品牌網站不代為保管你的資產紀錄，也不作產品安全保證。GoodGrain 的資料處理應查看其產品政策。</p><h2>問題通報</h2><p>正式非公開安全通報管道待確認。在管道公布前，請勿在公開 issue 張貼可利用的漏洞細節、憑證或個人資料。</p><h2>ISO 與其他聲明</h2><p>若後續取得認證，需確認受認證主體、標準版本、證書範圍及有效日期，才會在網站公布。使用某個供應商或開發工具不代表 haomeh 自身獲得其認證。</p>`,
  ],
};
await writeFile(
  new URL("index.html", out),
  shell("好咩・把日常，做得更好一點", home),
);
for (const [file, [title, label, heading, body]] of Object.entries(pages))
  await writeFile(
    new URL(file, out),
    shell(
      title,
      `<section class="document wrap"><div class="eyebrow">${label}</div><h1>${heading}</h1><div class="prose">${body}</div></section>`,
    ),
  );
await writeFile(new URL("style.css", out), css);
await writeFile(
  new URL("404.html", out),
  shell(
    "找不到頁面",
    '<section class="document wrap"><h1>這一頁，<br>暫時不在這裡。</h1><a class="button" href="index.html">回到首頁 ↗</a></section>',
  ),
);
await writeFile(new URL("robots.txt", out), "User-agent: *\nDisallow: /\n");
await writeFile(new URL(".nojekyll", out), "");

await mkdir(new URL("brand/", out), { recursive: true });
for (const file of [
  "haomeh-selected.svg",
  "wordmark-a.svg",
  "wordmark-a-light.svg",
  "favicon.svg",
])
  await copyFile(
    new URL("../src/brand/" + file, import.meta.url),
    new URL("brand/" + file, out),
  );
console.log("Built 7 website pages and 4 SVG brand assets.");
