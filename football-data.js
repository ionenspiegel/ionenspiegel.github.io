(function () {
  'use strict';

  const CUTOFF = new Date('2026-11-05T23:59:59+03:00');
  const LOCAL_DATA_URL = './data/football-data.json';
  const endpoint = window.IONEN_DATA_ENDPOINT || '';

  const text = (value) => String(value == null ? '' : value);
  const escapeHtml = (value) => text(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function validSource(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  function display(value) {
    return value === null || value === undefined || value === '' ? '—' : escapeHtml(value);
  }

  function sourceNote(source, link) {
    return '<p class="data-source-note">Kaynak: <a href="' + escapeHtml(link) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(source) + ' ↗</a> · Güncelleme: 5 Kasım 2026</p>';
  }

  function renderStandings(rows) {
    const panel = document.getElementById('standingsPanel');
    if (!panel) return;
    const body = rows.map((row) => '<tr class="' + (row.team === 'Çorum FK' ? 'highlight' : '') + '"><td>' + display(row.rank) + '</td><td>' + escapeHtml(row.team) + '</td><td>' + display(row.played) + '</td><td>' + display(row.wins) + '</td><td>' + display(row.draws) + '</td><td>' + display(row.losses) + '</td><td>' + (row.gf == null || row.ga == null ? '—' : display(row.gf) + ':' + display(row.ga)) + '</td><td>' + display(row.gd) + '</td><td class="points">' + display(row.points) + '</td><td>—</td></tr>').join('');
    panel.innerHTML = '<div class="table-scroll"><table><thead><tr><th>#</th><th>Takım</th><th>O</th><th>G</th><th>B</th><th>M</th><th>A:Y</th><th>AV</th><th>P</th><th>Form</th></tr></thead><tbody>' + body + '</tbody></table></div>' + sourceNote('canlıskor.org / LigAnaliz', 'https://canliskor.org/en/league/super-lig');
  }

  function renderResults(matches) {
    const panel = document.getElementById('resultsPanel');
    if (!panel) return;
    const results = matches.filter((match) => match.type === 'result');
    panel.innerHTML = results.map((match) => '<div class="result-item"><span>' + escapeHtml(match.home) + '</span><strong>' + display(match.homeScore) + ' - ' + display(match.awayScore) + '</strong><span>' + escapeHtml(match.away) + '</span><small>' + new Date(match.date).toLocaleDateString('tr-TR') + ' · <a href="' + escapeHtml(match.link) + '" target="_blank" rel="noopener noreferrer">Kaynak ↗</a></small></div>').join('');
  }

  function renderFixtures(matches) {
    const panel = document.getElementById('fixturesPanel');
    if (!panel) return;
    const fixtures = matches.filter((match) => match.type === 'fixture');
    panel.innerHTML = '<div class="upcoming-fixtures">' + fixtures.map((match) => '<article class="fixture-match"><time>' + new Date(match.date).toLocaleDateString('tr-TR', {day:'2-digit', month:'short'}) + '<br><small>' + new Date(match.date).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'}) + '</small></time><div class="fixture-team"><b>' + escapeHtml(match.home) + '</b></div><strong class="fixture-vs">vs</strong><div class="fixture-team away"><b>' + escapeHtml(match.away) + '</b></div><a class="fixture-badge" href="' + escapeHtml(match.link) + '" target="_blank" rel="noopener noreferrer">Kaynak ↗</a></article>').join('') + '</div>' + sourceNote('LigAnaliz 11. hafta', 'https://liganaliz.com/genel-durum/11');
  }

  function renderScorers(rows) {
    const panel = document.getElementById('goalsPanel');
    if (!panel) return;
    panel.innerHTML = rows.length ? '<div class="stat-list">' + rows.map((row) => '<div class="stat-row"><b>' + display(row.rank) + '</b><span>' + escapeHtml(row.player) + '<small>' + escapeHtml(row.team) + '</small></span><em>' + display(row.goals) + '</em><small>gol</small></div>').join('') + '</div>' + sourceNote('LigAnaliz 10. hafta', 'https://liganaliz.com/genel-durum/10') : '<div class="data-empty">Doğrulanmış gol krallığı verisi yok.</div>';
  }

  function renderAssists(rows) {
    const panel = document.getElementById('assistsPanel');
    if (!panel) return;
    panel.innerHTML = rows.length ? '<div class="stat-list">' + rows.map((row) => '<div class="stat-row"><b>' + display(row.rank) + '</b><span>' + escapeHtml(row.player) + '<small>' + escapeHtml(row.team) + '</small></span><em>' + display(row.assists) + '</em><small>asist</small></div>').join('') + '</div>' : '<div class="data-empty">5 Kasım 2026 kesimi için doğrulanmış asist tablosu bulunamadı.</div>';
  }

  function renderPanels(data) {
    const standings = data.standings && Array.isArray(data.standings.superLig) ? data.standings.superLig : [];
    renderStandings(standings);
    renderResults(data.matches || []);
    renderFixtures(data.matches || []);
    renderScorers(data.scorers || []);
    renderAssists(data.assists || []);
    ['standingsPanel', 'resultsPanel', 'goalsPanel', 'assistsPanel', 'fixturesPanel'].forEach((id) => {
      document.getElementById(id)?.classList.remove('data-unverified');
    });
  }

  function validDate(value) {
    const date = new Date(value);
    return !Number.isNaN(date.valueOf()) && date <= CUTOFF;
  }

  function validNews(item) {
    return item && item.title && item.description && item.source && validSource(item.link) && validDate(item.date);
  }

  function normalize(payload) {
    const value = payload && payload.items ? { ...payload, news: payload.items } : payload;
    if (!value || value.verified !== true) return null;
    const news = Array.isArray(value.news) ? value.news.filter(validNews) : [];
    const matches = Array.isArray(value.matches) ? value.matches : [];
    const standings = value.standings && typeof value.standings === 'object' ? value.standings : {};
    return { ...value, news, matches, standings };
  }

  function setStatus(message, tone) {
    const status = document.getElementById('footballDataStatus');
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone || 'neutral';
  }

  function updateSiteDate(value) {
    const date = new Date(value || CUTOFF);
    if (Number.isNaN(date.valueOf())) return;
    const formatted = date.toLocaleDateString('tr-TR', {day: 'numeric', month: 'long', year: 'numeric'});
    document.querySelectorAll('[data-site-date]').forEach((element) => {
      element.textContent = formatted;
    });
  }

  function renderNews(news) {
    const feed = document.getElementById('newsFeed');
    if (!feed) return;
    if (!news.length) {
      const heroTitle = document.getElementById('heroTitle');
      const heroText = document.getElementById('heroText');
      const heroSource = document.getElementById('heroSource');
      const heroRead = document.getElementById('heroRead');
      if (heroTitle) heroTitle.textContent = 'Doğrulanmış son dakika haberi bekleniyor';
      if (heroText) heroText.textContent = 'Kaynak ve yayın tarihi doğrulanmayan haberler gösterilmiyor.';
      if (heroSource) heroSource.textContent = 'Veri kaynağı yapılandırılmadı · 5 Kasım 2026';
      if (heroRead) heroRead.hidden = true;
      feed.innerHTML = '<div class="data-empty">Doğrulanmış haber akışı şu anda kullanılamıyor. Eski içerik gösterilmiyor.</div>';
      return;
    }
    feed.innerHTML = news.map((item) => '<article class="news-row has-bookmark live-news-row">' +
      '<div class="news-copy"><span class="news-kicker">' + escapeHtml(item.category || 'FUTBOL') + '</span>' +
      '<h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.description) + '</p>' +
      '<div class="news-info"><time datetime="' + escapeHtml(item.date) + '">' + escapeHtml(item.date) + '</time> · ' +
      '<a class="news-source-link" href="' + escapeHtml(item.link) + '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(item.source) + ' ↗</a></div></div></article>').join('');
  }

  function hideUnverifiedBlocks() {
    ['standingsPanel', 'resultsPanel', 'goalsPanel', 'assistsPanel', 'fixturesPanel', 'maclar'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.classList.add('data-unverified');
    });
    document.querySelectorAll('.transfer-live-grid, .euro-news-grid').forEach((element) => element.classList.add('data-unverified'));
    const heroSide = document.querySelector('.hero-side');
    if (heroSide) heroSide.classList.add('data-unverified');
  }

  function renderVerifiedData(data) {
    updateSiteDate(data.asOf || data.updatedAt);
    renderPanels(data);
    renderNews(data.news);
    if (!data.updatedAt) {
      setStatus('Doğrulanmış veri bulundu ancak güncelleme zamanı belirtilmemiş.', 'warning');
      return;
    }
    const updated = new Date(data.updatedAt);
    if (Number.isNaN(updated.valueOf()) || updated > CUTOFF) {
      setStatus('Veri güncelleme zamanı kesim tarihinden sonra veya geçersiz; içerik yayınlanmadı.', 'warning');
      return;
    }
    setStatus('Son doğrulanmış güncelleme: ' + updated.toLocaleString('tr-TR'), 'ok');
  }

  async function load() {
    hideUnverifiedBlocks();
    setStatus('Doğrulanmış futbol verisi kontrol ediliyor…', 'neutral');
    const urls = endpoint ? [endpoint, LOCAL_DATA_URL] : [LOCAL_DATA_URL];
    for (const url of urls) {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) continue;
        const data = normalize(await response.json());
        if (!data) continue;
        renderVerifiedData(data);
        return;
      } catch (_) {
        // Bir sonraki güvenli kaynağı dene; hata durumunda örnek veri gösterilmez.
      }
    }
    renderNews([]);
    setStatus('Doğrulanmış veri kaynağı yapılandırılmadı. Örnek ve eski veriler gösterilmiyor.', 'warning');
  }

  window.addEventListener('DOMContentLoaded', load);
}());
