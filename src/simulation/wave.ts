import { Settings } from '../core/config';

export function effectiveMinGap() {
  const V = Settings.visual;
  const base = Settings.wave.minGap;
  if (!Settings.wave.autoMinGap) return base;
  const glowWidth = V.glowEnabled ? V.glow * 0.22 : 0;
  return base + V.lineWidth * 1.1 + glowWidth;
}



