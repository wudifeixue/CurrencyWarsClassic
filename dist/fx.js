// Presentation helpers: DOM patching that keeps nodes alive between renders, plus
// cosmetic motion (FLIP moves, flying clones, floating numbers, bursts). Nothing here
// changes game state; every effect is safe to skip.

export const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const keyOf = node => node.nodeType === 1 ? (node.getAttribute('data-key') || node.id || null) : null;

function syncAttributes(from, to) {
  for (const { name } of [...from.attributes]) if (!to.hasAttribute(name)) from.removeAttribute(name);
  for (const { name, value } of [...to.attributes]) if (from.getAttribute(name) !== value) from.setAttribute(name, value);
  if (from.tagName === 'INPUT' && from !== document.activeElement && from.value !== to.value) from.value = to.value ?? '';
  if (from.tagName === 'BUTTON' || from.tagName === 'INPUT') from.disabled = to.hasAttribute('disabled');
}

function patchNode(from, to) {
  if (from.nodeType === 3 || from.nodeType === 8) { if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue; return; }
  syncAttributes(from, to);
  patchChildren(from, to);
}

function sameKind(a, b) { return a.nodeType === b.nodeType && a.nodeName === b.nodeName; }

function patchChildren(from, to) {
  const next = [...to.childNodes];
  const keyed = new Map();
  const loose = [];
  for (const node of from.childNodes) { const key = keyOf(node); if (key) keyed.set(key, node); else loose.push(node); }
  let cursor = 0;
  next.forEach((node, index) => {
    const key = keyOf(node);
    let match = null;
    if (key) {
      const candidate = keyed.get(key);
      if (candidate && sameKind(candidate, node)) { match = candidate; keyed.delete(key); }
    } else {
      for (let look = cursor; look < Math.min(loose.length, cursor + 4); look++) {
        if (sameKind(loose[look], node)) { match = loose[look]; cursor = look + 1; break; }
      }
    }
    if (match) patchNode(match, node); else match = node;
    const current = from.childNodes[index];
    if (current !== match) from.insertBefore(match, current || null);
  });
  while (from.childNodes.length > next.length) from.lastChild.remove();
}

// Replace the children of `target` with `html` while reusing matching nodes.
export function morph(target, html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  patchChildren(target, template.content);
}

export function rectMap(root, selector, attribute) {
  const map = new Map();
  root.querySelectorAll(selector).forEach(el => map.set(el.getAttribute(attribute), el.getBoundingClientRect()));
  return map;
}

