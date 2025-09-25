import { Settings } from './config';
import { State } from './state';
import { computeSamples, setStride } from './samples';
import { ensureLayerCount, Layer } from './layers';
import { simulate } from './simulation';
import { applyContextLimits, updateContextChip } from './context';
import { initUI, syncControls } from './ui';
import { initInput } from './input';
import { draw } from './draw';
import { createPerlin } from './noise';
import { byId } from './utils';

function bindCanvas() {
  State.canvas = document.getElementById('c') as HTMLCanvasElement | null;
  State.ctx = (State.canvas ? State.canvas.getContext('2d') : null);
}

function resize() {
  if (!State.canvas || !State.ctx) return;
  State.dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const rect = State.canvas.getBoundingClientRect();
  State.W = Math.floor(rect.width);
  State.H = Math.floor(rect.height);
  State.canvas.width = Math.floor(State.W * State.dpr);
  State.canvas.height = Math.floor(State.H * State.dpr);
  State.ctx.setTransform(State.dpr, 0, 0, State.dpr, 0, 0);
  computeSamples();
  applyContextLimits();
}

function loop(now:number) {
  if (!Settings.system.paused) {
    const dt = Math.min(0.05, (now - State.last) / 1000);
    simulate(dt);
    draw();
    Settings.internal.rainbowShift = (Settings.internal.rainbowShift + 0.2) % 360;
  }
  const dtms = now - State.last;
  if (dtms > 0) State.fpsEMA = State.fpsEMA*0.9 + (1000 / dtms)*0.1;
  State.last = now;

  if (Settings.system.autoDetail) {
    const target = Settings.system.targetFPS;
    if (State.fpsEMA < target - 5 && State.stride < 16) setStride(State.stride + 1);
    else if (State.fpsEMA > target + 8 && State.stride > 4) setStride(State.stride - 1);
  }

  if (!State.lastFpsUpdate || now - State.lastFpsUpdate > 250) {
    const fpsChip = byId('fpsChip'); if (fpsChip) fpsChip.textContent = `FPS: ${Math.round(State.fpsEMA)}`;
    State.lastFpsUpdate = now;
  }
  updateContextChip(now);
  requestAnimationFrame(loop);
}

export function boot() {
  if (typeof window === 'undefined') return;
  bindCanvas();
  resize();
  for (let i=0; i<Settings.wave.count; i++) State.layers.push(new Layer(i));
  State.desiredWaveCount = Settings.wave.count;
  ensureLayerCount();
  State.perlin = createPerlin(Settings.turbulence.seed);
  initUI();
  initInput();
  State.ro = new ResizeObserver(() => resize());
  if (State.canvas) State.ro.observe(State.canvas);
  State.last = performance.now();
  applyContextLimits();
  syncControls();
  requestAnimationFrame(loop);
  window.addEventListener('resize', resize);

  // Hotkeys: Space pause, M menu, R randomize, C center pointer, S screenshot.
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return; // don't interfere with form inputs
    switch (e.key.toLowerCase()) {
      case ' ': // space
        e.preventDefault();
        Settings.system.paused = !Settings.system.paused;
        const pauseBtn = byId('pauseBtn'); if (pauseBtn) pauseBtn.textContent = Settings.system.paused ? 'Resume' : 'Pause';
        break;
      case 'm': {
        const panel = byId('panel'); if (panel) { panel.classList.toggle('collapsed'); setTimeout(()=>window.dispatchEvent(new Event('resize')), 60); }
        break; }
      case 'r': {
  import('./randomize').then(m => { m.randomizeSettings(); ensureLayerCount(); syncControls(); applyContextLimits(); });
        break; }
      case 'c': {
        State.pointer.x = State.W*0.5; State.pointer.y = State.H*0.5; State.pointer.sx = State.pointer.x; State.pointer.sy = State.pointer.y; break; }
      case 's': {
        if (State.canvas) {
          const url = State.canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url; a.download = `wave-playground-${Date.now()}.png`; a.click();
        }
        break; }
      default: break;
    }
  });
}
