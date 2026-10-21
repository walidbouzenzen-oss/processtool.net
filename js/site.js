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

  // the contact form : sent through Web3Forms when its key is set, otherwise prepared as an email
  var form = document.querySelector('form.contact');
  if (form) form.addEventListener('submit', function (e) {
    var key = form.querySelector('[name=access_key]');
    if (key && key.value && key.value.indexOf('YOUR-') !== 0) return;      // the service takes it from here
    e.preventDefault();
    var f = new FormData(form), lines = [];
    ['name', 'email', 'company', 'industry', 'inquiry', 'message'].forEach(function (k) { if (f.get(k)) lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ': ' + f.get(k)); });
    location.href = 'mailto:support@processtool.net?subject=' + encodeURIComponent('Flowmax - ' + (f.get('inquiry') || 'enquiry')) + '&body=' + encodeURIComponent(lines.join('\n'));
  });
})();
