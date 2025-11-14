import { Settings } from '../core/config';
import { State } from '../core/state';
import { ensureLayerCount, Layer } from '../core';
import { initUI, syncControls } from '../ui';
import { initInput } from '../core';
import { createPerlin } from '../core';
import { applyContextLimits } from '../core';
import { bindCanvas, resize } from './canvas';
import { loop } from './loop';
import { setupHotkeys } from './hotkeys';

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
  setupHotkeys();
}





