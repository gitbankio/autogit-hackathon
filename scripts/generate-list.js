#!/usr/bin/env node
/**
 * generate-list.js
 * Reads data/participants.json and generates docs/index.html
 * Run: node scripts/generate-list.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'participants.json');
const OUT  = path.join(ROOT, 'docs', 'index.html');

let participants = [];
try {
  participants = JSON.parse(fs.readFileSync(DATA, 'utf8'));
} catch {
  participants = [];
}

const total = 100;
const filled = participants.length;
const pct = Math.round((filled / total) * 100);

function row(p) {
  const basescan = p.tx_hash
    ? `<a href="https://basescan.org/tx/${p.tx_hash}" target="_blank" rel="noopener" class="tx-link">tx</a>`
    : '';
  const paidAt = p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  return `
    <tr>
      <td class="num">#${p.entry_number}</td>
      <td class="user">
        <img src="${p.github_avatar}" alt="" class="avatar" />
        <a href="https://github.com/${p.github_login}" target="_blank" rel="noopener">@${p.github_login}</a>
      </td>
      <td>${escHtml(p.template_title)}</td>
      <td class="type"><span class="badge">${escHtml(p.app_type)}</span></td>
      <td class="paid">5 USDC ${basescan}</td>
      <td class="date">${paidAt}</td>
    </tr>`;
}

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const tableBody = participants.length
  ? participants.map(row).join('')
  : `<tr><td colspan="6" class="empty">No entries yet. Be the first.</td></tr>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AutoGit Hackathon - Participant List</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117;
      color: #e6edf3;
      min-height: 100vh;
      padding: 48px 24px;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .header { margin-bottom: 40px; }
    .logo { font-size: 13px; color: #7d8590; margin-bottom: 16px; letter-spacing: 0.05em; text-transform: uppercase; }
    h1 { font-size: 28px; font-weight: 700; color: #f0f6fc; margin-bottom: 8px; }
    .sub { font-size: 15px; color: #7d8590; margin-bottom: 24px; }
    .sub a { color: #58a6ff; text-decoration: none; }
    .sub a:hover { text-decoration: underline; }
    .counter {
      display: inline-flex; align-items: center; gap: 12px;
      background: #161b22; border: 1px solid #30363d;
      border-radius: 8px; padding: 12px 20px; margin-bottom: 40px;
    }
    .counter .num { font-size: 24px; font-weight: 700; color: #58a6ff; }
    .counter .label { font-size: 14px; color: #7d8590; }
    .bar-wrap { width: 200px; height: 6px; background: #21262d; border-radius: 3px; overflow: hidden; }
    .bar { height: 100%; background: #1f6feb; border-radius: 3px; width: ${pct}%; transition: width 0.3s; }
    .rewards {
      display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 40px;
    }
    .reward-card {
      background: #161b22; border: 1px solid #30363d;
      border-radius: 8px; padding: 16px 20px; min-width: 160px;
    }
    .reward-card .amount { font-size: 20px; font-weight: 700; color: #f0f6fc; margin-bottom: 4px; }
    .reward-card .desc { font-size: 13px; color: #7d8590; }
    .reward-card.top { border-color: #f0883e; }
    .reward-card.top .amount { color: #f0883e; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    thead tr { border-bottom: 1px solid #21262d; }
    th { padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600; color: #7d8590; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 12px; border-bottom: 1px solid #161b22; vertical-align: middle; }
    tr:hover td { background: #161b22; }
    .num { color: #7d8590; font-variant-numeric: tabular-nums; width: 48px; }
    .user { display: flex; align-items: center; gap: 10px; }
    .user a { color: #58a6ff; text-decoration: none; }
    .user a:hover { text-decoration: underline; }
    .avatar { width: 24px; height: 24px; border-radius: 50%; }
    .type .badge {
      display: inline-block; padding: 2px 8px;
      background: #1f3a5c; color: #79c0ff;
      border-radius: 12px; font-size: 12px;
    }
    .paid { color: #3fb950; font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .tx-link { color: #58a6ff; text-decoration: none; font-size: 12px; }
    .tx-link:hover { text-decoration: underline; }
    .date { color: #7d8590; font-size: 13px; }
    .empty { text-align: center; color: #7d8590; padding: 40px; }
    .section-title { font-size: 14px; font-weight: 600; color: #7d8590; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
    .links { margin-top: 48px; display: flex; gap: 20px; flex-wrap: wrap; }
    .links a { color: #58a6ff; text-decoration: none; font-size: 14px; }
    .links a:hover { text-decoration: underline; }
    @media (max-width: 600px) {
      .date, .type { display: none; }
      h1 { font-size: 22px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Gitbank x AutoGit</div>
      <h1>Hackathon</h1>
      <p class="sub">
        Submit a prompt template for <a href="https://gitbank.io/autogit/" target="_blank" rel="noopener">AutoGit</a>.
        Get paid automatically when your PR merges.
      </p>
    </div>

    <div class="counter">
      <div>
        <div class="num">${filled} <span style="font-size:16px;color:#7d8590;">/ ${total}</span></div>
        <div class="label">slots filled</div>
      </div>
      <div class="bar-wrap"><div class="bar"></div></div>
    </div>

    <div class="section-title">Rewards</div>
    <div class="rewards">
      <div class="reward-card">
        <div class="amount">5 USDC</div>
        <div class="desc">Every accepted entry<br>Auto-paid on merge</div>
      </div>
      <div class="reward-card top">
        <div class="amount">300 USDC</div>
        <div class="desc">Best template<br>Team pick after hackathon</div>
      </div>
      <div class="reward-card top">
        <div class="amount">200 USDC</div>
        <div class="desc">2nd best template<br>Team pick after hackathon</div>
      </div>
      <div class="reward-card top">
        <div class="amount">100 USDC</div>
        <div class="desc">3rd best template<br>Team pick after hackathon</div>
      </div>
    </div>

    <div class="section-title" style="margin-top:40px;">Participants (${filled})</div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Author</th>
          <th>Template</th>
          <th>App Type</th>
          <th>Reward</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${tableBody}
      </tbody>
    </table>

    <div class="links">
      <a href="https://github.com/gitbankio/autogit-hackathon/blob/main/HACKATHON.md" target="_blank" rel="noopener">Hackathon Rules</a>
      <a href="https://github.com/gitbankio/autogit-hackathon" target="_blank" rel="noopener">GitHub Repo</a>
      <a href="https://gitbank.io/autogit/" target="_blank" rel="noopener">Try AutoGit</a>
      <a href="https://github.com/gitbankio" target="_blank" rel="noopener">gitbankio</a>
    </div>
  </div>
</body>
</html>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`Generated docs/index.html (${filled}/${total} entries)`);
