import { Settings } from '../core/config';
import { State } from '../core/state';
import { TAU, clamp } from '../core';

export function computeWaveShape(u: number, timePhase: number, freq: number, duty: number) {
  const p = ((freq * u + timePhase) % 1 + 1) % 1; // frac equivalent
  const sinv = Math.sin(TAU * p);

  let shapeVal = 0;
  switch (Settings.wave.shape) {
    case 'sine': shapeVal = sinv; break;
    case 'triangle': shapeVal = 2 * Math.abs(2 * (p - Math.floor(p + 0.5))) - 1; break;
    case 'square': {
      const xx = sinv * 6.0;
      shapeVal = xx * (27 + xx * xx) / (27 + 9 * xx * xx);
      break;
    }
    case 'saw': shapeVal = 2 * (p - Math.floor(p + 0.5)); break;
    case 'pulse': {
      let v = (p < duty) ? 1 : -1;
      const blend = sinv * 0.5 + 0.5;
      v = (1 - 0.15) * v + 0.15 * sinv; // lerp(v, sinv, 0.15)
      shapeVal = v * (0.8 + 0.2 * blend);
      break;
    }
    default: shapeVal = sinv;
  }
  return shapeVal;
}

export function computePhysics(y: number, targetY: number, turb: number, inter: number, left: number, right: number, v: number, dt: number) {
  const Ph = Settings.physics;
  const nb = Ph.neighbor, k = Ph.spring, c = Ph.damping;

  const lap = left - 2 * y + right;
  const a = ((targetY + turb + inter) - y) * k + lap * nb - v * c;

  const nv = v + a * dt;
  let ny = y + nv * dt;

  if (Ph.keepInside) {
    const m = 6;
    if (ny < m) {
      ny = m;
      // Note: vArr[i] *= 0.5; but since nv is local, return adjusted
      return { ny, nv: nv * 0.5 };
    } else if (ny > State.H - m) {
      ny = State.H - m;
      return { ny, nv: nv * 0.5 };
    }
  }

  return { ny, nv };
}



