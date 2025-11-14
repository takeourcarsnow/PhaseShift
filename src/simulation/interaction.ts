import { Settings } from '../core/config';
import { State } from '../core/state';

export function computeInteraction(x: number, y: number) {
  const It = Settings.interaction;
  if (It.mode === 'off') return 0;

  const dx = x - State.pointer.sx;
  const dy = y - State.pointer.sy;
  const dist = Math.hypot(dx, dy);
  const r = It.radius;
  if (dist >= r) return 0;

  const fall = 1 - (dist / r);
  const sI = It.strength * (State.pointer.down ? 1.0 : 0.7);
  let inter = 0;
  if (It.mode === 'push') inter += (dy / (dist + 1e-3)) * sI * fall * 160;
  else if (It.mode === 'pull') inter -= (dy / (dist + 1e-3)) * sI * fall * 160;
  else if (It.mode === 'gravity') inter -= Math.sign(dy) * sI * fall * 80;
  else if (It.mode === 'swirl') inter += (dx / (dist + 1e-3)) * sI * fall * 180;
  return inter;
}



