import { Settings } from '../core/config';
import { State } from '../core/state';
import { effectiveMinGap } from './wave';

export function applyLayerSeparation() {
  if (State.layers.length <= 1) return;

  const gap = effectiveMinGap();
  const sepK = Settings.physics.sepK;
  let maxViol: number, pass = 0;
  const maxPass = 6;
  do {
    maxViol = 0;
    for (let dir = 0; dir < 2; dir++) {
      for (let i = 0; i < State.sampleCount; i++) {
        for (let L = 0; L < State.layers.length - 1; L++) {
          const A = State.layers[L], B = State.layers[L + 1];
          const diff = (B.points[i] - A.points[i]) - gap;
          if (diff < 0) {
            const push = -diff * 0.5;
            A.points[i] -= push;
            B.points[i] += push;
            A.vel[i] -= push * sepK;
            B.vel[i] += push * sepK;
            if (-diff > maxViol) maxViol = -diff;
          }
        }
      }
    }
    pass++;
  } while (maxViol > 0.5 && pass < maxPass);
}



