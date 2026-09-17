/* ==========================================================================
   BacklinkBlend — SPA Router Engine
   Supports Clean HTML5 Permalinks (/article/slug) & Local File Fallbacks
   Automatic Cleanup for Unrecognized Legacy Slugs
   ========================================================================== */

export class Router {
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
      } else if (this.routes['article']) {
        this.routes['article'](routeStr || mainRoute);
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

  static navigate(route) {
    const cleanRoute = (route || '').trim().replace(/^#\/?|^\//, '');
    if (cleanRoute === 'home' || cleanRoute === '') {
      if (window.location.protocol !== 'file:' && window.location.origin && window.location.origin !== 'null') {
        history.pushState(null, '', '/');
      } else {
        window.location.hash = '';
      }
    } else {
      if (window.location.protocol !== 'file:' && window.location.origin && window.location.origin !== 'null') {
        history.pushState(null, '', `/${cleanRoute}`);
      } else {
        window.location.hash = `#${cleanRoute}`;
      }
    }
  }
}
