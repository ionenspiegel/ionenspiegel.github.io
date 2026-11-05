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
    ['standingsPanel', 'scorersPanel', 'assistsPanel', 'fixturesPanel', 'maclar'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.classList.add('data-unverified');
    });
    document.querySelectorAll('.transfer-live-grid, .euro-news-grid').forEach((element) => element.classList.add('data-unverified'));
    const heroSide = document.querySelector('.hero-side');
    if (heroSide) heroSide.classList.add('data-unverified');
  }

  function renderVerifiedData(data) {
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
