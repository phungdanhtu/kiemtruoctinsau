(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var DAU_HIEU = {
    1: 'Người lạ hoặc chưa rõ nguồn',
    2: 'Đòi tiền, mã OTP, thông tin cá nhân hoặc giục làm gấp',
    3: 'Chưa có người tin cậy xác nhận'
  };

  // Luật của hộp, giống hệt mạch cây quyết định
  function luatDen(s1, s2, s3) {
    if (s2 || (s1 && s3)) return 'ĐỎ';
    if (s1 || s3) return 'VÀNG';
    return 'XANH';
  }
  // Đường đi của dòng điện qua các công tắc
  function duongDi(s1, s2, s3) {
    var e = ['e-k-s2'], n = ['n-k', 'n-s2'], den;
    if (s2) { e.push('e-s2-red'); den = 'ĐỎ'; }
    else {
      e.push('e-s2-s1'); n.push('n-s1');
      if (!s1) { e.push('e-s1-s3a'); n.push('n-s3a'); if (s3) { e.push('e-s3a-yel'); den = 'VÀNG'; } else { e.push('e-s3a-grn'); den = 'XANH'; } }
      else { e.push('e-s1-s3b'); n.push('n-s3b'); if (s3) { e.push('e-s3b-red'); den = 'ĐỎ'; } else { e.push('e-s3b-yel'); den = 'VÀNG'; } }
    }
    return { edges: e, nodes: n, den: den };
  }
  var TREE_LAMP = { 'ĐỎ': 't-red', 'VÀNG': 't-yel', 'XANH': 't-grn' };

  var sw = { 1: false, 2: false, 3: false };
  var ver = 1, daCoKetQua = false, amThanh = true;

  // ---------- micro:bit (phiên bản 2) ----------
  var ICON = {
    'ĐỎ':   ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],   // IconNames.No
    'VÀNG': ['.....', '.#.#.', '.....', '.#.#.', '#.#.#'],   // IconNames.Confused
    'XANH': ['.....', '....#', '...#.', '#.#..', '.#...']    // IconNames.Yes
  };
  var mb = document.getElementById('mb');
  (function () { var h = ''; for (var i = 0; i < 25; i++) h += '<i></i>'; mb.innerHTML = h; })();
  function veMb(rows) {
    var cells = mb.children;
    for (var y = 0; y < 5; y++) for (var x = 0; x < 5; x++) cells[y * 5 + x].classList.toggle('on', rows[y].charAt(x) === '#');
  }
  function mbDauHieu() { // như hàm hienDauHieu(): cột 0, 2, 4 ứng với dấu hiệu 1, 2, 3
    var rows = [];
    for (var y = 0; y < 5; y++) {
      var r = '';
      for (var x = 0; x < 5; x++) r += (y >= 1 && y <= 3 && ((x === 0 && sw[1]) || (x === 2 && sw[2]) || (x === 4 && sw[3]))) ? '#' : '.';
      rows.push(r);
    }
    veMb(rows);
  }
  var actx = null;
  function phat(notes) { // [[tần số Hz, thời gian ms], ...] giống music.playTone
    if (!amThanh || ver !== 2) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var t = actx.currentTime + 0.02;
      notes.forEach(function (n) {
        var o = actx.createOscillator(), g = actx.createGain();
        o.type = 'square'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.08, t + 0.01);
        g.gain.setValueAtTime(0.08, t + n[1] / 1000 - 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + n[1] / 1000);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + n[1] / 1000 + 0.01);
        t += n[1] / 1000 + 0.04;
      });
    } catch (e) { /* trình duyệt không hỗ trợ âm thanh */ }
  }
  var AM = { 'ĐỎ': [[196, 300], [196, 300], [196, 600]], 'VÀNG': [[392, 300], [392, 300]], 'XANH': [[523, 300]] };
  var CODE = { 'ĐỎ': 'c-1', 'VÀNG': 'c-2', 'XANH': 'c-3' };
  var TU = { 1: { cai: 'công tắc', chon: 'Gạt công tắc', ve: 'Gạt về KHÔNG' }, 2: { cai: 'nút', chon: 'Bấm nút', ve: 'Làm lại' } };

  function tatDen() {
    $$('.lamp').forEach(function (l) { l.classList.remove('on'); });
    $$('.lamp-row').forEach(function (r) { r.classList.remove('lit'); });
    $$('#tree .hot').forEach(function (x) { x.classList.remove('hot'); });
    $$('#tree .tl circle').forEach(function (c) { c.classList.remove('on'); });
    $$('#truth-body tr').forEach(function (r) { r.classList.remove('cur'); });
    $('.blocks').classList.remove('ran');
    $$('.blocks .hot').forEach(function (x) { x.classList.remove('hot'); });
    daCoKetQua = false;
  }

  function veCongTac() {
    $$('.sw').forEach(function (el) {
      var k = el.getAttribute('data-k'), on = sw[k];
      el.classList.toggle('on', on);
      $('.toggle', el).setAttribute('aria-checked', on ? 'true' : 'false');
      $('.sw-state', el).textContent = on ? 'CÓ' : 'KHÔNG';
    });
    mbDauHieu();
  }

  function nhanKiem() {
    tatDen();
    var p = duongDi(sw[1], sw[2], sw[3]);
    var den = luatDen(sw[1], sw[2], sw[3]);
    if (den !== p.den) { console.error('Mạch và luật không khớp'); }
    p.edges.forEach(function (id) { var x = document.getElementById(id); if (x) x.classList.add('hot'); });
    p.nodes.forEach(function (id) { var x = document.getElementById(id); if (x) x.classList.add('hot'); });
    document.getElementById(TREE_LAMP[den]).classList.add('on');
    var lamp = document.getElementById('lamp-' + den);
    lamp.classList.add('on'); lamp.parentNode.classList.add('lit');
    var row = document.querySelector('#truth-body tr[data-key="' + key(sw[1], sw[2], sw[3]) + '"]');
    if (row) row.classList.add('cur');
    var co = [1, 2, 3].filter(function (k) { return sw[k]; });
    $('.blocks').classList.add('ran'); document.getElementById(CODE[den]).classList.add('hot');
    if (ver === 2) { veMb(ICON[den]); phat(AM[den]); }
    daCoKetQua = true;
    $('#result-line').textContent = 'Đèn ' + den + (co.length ? ' – dấu hiệu đã chọn CÓ: ' + co.join(', ') : ' – không có dấu hiệu nào') + '.';
    if (mode === 'the') chamThe(den, co);
  }

  function key(a, b, c) { return (a ? 1 : 0) + '' + (b ? 1 : 0) + '' + (c ? 1 : 0); }

  // Bảng 8 trường hợp
  (function bang() {
    var tb = $('#truth-body'), html = '';
    for (var i = 0; i < 8; i++) {
      var a = !!(i & 4), b = !!(i & 2), c = !!(i & 1), d = luatDen(a, b, c);
      html += '<tr class="' + d + '" data-key="' + key(a, b, c) + '"><td>' + (a ? 'CÓ' : '–') + '</td><td>' + (b ? 'CÓ' : '–') + '</td><td>' + (c ? 'CÓ' : '–') + '</td><td class="den">' + d + '</td></tr>';
    }
    tb.innerHTML = html;
  })();

  $$('.sw').forEach(function (el) {
    $('.toggle', el).addEventListener('click', function () {
      var k = el.getAttribute('data-k');
      if (ver === 2 && daCoKetQua) sw = { 1: false, 2: false, 3: false }; // như micro:bit: bấm sau khi có kết quả là lượt mới
      sw[k] = !sw[k]; tatDen(); veCongTac();
      if (ver === 2) phat([[659, 60]]);
      $('#result-line').textContent = (ver === 1 ? 'Đã gạt công tắc ' : 'Đã bấm nút ') + k + ': ' + (sw[k] ? 'CÓ' : 'KHÔNG') + '. Nhấn KIỂM để xem đèn.';
    });
  });
  $('#kiem').addEventListener('click', nhanKiem);
  $('#reset').addEventListener('click', function () { sw = { 1: false, 2: false, 3: false }; tatDen(); veCongTac(); $('#result-line').textContent = ver === 1 ? 'Đã gạt cả ba công tắc về KHÔNG.' : 'Đã làm lại, chưa chọn dấu hiệu nào.'; });

  // ---------- Chọn phiên bản ----------
  function chonPhienBan(v) {
    ver = v;
    var dev = $('#device');
    dev.classList.toggle('v2', v === 2);
    $$('.seg button').forEach(function (b) { b.setAttribute('aria-checked', String(+b.getAttribute('data-ver') === v)); });
    $('#device-name').textContent = v === 1 ? 'Phiên bản 1 · Nút công tắc' : 'Phiên bản 2 · Bảng điều khiển (mô phỏng theo thiết kế)';
    $('#tree-box').hidden = v !== 1; $('#code-box').hidden = v !== 2;
    $('#am-thanh').hidden = v !== 2;
    $('#reset').textContent = TU[v].ve;
    $('#sim-sub').innerHTML = v === 1
      ? 'Mô phỏng đúng mạch của phiên bản 1: ba công tắc, một nút KIỂM, ba đèn. Gạt công tắc sang <b>CÓ</b> khi thấy dấu hiệu, rồi nhấn <b>KIỂM</b>.'
      : 'Mô phỏng phiên bản 2 theo bản thiết kế: ba nút dấu hiệu, nút KIỂM, ba đèn, màn hình micro:bit và âm báo. Bấm nút khi thấy dấu hiệu, rồi nhấn <b>KIỂM</b>.';
    $$('.sw').forEach(function (el) {
      var k = el.getAttribute('data-k');
      $('.toggle', el).setAttribute('aria-label', (v === 1 ? 'Công tắc ' : 'Nút ') + k + ': ' + DAU_HIEU[k]);
    });
    sw = { 1: false, 2: false, 3: false }; tatDen(); veCongTac();
    $('#result-line').textContent = v === 1 ? 'Chưa nhấn KIỂM.' : 'Chưa nhấn KIỂM. Bật loa máy để nghe âm báo.';
    if (mode === 'the') hienThe();
  }
  $$('[data-ver]').forEach(function (b) { b.addEventListener('click', function () { chonPhienBan(+b.getAttribute('data-ver')); }); });
  $('#am-thanh').addEventListener('click', function () {
    amThanh = !amThanh; this.setAttribute('aria-pressed', String(amThanh)); this.textContent = 'Âm báo: ' + (amThanh ? 'bật' : 'tắt');
  });

  // ---------- Chơi với thẻ ----------
  var mode = 'tudo';
  function tron(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); for (var j = n - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[r]; a[r] = t; } return a; }
  var THE = window.THE_TINH_HUONG || [], AI = window.THE_AI || [];
  var bo = tron(THE.length), vt = 0, daCham = false, soThe = 0, soDung = 0;

  function hienThe() {
    var t = THE[bo[vt % bo.length]];
    $('#card-kenh').textContent = t.kenh;
    $('#card-so').textContent = 'Thẻ ' + ((vt % bo.length) + 1) + '/' + bo.length;
    $('#card-text').textContent = t.text;
    $('#card-back').hidden = true; daCham = false;
    sw = { 1: false, 2: false, 3: false }; tatDen(); veCongTac();
    $('#result-line').textContent = 'Đọc thẻ, ' + TU[ver].chon.toLowerCase() + ' theo dấu hiệu, rồi nhấn KIỂM.';
  }
  function chamThe(den, co) {
    if (daCham) return;
    daCham = true; soThe++;
    var t = THE[bo[vt % bo.length]];
    var dungDen = den === t.den;
    var dungDH = co.join(',') === t.dh.slice().sort().join(',');
    if (dungDen) soDung++;
    var v = $('#card-verdict');
    v.className = 'verdict ' + (dungDen ? 'ok' : 'no');
    v.textContent = dungDen ? (dungDH ? 'Đúng đèn và đúng dấu hiệu!' : 'Đúng đèn! Xem lại dấu hiệu trong đáp án nhé.') : 'Chưa đúng. Hộp báo ' + den + ', đáp án là ' + t.den + '.';
    $('#card-dapan').textContent = 'Đèn ' + t.den + ' – ' + (t.dh.length ? 'dấu hiệu ' + t.dh.map(function (k) { return k + ' (' + DAU_HIEU[k].toLowerCase() + ')'; }).join('; ') : 'không có dấu hiệu nào');
    $('#card-lydo').textContent = t.lydo;
    $('#card-lam').textContent = t.lam;
    $('#card-back').hidden = false;
    $('#score').textContent = 'Đã chơi ' + soThe + ' thẻ, đúng đèn ' + soDung + ' thẻ';
  }
  $('#next-card').addEventListener('click', function () { vt++; hienThe(); });

  function chonCheDo(m) {
    mode = m;
    $$('.tabs button').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-mode') === m ? 'true' : 'false'); });
    $('#card-panel').hidden = m !== 'the';
    if (m === 'the') hienThe(); else { tatDen(); $('#result-line').textContent = 'Chưa nhấn KIỂM.'; }
  }
  $$('[data-mode]').forEach(function (b) { b.addEventListener('click', function () { chonCheDo(b.getAttribute('data-mode')); }); });

  // ---------- Bắt lỗi AI ----------
  var boAI = tron(AI.length), vtAI = 0;
  function hienAI() {
    var a = AI[boAI[vtAI % boAI.length]];
    $('#ai-so').textContent = 'Thẻ ' + ((vtAI % boAI.length) + 1) + '/' + boAI.length;
    $('#ai-text').textContent = a.text;
    $('#ai-back').hidden = true;
    $$('[data-ai]').forEach(function (b) { b.disabled = false; });
  }
  $$('[data-ai]').forEach(function (b) {
    b.addEventListener('click', function () {
      var a = AI[boAI[vtAI % boAI.length]], chon = b.getAttribute('data-ai') === 'true';
      var dung = chon === a.dung, v = $('#ai-verdict');
      v.className = 'verdict ' + (dung ? 'ok' : 'no');
      v.textContent = (dung ? 'Chính xác! ' : 'Chưa đúng. ') + 'AI nói ' + (a.dung ? 'đúng.' : 'sai.');
      $('#ai-giaithich').textContent = a.giaithich;
      $('#ai-kiemtra').textContent = a.kiemtra;
      $('#ai-back').hidden = false;
      $$('[data-ai]').forEach(function (x) { x.disabled = true; });
    });
  });
  $('#ai-next').addEventListener('click', function () { vtAI++; hienAI(); });

  // ---------- Video, hình ảnh, bộ thẻ (đọc từ config.js) ----------
  var CH = window.CAU_HINH || {};
  function an(s) { return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function hopLe(u) { return /^https:\/\//i.test(u) || /^(assets|tai-lieu)\/[\w\-./]+$/i.test(u); }
  function idDrive(u) { var m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{10,})/); return m ? m[1] : null; }
  function nhung(u) {
    if (!u || !hopLe(u)) return null;
    var m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    if (m) return { kieu: 'iframe', src: 'https://www.youtube-nocookie.com/embed/' + m[1] + '?rel=0&autoplay=1' };
    var d = idDrive(u);
    if (d) return { kieu: 'iframe', src: 'https://drive.google.com/file/d/' + d + '/preview' };
    if (/\.(mp4|webm)(\?|$)/i.test(u)) return { kieu: 'video', src: u };
    return null;
  }
  $$('.vid-frame').forEach(function (f) {
    var title = f.getAttribute('data-title'), e = nhung(CH[f.getAttribute('data-video')]);
    if (!e) {
      f.innerHTML = '<div class="vid-ph wait"><span class="play"></span><b>' + an(title) + '</b><span>Video đang được nhóm thực hiện, sẽ cập nhật sớm.</span></div>';
      return;
    }
    f.innerHTML = '<button class="vid-ph" aria-label="Phát ' + an(title) + '"><span class="play"></span><b>' + an(title) + '</b><span>Bấm để phát</span></button>';
    $('button', f).addEventListener('click', function () {
      f.innerHTML = e.kieu === 'iframe'
        ? '<iframe src="' + an(e.src) + '" title="' + an(title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>'
        : '<video src="' + an(e.src) + '" controls autoplay playsinline style="position:absolute;inset:0;width:100%;height:100%;background:#000"></video>';
    });
  });

  function anh(u) {
    if (!u || !hopLe(u)) return null;
    var d = idDrive(u);
    return d ? 'https://drive.google.com/thumbnail?id=' + d + '&sz=w1600' : u;
  }
  (function gallery() {
    var g = $('#gallery'), ds = CH.hinhAnh || [], html = '';
    ds.forEach(function (h, i) {
      var s = anh(h.src);
      html += '<figure class="shot">' + (s
        ? '<button data-i="' + i + '" aria-label="Xem ảnh lớn: ' + an(h.chuThich) + '"><img src="' + an(s) + '" alt="' + an(h.chuThich) + '" loading="lazy" referrerpolicy="no-referrer"></button>'
        : '<div class="ph">Ảnh sẽ cập nhật</div>') + '<figcaption>' + an(h.chuThich) + '</figcaption></figure>';
    });
    g.innerHTML = html;
    var lb = $('#lightbox');
    $$('button[data-i]', g).forEach(function (b) {
      b.addEventListener('click', function () {
        var h = ds[+b.getAttribute('data-i')];
        $('#lb-img').src = anh(h.src); $('#lb-img').alt = h.chuThich; $('#lb-cap').textContent = h.chuThich;
        lb.hidden = false; $('#lb-close').focus();
      });
    });
    function dong() { lb.hidden = true; $('#lb-img').removeAttribute('src'); }
    $('#lb-close').addEventListener('click', dong);
    lb.addEventListener('click', function (ev) { if (ev.target === lb) dong(); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !lb.hidden) dong(); });
  })();

  (function boThe() {
    var a = $('#link-bo-the'), u = CH.linkBoThe;
    if (u && /^https:\/\//i.test(u)) { a.href = u; }
    else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); $('#link-bo-the-note').hidden = false; }
  })();

  veCongTac(); hienAI();
  if (location.hash === '#choi-the') chonCheDo('the');
  if (location.hash === '#phien-ban-2') chonPhienBan(2);
})();
