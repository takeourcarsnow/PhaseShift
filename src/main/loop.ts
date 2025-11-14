import { Settings } from '../core/config';
import { State } from '../core/state';
import { setStride } from '../core/samples';
import { simulate } from '../simulation';
import { draw } from '../core/draw';
import { byId } from '../core/utils';
import { updateContextChip } from '../core/context';

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
    const fpsChip = byId('fpsChip'); if (fpsChip) fpsChip.title = `FPS: ${Math.round(State.fpsEMA)}`;
    State.lastFpsUpdate = now;
  }
  updateContextChip(now);
  requestAnimationFrame(loop);
}

export { loop };




