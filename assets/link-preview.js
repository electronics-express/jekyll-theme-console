(function () {
  if (!window.matchMedia('(hover: hover)').matches) return;

  var posts = {};
  var popup = null;
  var showTimer = null;
  var hideTimer = null;

  fetch('/assets/posts.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      data.forEach(function (p) {
        posts[p.url.replace(/\/$/, '')] = p;
      });
    })
    .catch(function () {});

  function getPopup() {
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'link-preview';
      document.body.appendChild(popup);
    }
    return popup;
  }

  function position(link) {
    var el = getPopup();
    var rect = link.getBoundingClientRect();
    var scrollY = window.scrollY || window.pageYOffset;
    var scrollX = window.scrollX || window.pageXOffset;
    var margin = 12;
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    var top;

    if (window.innerHeight - rect.bottom >= h + margin) {
      top = rect.bottom + scrollY + margin;
    } else {
      top = rect.top + scrollY - h - margin;
    }

    var left = rect.left + scrollX;
    if (left + w > window.innerWidth - margin) {
      left = window.innerWidth - w - margin;
    }
    left = Math.max(margin, left);

    el.style.top = top + 'px';
    el.style.left = left + 'px';
  }

  function show(link) {
    var href = link.getAttribute('href') || '';
    var el = getPopup();
    var isExternal = /^https?:\/\//.test(href) || href.startsWith('//');

    el.textContent = '';

    if (isExternal) {
      var extSpan = document.createElement('span');
      extSpan.className = 'lp-external';
      extSpan.textContent = 'leaving electronics.express →';
      el.appendChild(extSpan);
    } else {
      var key = href.replace(/\/$/, '');
      var post = posts[key];
      if (!post) return;
      var metaSpan = document.createElement('span');
      metaSpan.className = 'lp-date';
      metaSpan.textContent = post.date + ' · ' + post.reading_time + ' min read';
      var excerptSpan = document.createElement('span');
      excerptSpan.className = 'lp-excerpt';
      excerptSpan.textContent = post.excerpt;
      el.appendChild(metaSpan);
      el.appendChild(excerptSpan);
    }

    el.classList.add('link-preview--active');
    requestAnimationFrame(function () { position(link); });
  }

  function hide() {
    if (popup) popup.classList.remove('link-preview--active');
  }

  var SKIP = ['site-title', 'site-logo-link', 'menu'];

  function shouldSkip(link) {
    return SKIP.some(function (cls) {
      return link.closest('.' + cls);
    });
  }

  document.addEventListener('mouseover', function (e) {
    var link = e.target.closest('a');
    if (!link || shouldSkip(link)) return;
    clearTimeout(hideTimer);
    clearTimeout(showTimer);
    showTimer = setTimeout(function () { show(link); }, 180);
  });

  document.addEventListener('mouseout', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    clearTimeout(showTimer);
    hideTimer = setTimeout(hide, 80);
  });
})();
