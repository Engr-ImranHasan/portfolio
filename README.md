# Imran Hasan — Portfolio

একটা single-page, static portfolio website। কোনো server, database বা build step লাগে না (শুধু CSS রিবিল্ড করতে চাইলে Tailwind লাগে)। HTML, CSS, vanilla JavaScript দিয়ে বানানো।

**লাইভ সাইট:** https://engr-imranhasan.github.io/portfolio/

---

## ১. যেসব feature আছে

### পেজের সেকশনগুলো (উপর থেকে নিচে)

| # | সেকশন | কী আছে |
|---|---|---|
| 1 | **Hero** | নাম, পদবি, typewriter animation, প্রোফাইল ছবি, CV download, Contact Me, WhatsApp বাটন |
| 2 | **Metrics** | Count-up সংখ্যা: 20+ multi-story design (G+15 পর্যন্ত), 2+ বছর অভিজ্ঞতা, 21 certification, 5 research publication |
| 3 | **Selected Projects** | ৬টা প্রজেক্টের horizontal auto-carousel। কার্ডে ক্লিক করলে detail modal খোলে: role, scope, challenge → solution → result, software tags। Hover বা touch করলে থেমে যায় |
| 4 | **Employment History** | অভিজ্ঞতার timeline, প্রতিষ্ঠানের logo বা icon সহ। CCECC-এর logo আছে |
| 5 | **What Colleagues Say** | Testimonial কার্ড (২টা) |
| 6 | **Skills & Engineering Matrix** | ৩টা skill group, sub-skill কার্ডে এবং একটা **Competency Radar** chart (canvas) |
| 7 | **Tools & Automation** | দুই সারির tools marquee, আর GitHub repo কার্ড (Mind Extension, Capture Extension, CCECC Workflow Tool) |
| 8 | **Professional Certifications** | ২১টা certificate, দুই সারির marquee যা **নিজে নিজে চলে** এবং **mouse বা touch দিয়ে drag করা যায়**। কার্ডে ক্লিক করলে certificate image সহ popup খোলে। Hover বা touch করলে থেমে যায় |
| 9 | **Research & Publications** | Journal publication এবং submitted/under review লেখার তালিকা |
| 10 | **Academic Qualifications** | BSc (CEE, SUST), HSC, SSC |
| 11 | **Memories & Moments** | ছবির carousel: ১৬টা slot, thumbnail, next/prev, touch swipe, keyboard navigation। ছবি না থাকলে নিজে থেকে placeholder দেখায় |
| 12 | **Let's Connect & Build** | Contact form (Formspree), success card, WhatsApp card, copy-to-clipboard (phone/email), LinkedIn ও অন্যান্য লিংক |

### সাধারণ ফিচার

- **Navigation:** sticky navbar, active section highlight, mobile hamburger menu, **Download CV** বাটন (nav, hero, mobile menu — তিনটাতেই)
- **Scroll:** scroll progress bar, back-to-top বাটন, smooth scroll
- **Floating WhatsApp** বাটন (ডান নিচে)
- **Background:** structural truss node network (canvas) এবং blueprint-style animated grid
- **Scroll reveal** animation, counter animation
- **Mobile-safe:** horizontal scroll হবে না, ছোট স্ক্রিনে layout ভাঙবে না
- **Accessibility:** `prefers-reduced-motion` মানে, keyboard navigation (ESC দিয়ে modal বন্ধ), ARIA label, alt text
- **404 page** (`404.html`)
- **SEO ও social share:** title, description, canonical URL, Open Graph ও Twitter card, `robots.txt`, `sitemap.xml`, Google Search Console verification tag
- **Visitor counter:** GoatCounter (privacy-friendly, cookie নেই)
- **Favicon:** `favicon.svg`

### Contact form

- Formspree দিয়ে submit হয়। Submit হলে "Message পাঠানো হয়েছে" success card দেখায়, তারপর আরেকটা message পাঠানোর option থাকে
- Form-এ required field আছে: name, email, subject, message
- Formspree ID না বসালে submit করলে "not connected" লেখা দেখাবে

---

## ২. ফোল্ডার কাঠামো

