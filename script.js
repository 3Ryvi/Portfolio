// Pixel dust behind the hero wordmark.
const hero = document.querySelector('.hero');
const canvas = document.querySelector('.stars');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const colors = ['#f6c4d4', '#e7a8bd', '#d4d4d4', '#8a6b76', '#ffffff'];
let width = 0;
let height = 0;
let particles = [];
let frame = 0;

function makeParticles() {
  const count = Math.min(150, Math.round((width * height) / 9000));

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() < 0.86 ? 1 : 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 0.15 + Math.random() * 0.6,
    vx: (Math.random() - 0.5) * 0.05,
    vy: 0.03 + Math.random() * 0.1,
    plus: Math.random() < 0.07
  }));
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = hero.clientWidth;
  height = hero.clientHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  makeParticles();
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.textBaseline = 'middle';

  for (const p of particles) {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;

    if (p.plus) {
      ctx.fillText('+', p.x, p.y);
    } else {
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
  }

  ctx.globalAlpha = 1;
}

function step() {
  // Keep the drawing surface matched to the hero even when the window never
  // fires a resize event (mobile toolbars, devtools viewport changes).
  if (hero.clientWidth !== width || hero.clientHeight !== height) {
    resize();
  }

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.y > height + 6) {
      p.y = -6;
      p.x = Math.random() * width;
    }
    if (p.x < -6) p.x = width + 6;
    if (p.x > width + 6) p.x = -6;
  }

  draw();
  frame = requestAnimationFrame(step);
}

function start() {
  cancelAnimationFrame(frame);
  resize();

  if (reduceMotion) {
    draw();
  } else {
    step();
  }
}

start();

if ('ResizeObserver' in window) {
  const observer = new ResizeObserver(start);
  observer.observe(hero);
}

window.addEventListener('resize', start);
