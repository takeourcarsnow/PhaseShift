import { Settings, SettingsShape } from '../core/config';
import { State } from '../core/state';
import { ensureLayerCount } from '../core/layers';
import { setStride } from '../core/samples';
import { applyContextLimits } from '../core/context';

export function currentPresetObject() {
  return JSON.parse(JSON.stringify(Settings));
}

export function applyPreset(p:Partial<SettingsShape>, perlin:any) {
  Object.assign(Settings.wave, p.wave || {});
  State.desiredWaveCount = Math.round(Settings.wave.count);
  Object.assign(Settings.turbulence, p.turbulence || {});
  Object.assign(Settings.interaction, p.interaction || {});
  Object.assign(Settings.physics, p.physics || {});
  Object.assign(Settings.visual, p.visual || {});
  Object.assign(Settings.system, p.system || {});
  ensureLayerCount();
  if (typeof Settings.turbulence.seed === 'number' && perlin) perlin.reseed(Settings.turbulence.seed);
  setStride(Settings.system.detail);
  applyContextLimits();
}