```
portfolio/
├── index.html              ← পুরো পেজের HTML (সব সেকশন এখানে)
├── 404.html                ← Not found পেজ
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── README.md               ← এই ফাইল
├── MASTER_PROMPT.md        ← অন্য কেউ একই ধরনের site বানাতে চাইলে prompt
├── package.json            ← শুধু Tailwind ও test-এর জন্য
├── tailwind.config.js
├── src/input.css           ← CSS-এর source (Tailwind)
├── assets/
│   ├── css/styles.css      ← build করা CSS (সরাসরি লোড হয়)
│   ├── js/main.js          ← সব data (PROJECTS, SKILL_GROUPS, CERTS) + interaction
│   ├── js/truss-bg.js      ← background canvas animation
│   ├── img/icons.svg       ← সব icon (SVG sprite)
│   ├── profile/imran.jpg   ← প্রোফাইল ছবি
│   ├── projects/           ← প্রজেক্টের cover ছবি (proj-*.jpg)
│   ├── certs/              ← certificate ছবি (c-*.jpg)
│   ├── memories/           ← memory-1.jpg … memory-16.jpg
│   ├── og/og-image.jpg     ← share preview ছবি (1200×630)
│   ├── logos/              ← কোম্পানির logo (ccecc.png)
│   └── cv/Imran-Hasan-CV.pdf ← Download CV-র PDF
├── test-render.js          ← jsdom দিয়ে render test
├── check-certs.js          ← certificate data check
├── check-assets.js         ← সব file reference আছে কিনা check
├── form-test.js            ← contact form check
└── verify-live.js          ← live site check
```

---

## ৩. কোথায় কী বদলাতে হবে

### (ক) আপনার তথ্য ও ফাইল

| যা বদলাবেন | কোথায় |
|---|---|
| প্রোফাইল ছবি | `assets/img/profile/imran.jpg` (ভালো size: 680×920 px) |
| CV PDF | `assets/cv/Imran-Hasan-CV.pdf` (একই নাম রাখুন) |
| প্রজেক্ট ছবি | `assets/img/projects/proj-*.jpg` (একই নামে replace করুন) |
| Memory ছবি | `assets/img/memories/memory-1.jpg` … `memory-16.jpg` (ভালো size: 1200×750 px) |
| Certificate ছবি | `assets/img/certs/c-*.jpg` |
| Share preview | `assets/img/og/og-image.jpg` (1200×630 px) |
| কোম্পানির logo | `assets/logos/ccecc.png`, `assets/logos/epct.png` (ঐচ্ছিক) |

