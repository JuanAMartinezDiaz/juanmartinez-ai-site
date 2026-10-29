/* Shared measurement: Vercel aggregate metrics + optional GA4 returning-browser metrics. */
(() => {
  if (window.baiMeasurement) return;
  const id = 'G-BBSDXENED8';
  const key = 'bai-analytics-consent-v1';
  const protectedChoice = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  const standalone = document.currentScript?.dataset.vercel === 'true';
  const allowedHost = ['www.juanmartinez.ai', 'juanmartinez.ai'].includes(location.hostname);
  if (!allowedHost || location.pathname.startsWith('/admin/')) return;
  let consent = false;
  try { const saved = JSON.parse(localStorage.getItem(key)); consent = saved?.accepted === true && saved.expires > Date.now(); } catch { /* Storage unavailable: ask again. */ }
  consent = consent && !protectedChoice;
  window['ga-disable-' + id] = !consent;
  window.dataLayer = window.dataLayer || [];
  const gtag = function () { window.dataLayer.push(arguments); };
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  function safeLocation() {
    const url = new URL(location.origin + location.pathname);
    const input = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(name => {
      const value = input.get(name);
      if (value && /^[a-zA-Z0-9_-]{1,100}$/.test(value)) url.searchParams.set(name, value);
    });
    return url.href;
  }
  function referrer() { try { return new URL(document.referrer).origin; } catch { return ''; } }
  function startGoogle() {
    if (!consent || document.getElementById('bai-google-tag')) return;
    window['ga-disable-' + id] = false;
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    gtag('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 7776000, cookie_update: false, page_location: safeLocation(), page_referrer: referrer(), page_title: location.pathname });
    gtag('event', 'page_view', { page_location: safeLocation(), page_referrer: referrer(), page_title: location.pathname, send_to: id });
    const script = document.createElement('script'); script.id = 'bai-google-tag'; script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id; document.head.append(script);
  }
  if (standalone && !document.querySelector('script[src*="/_vercel/insights/script.js"]')) {
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    window.va('beforeSend', event => ({ ...event, url: safeLocation() }));
    const script = document.createElement('script'); script.defer = true; script.src = '/_vercel/insights/script.js'; document.head.append(script);
  }
  function clearCookies() {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)|^_gid$|^_gat/.test(name)) return;
      ['', location.hostname, '.juanmartinez.ai'].forEach(domain => { document.cookie = name + '=; Max-Age=0; path=/;' + (domain ? ' domain=' + domain + ';' : '') + ' SameSite=Lax; Secure'; });
    });
  }
  function choose(accepted) {
    consent = accepted && !protectedChoice;
    try { localStorage.setItem(key, JSON.stringify({ accepted: consent, expires: Date.now() + 15552000000 })); } catch { /* Consent lasts only this page. */ }
    panel.hidden = true;
    if (consent) startGoogle();
    else { window['ga-disable-' + id] = true; gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }); clearCookies(); if (document.getElementById('bai-google-tag')) location.reload(); }
  }
  const style = document.createElement('style');
  style.textContent = '#bai-privacy{position:fixed;bottom:12px;left:12px;z-index:10000;max-width:min(440px,calc(100vw - 24px));font:14px/1.5 system-ui;color:#fff}#bai-privacy section{padding:20px;background:#10213b;border:1px solid #829887;border-radius:8px;box-shadow:0 5px 24px #0005}#bai-privacy p{margin:8px 0 14px}#bai-privacy button,#bai-privacy a{font:inherit;color:inherit}#bai-privacy button{cursor:pointer;background:#10213b;border:1px solid #aabcb0;border-radius:4px;padding:9px 12px;margin:4px}#bai-privacy button:focus-visible{outline:3px solid #fff;outline-offset:2px}#bai-privacy section[hidden]{display:none}#bai-privacy .settings{font-size:12px}';
  document.head.append(style);
  const ui = document.createElement('div'); ui.id = 'bai-privacy';
  ui.innerHTML = '<section aria-label="Analytics preferences"><strong>Analytics preferences</strong><p>We use cookie-free Vercel statistics for aggregate traffic. Optional Google Analytics cookies help measure returning browsers and campaigns. Google receives analytics only if you accept. No advertising pixels or remarketing are enabled. <a href="/analytics-privacy.html">Details</a></p><button type="button" data-choice="yes">Accept analytics cookies</button><button type="button" data-choice="no">Reject analytics cookies</button><button type="button" data-close>Close</button></section><button type="button" class="settings">Analytics settings</button>';
  document.body.append(ui); const panel = ui.querySelector('section');
  let savedChoice = false; try { const saved = JSON.parse(localStorage.getItem(key)); savedChoice = saved?.expires > Date.now(); } catch { /* Ask on each page. */ }
  panel.hidden = savedChoice || protectedChoice;
  ui.querySelector('[data-choice="yes"]').disabled = protectedChoice;
  if (protectedChoice) ui.querySelector('p').append(' Your browser privacy signal disables Google Analytics.');
  ui.querySelector('[data-choice="yes"]').onclick = () => choose(true);
  ui.querySelector('[data-choice="no"]').onclick = () => choose(false);
  ui.querySelector('[data-close]').onclick = () => { panel.hidden = true; };
  ui.querySelector('.settings').onclick = () => { panel.hidden = !panel.hidden; if (!panel.hidden) ui.querySelector('[data-choice="no"]').focus(); };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]'); if (!link) return;
    const url = new URL(link.href, location.href);
    let name;
    if (url.protocol === 'mailto:') name = 'contact_email_click';
    else if (url.origin !== location.origin && url.pathname.endsWith('demo.html')) name = 'demo_click';
    else if (url.origin !== location.origin && /^https?:$/.test(url.protocol)) name = 'outbound_click';
    else if (/\.(pdf|docx|xlsx)$/i.test(url.pathname)) name = 'file_download_click';
    if (!name) return;
    const data = { page_path: location.pathname, destination: url.protocol === 'mailto:' ? 'email' : url.hostname, link_type: name };
    if (standalone && window.va) window.va('event', { name, data });
    if (consent) gtag('event', name, { ...data, send_to: id });
  });
  window.baiMeasurement = { settings: () => { panel.hidden = false; } };
  startGoogle();
})();
