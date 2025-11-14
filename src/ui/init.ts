import { Settings } from '../core/config';
import { State } from '../core/state';
import { randomizeSettings } from '../core';
import { setStride } from '../core';
import { ensureLayerCount } from '../core';
import { applyContextLimits } from '../core';
import { byId } from '../core';
import { bindRange, bindSelect, bindCheck, bindColor } from './bindings';
import { initPresetsUI } from './presets';
import { updateFullscreenBtn, isFullscreen, requestFullscreen, exitFullscreen, updateVisibility } from './visibility';
import { syncControls } from './sync';

export function initUI() {
  bindRange('waveCount', Settings.wave, 'count', (v) => v.toFixed(0));
  bindRange('amplitude', Settings.wave, 'amplitude', (v) => v.toFixed(0));
  bindCheck('autoAmplitude', Settings.wave, 'autoAmplitude');
  bindRange('frequency', Settings.wave, 'frequency', (v) => v.toFixed(2));
  bindRange('speed', Settings.wave, 'speed', (v) => v.toFixed(2));
  bindRange('minGap', Settings.wave, 'minGap', (v) => v.toFixed(0));
  bindCheck('autoMinGap', Settings.wave, 'autoMinGap');
  bindRange('spread', Settings.wave, 'spread', (v) => `${Math.round(v * 100)}%`);
  bindRange('bandCenter', Settings.wave, 'bandCenter', (v) => `${Math.round(v * 100)}%`);
  bindSelect('shape', Settings.wave, 'shape');
  bindRange('pulseDuty', Settings.wave, 'pulseDuty', (v) => v.toFixed(2));
  bindSelect('direction', Settings.wave, 'direction');
  bindRange('flowAngle', Settings.wave, 'flowAngleDeg', (v) => `${v}°`);
  bindRange('tiltDeg', Settings.wave, 'tiltDeg', (v) => `${v}°`);
  bindSelect('turbType', Settings.turbulence, 'type');
  bindRange('turbInt', Settings.turbulence, 'intensity', (v) => v.toFixed(2));
  bindRange('turbScale', Settings.turbulence, 'scale', (v) => Number(v).toFixed(4));
  bindRange('turbSpeed', Settings.turbulence, 'speed', (v) => v.toFixed(2));
  const seedEl = byId<HTMLInputElement>('noiseSeed');
  if (seedEl) seedEl.value = String(Settings.turbulence.seed);
  const reseedBtn = byId('reseed');
  if (reseedBtn) reseedBtn.onclick = () => {
    const val = parseInt(seedEl?.value || '0', 10);
    Settings.turbulence.seed = (isFinite(val) ? val : ((Math.random() * 1e9) | 0));
    State.perlin.reseed(Settings.turbulence.seed);
  };
  bindSelect('interMode', Settings.interaction, 'mode');
  bindRange('interStrength', Settings.interaction, 'strength', (v) => v.toFixed(2));
  bindRange('interRadius', Settings.interaction, 'radius', (v) => v.toFixed(0));
  bindCheck('autoInterRadius', Settings.interaction, 'autoRadius');
  bindRange('spring', Settings.physics, 'spring', (v) => v.toFixed(0));
  bindRange('neighbor', Settings.physics, 'neighbor', (v) => v.toFixed(0));
  bindRange('damping', Settings.physics, 'damping', (v) => v.toFixed(1));
  bindRange('sepK', Settings.physics, 'sepK', (v) => v.toFixed(2));
  bindCheck('keepInside', Settings.physics, 'keepInside');
  bindRange('lineWidth', Settings.visual, 'lineWidth', (v) => v.toFixed(1));
  bindSelect('lineStyle', Settings.visual, 'lineStyle');
  bindSelect('colorMode', Settings.visual, 'colorMode');
  bindColor('lineColor', Settings.visual, 'lineColor');
  bindColor('bgColor', Settings.visual, 'bgColor');
  bindSelect('blendMode', Settings.visual, 'blendMode');
  bindCheck('glowEnabled', Settings.visual, 'glowEnabled');
  bindRange('glow', Settings.visual, 'glow', (v) => v.toFixed(0));
  bindColor('glowColor', Settings.visual, 'glowColor');
  bindCheck('plexEnabled', Settings.visual, 'plexEnabled');
  bindRange('plex', Settings.visual, 'plex', (v) => v.toFixed(2));
  bindRange('detail', Settings.system, 'detail', (v) => v.toFixed(0));
  bindCheck('autoDetail', Settings.system, 'autoDetail');
  const toggleBtn = byId('togglePanel');
  if (toggleBtn) toggleBtn.onclick = () => {
    byId('panel')?.classList.toggle('collapsed');
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  };
  const pauseBtn = byId('pauseBtn');
  if (pauseBtn) pauseBtn.onclick = () => {
    Settings.system.paused = !Settings.system.paused;
    pauseBtn.title = Settings.system.paused ? 'Resume' : 'Pause';
  };
  const randBtn = byId('randomize');
  if (randBtn) randBtn.onclick = () => {
    randomizeSettings();
    if (Settings.system.autoDetail) setStride(State.stride);
    ensureLayerCount();
    syncControls();
    applyContextLimits();
  };
  const resetBtn = byId('resetCam');
  if (resetBtn) resetBtn.onclick = () => {
    State.pointer.x = State.W * 0.5;
    State.pointer.y = State.H * 0.5;
    State.pointer.sx = State.pointer.x;
    State.pointer.sy = State.pointer.y;
  };
  const fullBtn = byId('fullscreenBtn');
  if (fullBtn) fullBtn.onclick = () => {
    if (!isFullscreen()) requestFullscreen(document.documentElement);
    else exitFullscreen();
  };
  document.addEventListener('fullscreenchange', updateFullscreenBtn);
  document.addEventListener('webkitfullscreenchange', updateFullscreenBtn as any);
  updateFullscreenBtn();
  initPresetsUI();
  syncControls();
  updateVisibility();
  applyContextLimits();
}



