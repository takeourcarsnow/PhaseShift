import { Settings } from '../core/config';
import { State } from '../core/state';
import { setText, show } from './utils';
import { byId } from '../core';
import { updateVisibility } from './visibility';
import { updateContextChip } from '../core';

export function syncControls() {
  const pairs: [string, any][] = [
    ['v_waveCount', Settings.wave.count],
    ['v_amplitude', Settings.wave.amplitude],
    ['v_frequency', Settings.wave.frequency.toFixed(2)],
    ['v_speed', Settings.wave.speed.toFixed(2)],
    ['v_minGap', Settings.wave.minGap],
    ['v_spread', `${Math.round(Settings.wave.spread * 100)}%`],
    ['v_bandCenter', `${Math.round(Settings.wave.bandCenter * 100)}%`],
    ['v_duty', Settings.wave.pulseDuty.toFixed(2)],
    ['v_flowAngle', `${Settings.wave.flowAngleDeg}°`],
    ['v_tiltDeg', `${Settings.wave.tiltDeg}°`],
    ['v_turbInt', Settings.turbulence.intensity.toFixed(2)],
    ['v_turbScale', Settings.turbulence.scale.toFixed(4)],
    ['v_turbSpeed', Settings.turbulence.speed.toFixed(2)],
    ['v_interStrength', Settings.interaction.strength.toFixed(2)],
    ['v_interRadius', Settings.interaction.radius.toFixed(0)],
    ['v_spring', Settings.physics.spring.toFixed(0)],
    ['v_neighbor', Settings.physics.neighbor.toFixed(0)],
    ['v_damping', Settings.physics.damping.toFixed(1)],
    ['v_sepK', Settings.physics.sepK.toFixed(2)],
    ['v_lineWidth', Settings.visual.lineWidth.toFixed(1)],
    ['v_glow', Settings.visual.glow.toFixed(0)],
    ['v_plex', Settings.visual.plex.toFixed(2)],
    ['v_detail', State.stride]
  ];
  for (const [id, val] of pairs) setText(id, val);
  const sync = (id: string, v: any) => {
    const el = byId(id) as any;
    if (!el) return;
    if (el.type === 'checkbox') el.checked = !!v;
    else el.value = v;
  };
  sync('waveCount', Settings.wave.count);
  sync('amplitude', Settings.wave.amplitude);
  sync('autoAmplitude', Settings.wave.autoAmplitude);
  sync('frequency', Settings.wave.frequency);
  sync('speed', Settings.wave.speed);
  sync('minGap', Settings.wave.minGap);
  sync('autoMinGap', Settings.wave.autoMinGap);
  sync('spread', Settings.wave.spread);
  sync('bandCenter', Settings.wave.bandCenter);
  sync('shape', Settings.wave.shape);
  sync('pulseDuty', Settings.wave.pulseDuty);
  sync('direction', Settings.wave.direction);
  sync('flowAngle', Settings.wave.flowAngleDeg);
  sync('tiltDeg', Settings.wave.tiltDeg);
  sync('turbType', Settings.turbulence.type);
  sync('turbInt', Settings.turbulence.intensity);
  sync('turbScale', Settings.turbulence.scale);
  sync('turbSpeed', Settings.turbulence.speed);
  const seedEl = byId<HTMLInputElement>('noiseSeed');
  if (seedEl) seedEl.value = String(Settings.turbulence.seed);
  sync('interMode', Settings.interaction.mode);
  sync('interStrength', Settings.interaction.strength);
  sync('interRadius', Settings.interaction.radius);
  sync('autoInterRadius', Settings.interaction.autoRadius);
  sync('spring', Settings.physics.spring);
  sync('neighbor', Settings.physics.neighbor);
  sync('damping', Settings.physics.damping);
  sync('sepK', Settings.physics.sepK);
  sync('keepInside', Settings.physics.keepInside);
  sync('lineWidth', Settings.visual.lineWidth);
  sync('lineStyle', Settings.visual.lineStyle);
  sync('colorMode', Settings.visual.colorMode);
  sync('lineColor', Settings.visual.lineColor);
  sync('bgColor', Settings.visual.bgColor);
  sync('glowEnabled', Settings.visual.glowEnabled);
  sync('glow', Settings.visual.glow);
  sync('glowColor', Settings.visual.glowColor);
  sync('blendMode', Settings.visual.blendMode);
  sync('plexEnabled', Settings.visual.plexEnabled);
  sync('plex', Settings.visual.plex);
  sync('detail', State.stride);
  sync('autoDetail', Settings.system.autoDetail);
  const pauseBtn = byId('pauseBtn');
  if (pauseBtn) pauseBtn.title = Settings.system.paused ? 'Resume' : 'Pause';
  setText('ampHint', `Safe amplitude ≤ ${Settings.internal.amplitudeCap}px`);
  updateVisibility();
  updateContextChip();
}



