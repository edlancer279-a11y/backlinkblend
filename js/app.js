/* ==========================================================================
   BacklinkBlend — Application Logic Controller (ES Module)
   ========================================================================== */

import { SITE_CONFIG, CATEGORIES, AUTHORS, ARTICLES } from './data.js';

class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('popstate', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    try {
      let rawRoute = '';
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '').trim();
      const hash = window.location.hash.replace(/^#\/?/, '').trim();

      if (path && path !== 'index.html' && window.location.protocol !== 'file:') {
        rawRoute = path;
      } else if (hash) {
        rawRoute = hash;
      }

      const routeStr = rawRoute || 'home';
      const parts = routeStr.split('/');
      const mainRoute = parts[0] || 'home';
      const param = parts.slice(1).filter(Boolean).join('/') || null;

      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (this.routes[mainRoute]) {
        this.routes[mainRoute](param);
      } else if (this.routes['home']) {
        if (window.location.protocol !== 'file:' && window.location.origin && window.location.origin !== 'null') {
          try {
            history.replaceState(null, '', '/');
          } catch (e) {}
        }
        this.routes['home']();
      }
    } catch (err) {
      console.error('Router execution error:', err);
    }
  }
}

export class AppController {
  constructor() {
    this.theme = localStorage.getItem('bb_theme') || 'light';
    this.initTheme();
    this.initEventListeners();
    this.initSearch();
    this.initRouter();
    this.initReadingProgress();
  }

  initTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = this.theme === 'dark' 
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('bb_theme', this.theme);
    this.initTheme();
  }

  initReadingProgress() {
    window.addEventListener('scroll', () => {
      const progressBar = document.getElementById('reading-progress');
      if (!progressBar) return;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        progressBar.style.width = '0%';
        return;
      }
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    });
  }

  initSearch() {
    const searchBtn = document.getElementById('search-trigger-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('modal-search-input');
    const closeBtn = document.getElementById('close-search-btn');

    if (!searchBtn || !searchOverlay || !searchInput) return;

    const openSearch = () => {
      searchOverlay.classList.add('active');
      searchInput.value = '';
      searchInput.focus();
      this.renderSearchResults('');
    };

    const closeSearch = () => {
      searchOverlay.classList.remove('active');
    };

    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeSearch();
      });
    }

    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        closeSearch();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        closeSearch();
      }
    });

    searchInput.addEventListener('input', (e) => {
      this.renderSearchResults(e.target.value);
    });
  }

  renderSearchResults(query) {
    const resultsContainer = document.getElementById('search-results-list');
    if (!resultsContainer) return;

    const q = (query || '').trim().toLowerCase();
    if (!q) {
      resultsContainer.innerHTML = `<p style="padding: 1rem; color: var(--text-muted); font-size: 0.9rem;">Start typing to search articles, categories, and tags...</p>`;
      return;
    }

    const matches = ARTICLES.filter(art => {
      if (!art) return false;
      const titleMatch = (art.title || '').toLowerCase().includes(q);
      const deckMatch = (art.deck || art.metaDescription || '').toLowerCase().includes(q);
      const catMatch = (art.category || '').toLowerCase().includes(q);
      const authorMatch = (art.author && art.author.name) ? art.author.name.toLowerCase().includes(q) : false;
      const tagMatch = art.tags ? art.tags.some(t => t.toLowerCase().includes(q)) : false;

      return titleMatch || deckMatch || catMatch || authorMatch || tagMatch;
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<p style="padding: 1rem; color: var(--text-muted); font-size: 0.9rem;">No articles found matching "<strong>${q}</strong>". Try another keyword.</p>`;
      return;
    }

    resultsContainer.innerHTML = matches.map(art => `
      <div class="search-result-item" style="cursor: pointer;" onclick="if(window.app) { window.app.navigateTo('article/${art.slug}'); document.getElementById('search-overlay').classList.remove('active'); }">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
          <span class="badge badge-outline" style="font-size: 0.65rem;">${(art.category || 'EDITORIAL').toUpperCase()}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${art.date || ''}</span>
        </div>
        <h4 style="font-family: var(--font-serif-header); font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0.25rem 0;">${art.title}</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-clamp: 2; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">${art.deck || art.metaDescription || ''}</p>
      </div>
    `).join('');
  }

  navigateTo(rawRoute) {
    const cleanRoute = (rawRoute || '').trim().replace(/^#\/?|^\//, '');
    
    if (cleanRoute === 'home' || cleanRoute === '') {
      if (window.location.protocol !== 'file:' && window.location.origin && window.location.origin !== 'null') {
        history.pushState(null, '', '/');
      } else {
        window.location.hash = '';
      }
      this.renderHome();
    } else {
      if (window.location.protocol !== 'file:' && window.location.origin && window.location.origin !== 'null') {
        history.pushState(null, '', `/${cleanRoute}`);
      } else {
        window.location.hash = `#${cleanRoute}`;
      }

      if (cleanRoute === 'articles') {
        this.renderArticlesView();
      } else if (cleanRoute.startsWith('category/')) {
        const slug = cleanRoute.replace('category/', '');
        this.renderCategoryView(slug);
      } else if (cleanRoute.startsWith('article/')) {
        const slug = cleanRoute.replace('article/', '');
        this.renderArticleDetail(slug);
      } else if (cleanRoute === 'about') {
        this.renderAboutView();
      } else if (cleanRoute === 'contact') {
        this.renderContactView();
      } else if (cleanRoute === 'privacy') {
        this.renderPrivacyView();
      } else if (cleanRoute === 'terms') {
        this.renderTermsView();
      } else if (cleanRoute === 'disclaimer') {
        this.renderDisclaimerView();
      }
    }
  }

  initEventListeners() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link) {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('/') || href.startsWith('#'))) {
          e.preventDefault();
          const route = href.replace(/^#\/?|^\//, '').trim();
          this.navigateTo(route);
        }
      }
    });
  }

  initRouter() {
    this.router = new Router({
      'home': () => this.renderHome(),
      'articles': () => this.renderArticlesView(),
      'category': (slug) => this.renderCategoryView(slug),
      'article': (slug) => this.renderArticleDetail(slug),
      'about': () => this.renderAboutView(),
      'contact': () => this.renderContactView(),
      'privacy': () => this.renderPrivacyView(),
      'terms': () => this.renderTermsView(),
      'disclaimer': () => this.renderDisclaimerView()
    });
  }
}
