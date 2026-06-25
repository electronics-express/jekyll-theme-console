document.querySelectorAll('div[class*="language-"]').forEach(function(el) {
  var lang = Array.from(el.classList).find(function(c) { return c.startsWith('language-'); });
  if (lang) {
    lang = lang.replace('language-', '');
    if (lang !== 'plaintext' && lang !== 'text') {
      el.setAttribute('data-lang', lang);
    }
  }
});
