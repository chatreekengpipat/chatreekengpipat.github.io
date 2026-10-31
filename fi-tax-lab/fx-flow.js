/* ============================================================
   fx-flow.js · ambient smoke / water-flow layer for every page
   ------------------------------------------------------------
   A WebGL fragment shader (domain-warped fractal noise) draws slow
   wisps BEHIND the content: fixed canvas, negative z-index, painted
   over the page background but under every block. The pointer
   stirs it — a short trail of swirls follows the mouse or finger —
   and scrolling drifts it, like dragging a hand through water.

   Readability first: low alpha, calmer in the centre column where
   text sits, palette anchored to the real page background and read
   from the Lab's petrol/champagne tokens. Theme changes are
   interpolated in the render loop instead of visibly snapping.

   Cheap by design: rendered at ~1/3 resolution and scaled up (the
   blur is the look), 30 fps while you interact, 15 fps when idle,
   paused in background tabs, one static frame for
   prefers-reduced-motion, nothing at all without WebGL or with
   localStorage fx = "off". Never printed.
   ============================================================ */
(function () {
  'use strict';
  if (window.FxFlow) return;
  var d = document, root = d.documentElement, w = window;
  try { if (localStorage.getItem('fx') === 'off') return; } catch (e) {}
  if (root.hasAttribute('data-fx-off')) return;

  var mqReduce = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = function () { return !!(mqReduce && mqReduce.matches); };

  function start() {
    if (!d.body) return;
    var c = d.createElement('canvas');
    c.className = 'fx-flow';
    c.setAttribute('aria-hidden', 'true');
    var behind = d.getElementById('techCanvas');                 /* index-style pages already paint a background canvas at -999 */
    c.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:' + (behind ? -998 : -1) + ';opacity:0;transition:opacity 1.8s cubic-bezier(.2,.7,.2,1)';
    var gl = null;
    try { gl = c.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false }); } catch (e) {}
    if (!gl) return;
    var st = d.createElement('style');
    st.textContent = '@media print{.fx-flow{display:none!important}}';
    d.head.appendChild(st);
    d.body.insertBefore(c, d.body.firstChild);

    /* ---------- shader ---------- */
    var VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    var FS = [
      'precision mediump float;',
      'uniform vec2 uR;uniform float uT,uK,uS;uniform vec3 uA,uB,uC;uniform vec4 uP[8];varying vec2 v;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}',
      'float fbm(vec2 p){float s=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){s+=a*n(p);p=m*p;a*=.5;}return s;}',
      'void main(){',
      '  float as=uR.x/uR.y;vec2 uv=v;',
      '  vec2 p=vec2(uv.x*as,uv.y+uS)*1.95;float t=uT*.024;',
      /* pointer trail: each point is a small vortex that also pushes outward */
      '  vec2 sw=vec2(0.);float gw=0.;',
      '  for(int i=0;i<8;i++){vec2 q=vec2((uv.x-uP[i].x)*as,uv.y-uP[i].y);float k=exp(-dot(q,q)*48.)*uP[i].z;sw+=vec2(-q.y,q.x)*k*3.2+q*k*.8;gw+=k;}',
      '  vec2 q=vec2(fbm(p+vec2(0.,t)+sw),fbm(p+vec2(5.2,1.3)-t*.8));',
      '  vec2 r=vec2(fbm(p+3.4*q+vec2(1.7,9.2)+t*.6+sw*1.6),fbm(p+3.4*q+vec2(8.3,2.8)-t*.5));',
      '  float f=fbm(p+3.*r);',
      '  vec3 col=mix(uA,uB,clamp(f*f*2.4,0.,1.));',
      '  col=mix(col,uC,clamp(length(r)-.55,0.,1.)*.55);',
      '  float a=smoothstep(.44,.98,f+gw*.20);',
      /* calmer in the reading column, fuller towards the edges */
      '  float e=smoothstep(.10,.62,abs(uv.x-.5));',
      '  a=min(a*uK*(.42+.58*e)*(1.+gw*.6),uK*1.25);',
      '  col+=uB*gw*.08;',
      '  gl_FragColor=vec4(col*a,a);',
      '}'
    ].join('\n');
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { c.remove(); return; }
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { c.remove(); return; }
    gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['uR', 'uT', 'uK', 'uS', 'uA', 'uB', 'uC', 'uP'].forEach(function (k) { U[k] = gl.getUniformLocation(pr, k); });
    gl.clearColor(0, 0, 0, 0);

    /* ---------- palette from the page's own tokens ---------- */
    function rgb(str) {
      var m = String(str).match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
      if (m) return [m[1] / 255, m[2] / 255, m[3] / 255];
      m = String(str).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (!m) return null;
      var x = m[1].length === 3 ? m[1].replace(/(.)/g, '$1$1') : m[1];
      return [parseInt(x.slice(0, 2), 16) / 255, parseInt(x.slice(2, 4), 16) / 255, parseInt(x.slice(4, 6), 16) / 255];
    }
    function token(names) { var cs = getComputedStyle(root); for (var i = 0; i < names.length; i++) { var v = rgb(cs.getPropertyValue(names[i])); if (v) return v; } return null; }
    function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
    function lum(c3) { return 0.2126 * c3[0] + 0.7152 * c3[1] + 0.0722 * c3[2]; }
    var P = { a: [0, 0, 0], b: [0, 0, 0], c: [0, 0, 0], k: 0 };
    var PT = { a: [0, 0, 0], b: [0, 0, 0], c: [0, 0, 0], k: 0 };
    var paletteReady = false;
    function copyPalette(to, from) {
      to.a = from.a.slice(); to.b = from.b.slice(); to.c = from.c.slice(); to.k = from.k;
    }
    function palette() {
      /* the background token switches instantly; the body colour itself may still be mid-transition */
      var bg = token(['--bg', '--paper', '--abyss']) || rgb(getComputedStyle(d.body).backgroundColor) || [1, 1, 1];
      var dark = lum(bg) < 0.4;
      var main = token(['--accent', '--petrol', '--gas']) || [0.04, 0.35, 0.38];
      var deep = token(['--accent-soft', '--petrol-deep']) || mix(main, dark ? [1, 1, 1] : [0, 0, 0], 0.18);
      var metal = token(['--gold', '--brass-metal', '--brass', '--flare']) || [0.78, 0.60, 0.33];

      PT.a = mix(main, bg, dark ? 0.72 : 0.76);
      PT.b = mix(deep, bg, dark ? 0.28 : 0.42);
      PT.c = mix(metal, bg, dark ? 0.36 : 0.35);
      PT.k = (dark ? 0.18 : 0.115) * (w.innerWidth < 700 ? 0.62 : 1);

      if (!paletteReady || reduce()) {
        copyPalette(P, PT);
        paletteReady = true;
      }
      if (paused) frame(performance.now(), true);
    }
    function blendPalette(dt) {
      var k = reduce() ? 1 : 1 - Math.exp(-Math.max(0, dt) * 4.8);
      var keys = ['a', 'b', 'c'];
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        for (var j = 0; j < 3; j++) P[key][j] += (PT[key][j] - P[key][j]) * k;
      }
      P.k += (PT.k - P.k) * k;
      gl.uniform3fv(U.uA, P.a); gl.uniform3fv(U.uB, P.b); gl.uniform3fv(U.uC, P.c); gl.uniform1f(U.uK, P.k);
    }

    /* ---------- size ---------- */
    function size() {
      var s = (w.innerWidth < 700 ? 0.28 : 0.34) * Math.min(1, w.devicePixelRatio || 1);
      var cw = Math.max(64, Math.round(w.innerWidth * s)), ch = Math.max(64, Math.round(w.innerHeight * s));
      if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; gl.viewport(0, 0, cw, ch); gl.uniform2f(U.uR, cw, ch); }
    }

    /* ---------- pointer trail + scroll drift ---------- */
    var trail = [], lastX = -1, lastY = -1, lastMove = 0, scrollS = 0, scrollT = 0;
    for (var i = 0; i < 8; i++) trail.push([0, 0, 0, 0]);
    var head = 0;
    function onMove(e) {
      if (reduce()) return;
      var x = e.clientX, y = e.clientY, now = performance.now();
      var dist = lastX < 0 ? 0 : Math.hypot(x - lastX, y - lastY);
      if (lastX >= 0 && dist < 18) return;
      var dt = Math.max(16, now - lastMove), speed = dist / dt;          /* px per ms */
      trail[head] = [x / w.innerWidth, 1 - y / w.innerHeight, Math.min(1, 0.35 + speed * 0.9), 0];
      head = (head + 1) % trail.length;
      lastX = x; lastY = y; lastMove = now;
      if (paused) resume();
    }
    w.addEventListener('pointermove', onMove, { passive: true });
    w.addEventListener('scroll', function () { scrollT = (w.scrollY || 0) / Math.max(1, w.innerHeight) * 0.12; lastMove = performance.now(); if (paused) resume(); }, { passive: true });

    /* ---------- loop ---------- */
    var t0 = performance.now(), last = 0, raf = 0, paused = false, shown = false;
    var flat = new Float32Array(32);
    function frame(now, force) {
      var dt = Math.min(0.1, (now - (last || now)) / 1000);
      blendPalette(dt);
      for (var k = 0; k < trail.length; k++) { trail[k][2] *= Math.pow(0.9, dt * 30); flat.set(trail[k], k * 4); }
      scrollS += (scrollT - scrollS) * Math.min(1, dt * 3);
      gl.uniform1f(U.uT, reduce() ? 40 : (now - t0) / 1000);
      gl.uniform1f(U.uS, scrollS);
      gl.uniform4fv(U.uP, flat);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      last = now;
      if (!shown) { shown = true; c.style.opacity = '1'; }
    }
    function loop(now) {
      raf = 0;
      if (paused) return;
      var active = now - lastMove < 8000;
      if (now - last >= (active ? 33 : 66)) frame(now);
      raf = requestAnimationFrame(loop);
    }
    function pause() { paused = true; if (raf) cancelAnimationFrame(raf); raf = 0; }
    function resume() { if (reduce() || d.hidden) return; paused = false; last = performance.now(); if (!raf) raf = requestAnimationFrame(loop); }
    d.addEventListener('visibilitychange', function () { d.hidden ? pause() : resume(); });
    if (mqReduce && mqReduce.addEventListener) mqReduce.addEventListener('change', function () { if (reduce()) { pause(); frame(performance.now(), true); } else resume(); });
    c.addEventListener('webglcontextlost', function (e) { e.preventDefault(); pause(); c.style.opacity = '0'; });

    /* re-read colours when the theme flips */
    var pt = 0;
    new MutationObserver(function () { palette(); clearTimeout(pt); pt = setTimeout(palette, 650); }).observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    w.addEventListener('resize', function () { size(); if (paused) frame(performance.now(), true); }, { passive: true });

    size(); palette();
    if (reduce()) { paused = true; frame(performance.now(), true); }
    else raf = requestAnimationFrame(loop);

    w.FxFlow = {
      off: function () { try { localStorage.setItem('fx', 'off'); } catch (e) {} pause(); c.remove(); },
      on: function () { try { localStorage.removeItem('fx'); } catch (e) {} location.reload(); },
      stats: function () { return { w: c.width, h: c.height, paused: paused, alpha: P.k, z: c.style.zIndex }; }
    };
  }
  /* start after the page has loaded and the browser is idle — the shader compile never competes with first paint */
  function later() { var idle = w.requestIdleCallback || function (f) { return setTimeout(f, 300); }; idle(start, { timeout: 2500 }); }
  if (d.readyState === 'complete') later(); else w.addEventListener('load', later);
})();