> ছবি না থাকলেও পেজ ভাঙবে না, placeholder দেখাবে। ছবি compress করতে [squoosh.app](https://squoosh.app) ব্যবহার করুন।

### (খ) `assets/js/main.js` — মূল data

ফাইলের উপরের দিকে তিনটা array আছে:

- **`PROJECTS`** (~৩৮ নম্বর লাইন): প্রতিটা প্রজেক্টে `img`, `title`, `storey`, `location`, `client`, `role`, `scope`, `challenge`, `solution`, `result`, `tags`। `✏️ EDIT` লেখা অংশগুলো নিজের তথ্য দিয়ে বদলান
- **`SKILL_GROUPS`** (~১০৫ নম্বর লাইন): skill group আর sub-skill, Competency Radar-এর মানও এখান থেকে আসে
- **`CERTS`** (~১৪৩ নম্বর লাইন): certificate-এর তালিকা (`plat`, `kind`, `grp`, `img`, `title`, ...)। নতুন certificate যোগ করতে একটা লাইন বাড়ান, তারপর `index.html`-এ Metrics-এর certification সংখ্যাটাও বদলান

### (গ) `index.html` — যা বদলাতে হবে

- **Hero, About, Experience, Education, Research, Testimonials:** সরাসরি HTML-এ লেখা আছে। নিজের তথ্য বসান
- **Metrics সংখ্যা:** `data-count="..."` attribute (Multi-Story, Years, Certifications, Publications)
- **Testimonials:** নিজের colleague-দের অনুমতি নিয়ে বদলান, নতুবা সরিয়ে দিন
- **URL:** `canonical`, `og:url`, `og:image`, `twitter:image`-এ নিজের GitHub Pages URL বসান। একই কাজ `robots.txt` আর `sitemap.xml`-এও করুন
- **Formspree:** `<form action="https://formspree.io/f/...">` এর ID বদলান। নতুন form বানাতে [formspree.io](https://formspree.io) তে account খুলুন
- **WhatsApp নম্বর:** `wa.me/...` লিংকগুলোতে আছে। সব জায়গায় বদলান (hero, contact card, floating button)
- **Google Search Console:** `google-site-verification` meta tag-এর content নিজের token দিয়ে বদলান
- **GoatCounter:** `data-goatcounter="https://<your-code>.goatcounter.com/count"` এ নিজের code বসান, অথবা এই অংশ বাদ দিন

> ✏️ **EDIT** লেখা জায়গাগুলো খুঁজে বের করতে editor-এ `EDIT` search করুন।

### (ঘ) CSS বদলাতে চাইলে

CSS-এর source `src/input.css`। বদলানোর পর build করুন:

```bash
cd portfolio
npm install
npx tailwindcss -i ./src/input.css -o ./assets/css/styles.css --minify
```

`index.html`-এ CSS ও JS-এর লিংকে `?v=8` ধরনের cache-buster আছে। কোনো file বদলালে এই সংখ্যা বাড়িয়ে দিন, যাতে browser পুরনো file ব্যবহার না করে।

---

## ৪. নিজের কম্পিউটারে চালানো

Python থাকলে একটা command-ই যথেষ্ট:

```bash
cd portfolio
python3 -m http.server 8000 --bind 0.0.0.0
```

তারপর browser-এ `http://localhost:8000` খুলুন।

> `index.html`-কে সরাসরি double-click করেও খোলা যায়, তবে কিছু feature (যেমন certificate image বা memory ছবি) ঠিকমতো নাও চলতে পারে। Local server ব্যবহার করাই ভালো।

### Test চালানো (ঐচ্ছিক)

```bash
cd portfolio
npm install            # jsdom ও tailwind আনবে
node test-render.js    # সব সেকশন render হচ্ছে কিনা
node check-certs.js    # certificate data ঠিক আছে কিনা
node check-assets.js   # সব file/ছবির লিংক আছে কিনা
node form-test.js      # contact form ঠিক আছে কিনা
```

---

## ৫. GitHub Pages-এ publish করা (Web UI দিয়ে)

1. GitHub-এ repository খুলুন, নাম `portfolio` (অথবা নিজের পছন্দের নাম)।
2. **Settings → Pages**: Source = `Deploy from a branch`, Branch = `main`, folder = `/ (root)`।
3. `index.html` **repository-র root-এ** থাকতে হবে। এর মানে `portfolio/` নামের ফোল্ডারের ভেতরের সব ফাইল repo-র উপরের স্তরে আনতে হবে।
4. **Add file → Upload files** দিয়ে সব ফাইল আর ফোল্ডার (`assets/`, `src/`) drag করে দিন, তারপর **Commit changes**।
5. কয়েক মিনিট পর `https://<your-username>.github.io/<repo-name>/` খুলুন।
6. কোনো পরিবর্তনের পর নতুন ফাইল আবার upload করুন। আগের ফাইলের উপর দিয়ে overwrite হবে।

> `node_modules/` upload করবেন না। এটা `.gitignore`-এ আছে, কিন্তু Web UI-তে ফোল্ডারটা না আনাই ভালো।

---

## ৬. Publish-এর আগে এই তথ্যগুলো মিলিয়ে নিন

এই তথ্যগুলো একটু সতর্কতার সঙ্গে দেখুন। আমি এগুলো কোডে রেখেছি, কিন্তু কোনো কোনোটা CV-র সঙ্গে সরাসরি মিলছে না:

- **অভিজ্ঞতার বছর:** Hero ও Metrics-এ "২+ বছর" লেখা আছে, কিন্তু CV-তে আছে "১ বছর ৮ মাস"। একটা বেছে নিয়ে সব জায়গায় একই রাখুন।
- **Certification ঘণ্টা:** CV-তে FLOW-3D ৩.৫ ঘণ্টা ও EPANET ২.৫ ঘণ্টা লেখা আছে, কিন্তু সার্টিফিকেটে দেখায় ১ ও ২ ঘণ্টা। সাইট সার্টিফিকেটের মান ব্যবহার করে।
- **Testimonials:** দুজনের নাম, পদবি, ফোন ও ইমেইল দেওয়া আছে। তাদের অনুমতি না থাকলে ফোন/ইমেইল সরিয়ে দিন।
- **Placeholder লেখা:** `✏️ EDIT` চিহ্নিত সব লেখা বদলান। Project-এর role, scope, challenge, solution, result নিজের বাস্তব তথ্য অনুযায়ী লিখুন।
- **Memories:** ছবি না দিলে placeholder দেখাবে। আসল ছবি দিন।
- **Certificate:** RC codal certificate-এর কোনো PDF/ছবি নেই, তাই সেটা placeholder দেখাবে।

---

## ৭. সমস্যা সমাধান

| সমস্যা | কারণ ও সমাধান |
|---|---|
| Facebook-এ share করলে preview ছবি বা title আসছে না | Facebook সাইট cache করে রাখে। [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/) খুলে URL দিন, তারপর **Scrape Again** চাপুন। `og-image.jpg` সরাসরি খুলে আসছে কিনা দেখুন |
| Live site-এ পুরনো লেখা দেখাচ্ছে | Browser cache। `?v=` সংখ্যা বাড়ান, অথবা Ctrl+Shift+R দিন |
| Contact form-এ "not connected" লেখা আসে | Formspree ID বদলানো হয়নি |
| Mobile-এ পেজ ডানে-বামে সরে যায় | নতুন section যোগ করলে wide element (যেমন বড় table বা image) দেখুন। `overflow-x` ঠিক রাখুন |
| Certificate বা প্রজেক্টের ছবি দেখাচ্ছে না | Path মেলাচ্ছে না। `main.js`-এর `img` নাম আর ফাইলের নাম মিলিয়ে দেখুন। `node check-assets.js` চালান |
| CSS-এর পরিবর্তন দেখা যাচ্ছে না | `styles.css` আবার build করুন (ওপরের ৩(ঘ) ধাপ) |

---

## ৮. Credit ও লাইসেন্স

- Icons: Font Awesome Free 6.7.2 (CC BY 4.0)। `assets/img/icons.svg`-এর ভেতরে আছে
- CSS framework: Tailwind CSS
- Fonts: Outfit, Space Grotesk, JetBrains Mono (Google Fonts)

এই repository শুধু ব্যক্তিগত portfolio। নিজের নামে বা অন্যের তথ্য ছাড়া ব্যবহার করতে চাইলে সব তথ্য ও ছবি বদলে নিন।

---

## ৯. Edit panel (সাইট থেকেই বদলানো)

Footer-এর **✏ Edit** বাটনে click করুন, password দিন। Edit mode-এ নিচে একটা toolbar আসবে:

| বাটন | কী করে |
|---|---|
| Text edit: ON/OFF | Hero title, hero লেখা, badge, সব section-এর শিরোনাম, footer লেখা সরাসরি click করে বদলান |
| Skills / Projects / Certificates / Memories | তালিকা খুলবে: নতুন যোগ, Edit, Delete, ↑ ↓ সাজানো। ছবি যোগ করলে নিজেই ছোট করে নেওয়া হয় |
| GitHub settings | Token দিন (একবার, এই tab-এ থাকবে) |
| Save to website | সব বদল GitHub-এ commit হবে। Live site ১–৩ মিনিট পরে আপডেট হবে |
| Exit | Edit mode বন্ধ (Save না করা বদল মুছে যাবে) |

**Token বানানো (একবার):** GitHub → Settings → Developer settings → Fine-grained tokens → Repository access: শুধু `portfolio` repo → Permissions: **Contents: Read and write** → Expiration দিন → Generate। Token কপি করে edit panel-এর GitHub settings-এ বসান। Token কোথাও লিখে রাখবেন না, এবং যদি কখনো শেয়ার হয়ে যায় তাহলে GitHub-এ গিয়ে revoke করুন।

**গুরুত্বপূর্ণ:**
- Password (`hasi`) শুধু edit বাটন লুকিয়ে রাখে। আসল সুরক্ষা হলো token: token ছাড়া কেউ save করতে পারবে না।
- Edit panel কাজ করার আগে নতুন ফাইলগুলো GitHub-এ একবার upload করতে হবে: `index.html`, `assets/js/main.js`, `assets/js/editor.js`, `assets/data/content.js`, এবং `assets/img/uploads/` ফোল্ডার (এখন খালি থাকতে পারে)।
- Edit panel দিয়ে যা বদলাবেন তা `assets/data/content.js` ফাইলে জমা হয়। এই ফাইল হাতে বদলাবেন না, না হলে panel-এর বদল মুছে যেতে পারে।
- Edit panel-এ এখন নেই: যোগাযোগের তথ্য, experience, education, research publication, testimonial, metric সংখ্যা। এগুলো `index.html`-এ হাতে বদলাতে হবে।
