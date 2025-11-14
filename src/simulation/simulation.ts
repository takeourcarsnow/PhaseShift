import { Settings } from '../core/config';
import { State } from '../core/state';
import { DEG, lerp } from '../core';
import { turbulenceOffset } from '../core';
import { computeWaveShape, computePhysics } from './physics';
import { computeInteraction } from './interaction';
import { applyLayerSeparation } from './separation';

const fixedDt = 1/60;

export function simulate(dt:number) {
  State.accumulator += dt;
  while (State.accumulator >= fixedDt) {
    step(fixedDt);
    State.accumulator -= fixedDt;
    State.time += fixedDt;
  }
}

function step(dt:number) {
  const Wv = Settings.wave, Tb = Settings.turbulence;

  State.pointer.sx = lerp(State.pointer.sx, State.pointer.x, 0.35);
  State.pointer.sy = lerp(State.pointer.sy, State.pointer.y, 0.35);

  for (let i=0; i<State.layers.length; i++) State.layers[i].updateBaseline(State.desiredWaveCount, i);

  const s = Tb.scale;
  for (let i=0; i<State.sampleCount; i++) State.preXScaled[i] = State.xCoords[i] * s;

  const dir = (Wv.direction === 'left') ? -1 : 1;
  const timePhase = dir * State.time * Wv.speed;
  const ang = Wv.flowAngleDeg * DEG;
  const cosA = Math.cos(ang), sinA = Math.sin(ang);
  const freq = Math.max(0.0001, Wv.frequency);
  const duty = Wv.pulseDuty; // clamp is in computeWaveShape

  for (let L=0; L<State.layers.length; L++) {
    const layer = State.layers[L];
    const yArr = layer.points, vArr = layer.vel;
    const base = layer.baseY;
    const baseNorm = base / State.H;
    const uLayer = baseNorm * sinA;
    const amp = Wv.amplitude;

    for (let i=0; i<State.sampleCount; i++) {
      const x = State.xCoords[i];
      const u = State.xNorms[i] * cosA + uLayer;
      const shapeVal = computeWaveShape(u, timePhase, freq, duty);
      const targetY = base + shapeVal * amp;
      const turb = turbulenceOffset(Tb.type, State.preXScaled[i], yArr[i], State.time);
      const inter = computeInteraction(x, yArr[i]);

      const y = yArr[i], v = vArr[i];
      const left = i>0 ? yArr[i-1] : yArr[i];
      const right = i<State.sampleCount-1 ? yArr[i+1] : yArr[i];

      const { ny, nv } = computePhysics(y, targetY, turb, inter, left, right, v, dt);

      vArr[i] = nv;
      yArr[i] = ny;
    }
  }

  // Compute average velocity for each layer
  for (let L = 0; L < State.layers.length; L++) {
    const layer = State.layers[L];
    let sum = 0;
    for (let i = 0; i < State.sampleCount; i++) sum += Math.abs(layer.vel[i]);
    layer.avgVel = sum / State.sampleCount;
  }

  applyLayerSeparation();
}

export { effectiveMinGap } from './wave';




