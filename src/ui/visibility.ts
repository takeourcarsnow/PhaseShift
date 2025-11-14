import { Settings } from '../core/config';
import { show, enable } from './utils';
import { byId } from '../core';
import { applyContextLimits } from '../core';

export function updateVisibility() {
  show('row_pulseDuty', Settings.wave.shape === 'pulse');
  const tt = Settings.turbulence.type;
  const turbOn = tt !== 'none';
  show('row_turbInt', turbOn);
  show('row_turbScale', turbOn);
  show('row_turbSpeed', turbOn);
  const needsSeed = (tt === 'noise' || tt === 'perlin' || tt === 'chaos');
  show('row_noiseSeed', needsSeed);
  show('row_reseed', needsSeed);
  const interOn = Settings.interaction.mode !== 'off';
  show('row_interStrength', interOn);
  show('row_interRadius', interOn);
  show('row_sepK', Settings.wave.count > 1);
  show('row_lineColor', Settings.visual.colorMode === 'custom');
  show('row_glow', Settings.visual.glowEnabled);
  show('row_glowColor', Settings.visual.glowEnabled);
  show('row_plex', Settings.visual.plexEnabled);
  enable('detail', !Settings.system.autoDetail);
  applyContextLimits();
}

export function updateFullscreenBtn() {
  const btn = byId('fullscreenBtn');
  if (!btn) return;
  btn.title = (document.fullscreenElement || (document as any).webkitFullscreenElement) ? 'Exit Fullscreen' : 'Fullscreen';
}

export function isFullscreen() {
  return !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
}

export function requestFullscreen(elem: HTMLElement) {
  const anyElem: any = elem as any;
  if (anyElem.requestFullscreen) return anyElem.requestFullscreen();
  if (anyElem.webkitRequestFullscreen) return anyElem.webkitRequestFullscreen();
  if (anyElem.msRequestFullscreen) return anyElem.msRequestFullscreen();
}

export function exitFullscreen() {
  const doc: any = document as any;
  if (doc.exitFullscreen) return doc.exitFullscreen();
  if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen();
  if (doc.msExitFullscreen) return doc.msExitFullscreen();
}



