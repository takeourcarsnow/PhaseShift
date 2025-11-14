import { State } from '../core/state';
import { computeSamples, setStride } from '../core/samples';
import { applyContextLimits } from '../core/context';

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

export { bindCanvas, resize };




