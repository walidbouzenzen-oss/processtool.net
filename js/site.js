// processtool.net : the menu on a phone, pictures opened large, the contact form.
(function () {
  var btn = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
  if (btn && nav) btn.addEventListener('click', function () { nav.classList.toggle('open'); });
  document.querySelectorAll('.dd-btn').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); b.parentNode.classList.toggle('open'); }); });
  document.addEventListener('click', function () { document.querySelectorAll('.dd.open').forEach(function (d) { d.classList.remove('open'); }); });

  // every screenshot opens large on a click, with its caption
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = '<img alt=""><p></p>';
  document.body.appendChild(box);
  box.addEventListener('click', function () { box.classList.remove('open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.classList.remove('open'); });
  document.querySelectorAll('.card > img, .shot img, .gallery img, .lng img, .tile img, img.shot-hero, .mshot > img, .case img').forEach(function (img) {
    img.addEventListener('click', function () {
      box.querySelector('img').src = img.currentSrc || img.src;
      var fig = img.closest('figure'), cap = fig ? fig.querySelector('figcaption') : null;
      box.querySelector('p').textContent = cap ? cap.textContent : (img.alt || '');
      box.classList.add('open');
    });
  });

  // the contact form : sent from the page through the service address (data-endpoint) ; when a company network stops it, the visitor gets
  // the same message ready as an email to support@processtool.net (Walid, 21 Oct 2026 : "if issue happen let them email us"). Without an
  // address, the form prepares the email straight away.
  var form = document.querySelector('form.contact');
  function mailto(f) {
    var lines = [];
    ['name', 'email', 'company', 'industry', 'inquiry', 'message'].forEach(function (k) { if (f.get(k)) lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ': ' + f.get(k)); });
    return 'mailto:support@processtool.net?subject=' + encodeURIComponent('Flowmax - ' + (f.get('inquiry') || 'enquiry')) + '&body=' + encodeURIComponent(lines.join('\n'));
  }
  if (form && !form.dataset.endpoint) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      location.href = mailto(new FormData(form));
    });
    form = null;
  }
  function done(ok, href) {
    var box = document.createElement('div');
    box.className = 'form-done' + (ok ? '' : ' failed');
    box.innerHTML = ok ? '<h3>Thank you, your message is sent.</h3><p>We reply within two business days, from support@processtool.net.</p>'
      : '<h3>Your network did not let the form through.</h3><p>Your message is ready as an email to support@processtool.net: press the button, then Send.</p>'
        + '<p style="margin-top:16px"><a class="btn blue" href="' + href + '">Send it by email</a></p>';
    form.parentNode.replaceChild(box, form);
  }
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(form), data = {}, href = mailto(f);
    f.forEach(function (v, k) { data[k] = v; });
    if (data._honey) return;                                                  // a robot filled the hidden field
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    fetch(form.dataset.endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data)
    }).then(function (r) { return r.json(); }).then(function (r) {
      done(r.success === true || r.success === 'true', href);
    }).catch(function () { done(false, href); });
  });
  if (location.hash === '#sent' && form) done(true);
})();
