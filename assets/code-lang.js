document.querySelectorAll('div[class*="language-"]').forEach(function(el) {
  var lang = Array.from(el.classList).find(function(c) { return c.startsWith('language-'); });
  if (lang) {
    lang = lang.replace('language-', '');
    if (lang !== 'plaintext' && lang !== 'text') {
      el.setAttribute('data-lang', lang);
    }
  }

  var btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = 'copy';
  btn.addEventListener('click', function () {
    var code = el.querySelector('code');
    if (!code) return;
    navigator.clipboard.writeText(code.innerText).then(function () {
      btn.textContent = 'copied';
      setTimeout(function () { btn.textContent = 'copy'; }, 1500);
    });
  });
  el.appendChild(btn);
});
