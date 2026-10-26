const fs = require('fs');

let code = fs.readFileSync('js/bundle.js', 'utf8');

const targetStr = `      this.initRouter();
      this.initReadingProgress();
      this.loadAds();
    }`;

const targetStrCRLF = targetStr.replace(/\n/g, '\r\n');

const replacement = `      this.initRouter();
      this.initReadingProgress();
      const triggerAds = () => {
        if (this._adsInitialized) return;
        this._adsInitialized = true;
        this.loadAds();
      };
      ['scroll', 'mousemove', 'touchstart', 'click', 'keydown'].forEach(e => {
        window.addEventListener(e, triggerAds, { once: true, passive: true });
      });
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setTimeout(triggerAds, 3500));
      } else {
        setTimeout(triggerAds, 4000);
      }
    }`;

if (code.includes(targetStrCRLF)) {
  code = code.replace(targetStrCRLF, replacement.replace(/\n/g, '\r\n'));
  fs.writeFileSync('js/bundle.js', code, 'utf8');
  console.log('Successfully patched bundle.js (CRLF)');
} else if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('js/bundle.js', code, 'utf8');
  console.log('Successfully patched bundle.js (LF)');
} else {
  console.log('Could not find targetStr');
}