// FLIP: animate elements from the rect they had before a render to where they are now.
export function flip(root, selector, attribute, before, { scale = 1, duration = 280, skip = new Set() } = {}) {
  if (reducedMotion()) return;
  root.querySelectorAll(selector).forEach(el => {
    const key = el.getAttribute(attribute);
    const old = before.get(key);
    if (!old || skip.has(key)) return;
    const now = el.getBoundingClientRect();
    const dx = (old.left - now.left) / scale, dy = (old.top - now.top) / scale;
    const sx = old.width / (now.width || 1), sy = old.height / (now.height || 1);
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < .02) return;
    el.animate([
      { transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`, transformOrigin: 'top left', zIndex: 20 },
      { transform: 'none', transformOrigin: 'top left', zIndex: 20 },
    ], { duration, easing: 'cubic-bezier(.2,.8,.25,1)' });
  });
}

// A fixed-position copy that travels between two screen rects.
export function fly(from, to, { html = '', className = '', duration = 420, delay = 0, endScale = 1, fade = false, arc = 0 } = {}) {
  if (reducedMotion() || !from || !to) return Promise.resolve();
  const ghost = document.createElement('div');
  ghost.className = `fx-fly ${className}`;
  ghost.innerHTML = html;
  Object.assign(ghost.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
  document.body.append(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const sx = to.width / from.width * endScale, sy = to.height / from.height * endScale;
  const animation = ghost.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * .5}px,${dy * .5 - arc}px) scale(${(1 + sx) / 2 * 1.06},${(1 + sy) / 2 * 1.06})`, opacity: 1, offset: .55 },
    { transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})`, opacity: fade ? 0 : 1 },
  ], { duration, delay, easing: 'cubic-bezier(.45,.05,.3,1)', fill: 'both' });
  return animation.finished.catch(() => {}).then(() => ghost.remove());
}

export function floatText(anchor, text, { className = '', rise = 46, duration = 1100, scale = 1 } = {}) {
  if (!anchor || !text) return;
  const rect = anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : anchor;
  const el = document.createElement('div');
  el.className = `fx-float ${className}`;
  el.textContent = text;
  el.style.left = `${rect.left + rect.width / 2}px`;
  el.style.top = `${rect.top + rect.height / 2}px`;
  el.style.fontSize = `${Math.max(14, 30 * scale)}px`;
  document.body.append(el);
  if (reducedMotion()) { setTimeout(() => el.remove(), 700); return; }
  el.animate([
    { transform: 'translate(-50%,-30%) scale(.6)', opacity: 0 },
    { transform: 'translate(-50%,-60%) scale(1.15)', opacity: 1, offset: .18 },
    { transform: `translate(-50%,calc(-60% - ${rise * scale}px)) scale(1)`, opacity: 0 },
  ], { duration, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' }).finished.catch(() => {}).then(() => el.remove());
}

export function burst(anchor, { color = '#ffe08a', count = 12, distance = 70, size = 9, scale = 1 } = {}) {
  if (reducedMotion() || !anchor) return;
  const rect = anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : anchor;
  const host = document.createElement('div');
  host.className = 'fx-burst';
  host.style.left = `${rect.left + rect.width / 2}px`;
  host.style.top = `${rect.top + rect.height / 2}px`;
  host.style.setProperty('--fx-color', color);
  const ring = document.createElement('i');
  ring.className = 'fx-ring';
  host.append(ring);
  const ringSize = Math.max(rect.width, rect.height);
  ring.style.width = ring.style.height = `${ringSize}px`;
  ring.animate([{ transform: 'translate(-50%,-50%) scale(.4)', opacity: .95 }, { transform: 'translate(-50%,-50%) scale(1.45)', opacity: 0 }], { duration: 650, easing: 'ease-out', fill: 'both' });
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('b');
    const angle = (i / count) * Math.PI * 2 + Math.random() * .4;
    const d = (distance * (.7 + Math.random() * .6)) * scale;
    spark.style.width = spark.style.height = `${size * scale}px`;
    host.append(spark);
    spark.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle) * d}px),calc(-50% + ${Math.sin(angle) * d}px)) scale(.2)`, opacity: 0 },
    ], { duration: 560 + Math.random() * 260, easing: 'cubic-bezier(.15,.7,.3,1)', fill: 'both' });
  }
  document.body.append(host);
  setTimeout(() => host.remove(), 950);
}

export function pulse(el, { scale = 1.12, duration = 420, glow = '' } = {}) {
  if (reducedMotion() || !el) return;
  const frames = [{ transform: 'scale(1)' }, { transform: `scale(${scale})`, offset: .35 }, { transform: 'scale(1)' }];
  if (glow) { frames[0].filter = 'brightness(1)'; frames[1].filter = `brightness(1.5) drop-shadow(0 0 12px ${glow})`; frames[2].filter = 'brightness(1)'; }
  el.animate(frames, { duration, easing: 'cubic-bezier(.3,.7,.3,1.3)' });
}

export function shake(el) {
  if (reducedMotion() || !el) return;
  el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' }], { duration: 360, easing: 'ease-out' });
}

export function tweenNumber(el, from, to, { duration = 520 } = {}) {
  if (!el || from === to) return;
  if (reducedMotion()) { el.textContent = String(to); return; }
  const start = performance.now();
  const token = Symbol('tween');
  el._tween = token;
  const step = now => {
    if (el._tween !== token) return;
    const t = Math.min(1, (now - start) / duration), eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Staggered entrance for freshly rendered groups (shop rolls, choice cards).
export function stagger(elements, keyframes, { duration = 360, gap = 55, easing = 'cubic-bezier(.2,.8,.25,1)' } = {}) {
  if (reducedMotion()) return;
  [...elements].forEach((el, i) => el.animate(keyframes, { duration, delay: i * gap, easing, fill: 'backwards' }));
}
