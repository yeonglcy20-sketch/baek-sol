const SHEET_ID = '1WCGrXJy5OCazo9q6cM0CXeKN7wgs1_P9aG3K8SVMHeI';
const SHEET_NAME = '시트1';
const QUERY_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}&tqx=out:json`;

let rows = [];
let headers = [];

const $ = (id) => document.getElementById(id);

function parseGoogleData(text) {
  const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
  const data = JSON.parse(jsonText);
  const tableRows = data.table.rows || [];
  const tableCols = data.table.cols || [];

  headers = tableCols.map((col, idx) => col.label || (idx === 0 ? '닉네임' : `항목${idx}`));

  return tableRows.map((row) => {
    const values = (row.c || []).map((cell) => cell ? (cell.f ?? cell.v ?? '') : '');
    const name = String(values[0] || '').trim();
    const items = [];

    for (let i = 1; i < headers.length; i++) {
      const label = String(headers[i] || '').trim();
      const raw = values[i];
      const num = Number(raw);
      const isValidNumber = !Number.isNaN(num) && num > 0;
      const isValidText = String(raw || '').trim() !== '' && String(raw).trim() !== '0';

      if (label && (isValidNumber || isValidText)) {
        items.push({ label, value: isValidNumber ? num : String(raw).trim() });
      }
    }

    const total = items.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    return { name, items, total };
  }).filter((row) => row.name && row.items.length > 0);
}

async function loadData() {
  const list = $('list');
  list.className = 'list loading';
  list.textContent = '스프레드시트 데이터를 불러오는 중입니다...';

  try {
    const res = await fetch(QUERY_URL, { cache: 'no-store' });
    const text = await res.text();
    rows = parseGoogleData(text);
    $('updatedAt').textContent = `업데이트: ${new Date().toLocaleString('ko-KR')}`;
    render();
  } catch (error) {
    list.className = 'list';
    list.innerHTML = `<div class="empty">데이터를 불러오지 못했습니다.<br>스프레드시트 공유 설정을 “링크가 있는 모든 사용자 보기 가능”으로 바꿔주세요.</div>`;
    console.error(error);
  }
}

function render() {
  const keyword = $('searchInput').value.trim().toLowerCase();
  const data = rows
    .filter((row) => row.name.toLowerCase().includes(keyword))
    .sort((a, b) => b.total - a.total);

  const list = $('list');
  list.className = 'list';

  if (!data.length) {
    list.innerHTML = '<div class="empty">표시할 업보가 없습니다.</div>';
    return;
  }

  list.innerHTML = data.map((row) => `
    <article class="card">
      <div class="card-head">
        <div class="name">${escapeHtml(row.name)}</div>
        <div class="total">${row.total}</div>
      </div>
      <div class="badges">
        ${row.items.map((item) => `
          <div class="badge">
            <span class="badge-label">${escapeHtml(item.label)}</span>
            <span class="badge-value">× ${escapeHtml(item.value)}</span>
          </div>
        `).join('')}
      </div>
    </article>
  `).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[ch]));
}

$('searchInput').addEventListener('input', render);
$('refreshBtn').addEventListener('click', loadData);

loadData();
