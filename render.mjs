// Render the news poster: reads stories.json, builds a 1024x1024 HTML page and
// screenshots it with headless Chromium (no dependencies beyond Node's stdlib).
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(root, 'stories.json'), 'utf8'));

const icons = {
  chart: `<svg viewBox="0 0 64 64" width="52" height="52"><rect x="8" y="34" width="10" height="22" fill="#a41212"/><rect x="24" y="24" width="10" height="32" fill="#14264a"/><rect x="40" y="14" width="10" height="42" fill="#a41212"/><path d="M6 12 L26 6 L58 2" stroke="#14264a" stroke-width="3" fill="none"/><path d="M52 2 L58 2 L56 8" stroke="#14264a" stroke-width="3" fill="none"/></svg>`,
  scales: `<svg viewBox="0 0 64 64" width="52" height="52"><path d="M32 8 L32 52 M14 56 L50 56 M32 12 L12 20 M32 12 L52 20" stroke="#14264a" stroke-width="3" fill="none"/><path d="M12 20 L4 36 L20 36 Z" fill="#a41212"/><path d="M52 20 L44 36 L60 36 Z" fill="#a41212"/><rect x="28" y="6" width="8" height="6" fill="#14264a"/></svg>`,
  shield: `<svg viewBox="0 0 64 64" width="52" height="52"><path d="M32 6 L54 14 V32 C54 46 44 56 32 60 C20 56 10 46 10 32 V14 Z" fill="#14264a"/><path d="M32 18 L35 27 L44 27 L37 33 L39 42 L32 37 L25 42 L27 33 L20 27 L29 27 Z" fill="#f8f4ec"/></svg>`,
  ship: `<svg viewBox="0 0 64 64" width="52" height="52"><path d="M6 38 L58 38 L52 50 L12 50 Z" fill="#14264a"/><rect x="14" y="26" width="30" height="12" fill="#a41212"/><rect x="20" y="16" width="6" height="10" fill="#14264a"/><path d="M4 56 q6 -5 12 0 t12 0 t12 0 t12 0 t12 0" stroke="#a41212" stroke-width="3" fill="none"/></svg>`,
  storm: `<svg viewBox="0 0 64 64" width="52" height="52"><path d="M18 34 a10 10 0 0 1 2-19 a14 14 0 0 1 26-3 a9 9 0 0 1 4 22 Z" fill="#14264a"/><path d="M30 38 L24 50 L30 50 L26 60 L38 46 L32 46 L38 38 Z" fill="#a41212"/></svg>`,
  globe: `<svg viewBox="0 0 200 200" width="210" height="210"><circle cx="100" cy="100" r="92" fill="#14264a"/><ellipse cx="100" cy="100" rx="92" ry="38" fill="none" stroke="#f8f4ec" stroke-width="3"/><ellipse cx="100" cy="100" rx="38" ry="92" fill="none" stroke="#f8f4ec" stroke-width="3"/><circle cx="100" cy="100" r="92" fill="none" stroke="#f8f4ec" stroke-width="4"/><path d="M18 78 q40 14 82 4 t82 -6" stroke="#f8f4ec" stroke-width="3" fill="none"/><path d="M18 126 q40 -12 82 -2 t82 4" stroke="#f8f4ec" stroke-width="3" fill="none"/><g><rect x="24" y="150" width="46" height="30" fill="#f8f4ec"/><rect x="24" y="150" width="46" height="5" fill="#a41212"/><rect x="24" y="160" width="46" height="5" fill="#a41212"/><rect x="24" y="170" width="46" height="5" fill="#a41212"/><rect x="24" y="150" width="20" height="16" fill="#14264a"/></g><g><rect x="78" y="150" width="46" height="30" fill="#a41212"/><path d="M84 156 l2 4 4 0 -3 3 1 4 -4 -3 -4 3 1 -4 -3 -3 4 0 Z" fill="#f8c531"/></g><g><rect x="132" y="150" width="46" height="10" fill="#f8f4ec"/><rect x="132" y="160" width="46" height="10" fill="#14264a"/><rect x="132" y="170" width="46" height="10" fill="#a41212"/></g></svg>`,
};

const story = (s, wide) => `
  <div class="story${wide ? ' wide' : ''}">
    <div class="num">${s.n}</div>
    <div class="sbody">
      <div class="kicker">${s.kicker}</div>
      <div class="shead">${s.headline}</div>
      <div class="ssum">${s.summary}</div>
    </div>
    <div class="sicon">${icons[s.icon]}</div>
  </div>`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1024px;height:1024px;background:#f8f4ec;color:#141414;font-family:"Noto Sans",Arial,sans-serif;overflow:hidden}
.page{width:1024px;height:1024px;padding:20px 36px 16px;display:flex;flex-direction:column}
.mast{text-align:center;border-bottom:4px solid #141414;padding-bottom:8px}
.mast h1{font-size:56px;font-weight:900;letter-spacing:6px;line-height:1}
.dateline{display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #141414;padding:7px 2px 8px}
.dateline .date{font-size:28px;font-weight:900;color:#a41212;letter-spacing:1px}
.dateline .tag{font-size:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
.lead{display:flex;gap:26px;padding:14px 0 12px;border-bottom:2px solid #141414}
.lead-text{flex:1}
.kicker{font-size:16px;font-weight:900;letter-spacing:2px;color:#a41212;text-transform:uppercase}
.lead-text h2{font-size:34px;line-height:1.12;font-weight:900;margin:7px 0 8px}
.lead-text p{font-size:19px;line-height:1.32}
.lead-art{flex:0 0 200px;display:flex;align-items:center;justify-content:center}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:0 28px}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0 24px}
.story{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #b9b2a4}
.num{flex:0 0 30px;height:30px;border-radius:50%;background:#a41212;color:#f8f4ec;font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;margin-top:2px}
.sbody{flex:1}
.shead{font-size:21px;line-height:1.16;font-weight:900;margin:4px 0 5px}
.ssum{font-size:16px;line-height:1.3}
.sicon{flex:0 0 44px;padding-top:4px}
.sicon svg{width:44px;height:44px}
.foot{border-top:4px solid #141414;margin-top:10px;padding-top:8px;text-align:center}
.foot .f1{font-size:18px;font-weight:700}
.foot .f2{font-size:15px;color:#555;margin-top:3px}
</style></head><body><div class="page">
  <div class="mast"><h1>${data.masthead}</h1></div>
  <div class="dateline"><span class="date">${data.date}</span><span class="tag">${data.tagline}</span></div>
  <div class="lead">
    <div class="lead-text">
      <div class="kicker">${data.lead.kicker}</div>
      <h2>${data.lead.headline}</h2>
      <p><b>${data.lead.dateline} —</b> ${data.lead.summary}</p>
    </div>
    <div class="lead-art">${icons.globe}</div>
  </div>
  <div class="grid2">
    ${data.stories.slice(0, 2).map((s) => story(s, false)).join('\n')}
  </div>
  <div class="grid3">
    ${data.stories.slice(2).map((s) => story(s, false)).join('\n')}
  </div>
  <div class="foot">
    <div class="f1">${data.footer}</div>
    <div class="f2">${data.judge_note}</div>
  </div>
</div></body></html>`;

const outHtml = '/tmp/poster.html';
writeFileSync(outHtml, html);
const chrome = join(homedir(), '.cache/ms-playwright/chromium-1148/chrome-linux/chrome');
const outPng = join(root, 'entry.png');
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--window-size=1024,1024',
  `--screenshot=${outPng}`, `file://${outHtml}`,
], { stdio: 'inherit' });
console.log('wrote', outPng);
