(function () {
  var routes = { h: '/', l: '/links/', a: '/about/', t: '/tree' };
  var pending = false;
  var pendingTimer = null;
  var helpVisible = false;
  var helpEl = null;

  function buildHelp() {
    var el = document.createElement('div');
    el.className = 'kb-help';
    el.innerHTML =
      '<div class="kb-help-title">keyboard shortcuts</div>' +
      '<div class="kb-row"><span class="kb-key">g h</span><span class="kb-desc">home</span></div>' +
      '<div class="kb-row"><span class="kb-key">g l</span><span class="kb-desc">links</span></div>' +
      '<div class="kb-row"><span class="kb-key">g a</span><span class="kb-desc">about</span></div>' +
      '<div class="kb-row"><span class="kb-key">g t</span><span class="kb-desc">site map</span></div>' +
      '<div class="kb-row"><span class="kb-key">?</span><span class="kb-desc">this panel</span></div>' +
      '<div class="kb-row"><span class="kb-key">esc</span><span class="kb-desc">dismiss</span></div>';
    document.body.appendChild(el);
    return el;
  }

  function showHelp() {
    if (!helpEl) helpEl = buildHelp();
    helpEl.classList.add('kb-help--visible');
    helpVisible = true;
  }

  function hideHelp() {
    if (helpEl) helpEl.classList.remove('kb-help--visible');
    helpVisible = false;
  }

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea, select')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    var key = e.key === 'Escape' ? 'esc' : e.key.toLowerCase();

    if (key === 'esc') { hideHelp(); pending = false; clearTimeout(pendingTimer); return; }
    if (key === '?') { helpVisible ? hideHelp() : showHelp(); return; }

    if (pending) {
      clearTimeout(pendingTimer);
      pending = false;
      if (routes[key]) window.location.href = routes[key];
      return;
    }

    if (key === 'g') {
      pending = true;
      pendingTimer = setTimeout(function () { pending = false; }, 1000);
    }
  });

  document.addEventListener('click', function (e) {
    if (helpEl && helpVisible && !helpEl.contains(e.target)) hideHelp();
  });
})();
