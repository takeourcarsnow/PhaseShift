import { Settings } from './config';
import { State } from './state';
import { byId } from './utils';
import { setStride } from './samples';
import { ensureLayerCount } from './layers';
import { applyContextLimits, updateContextChip } from './context';
import { randomizeSettings } from './randomize';
import { loadPresets, savePresets, defaultPresets, applyPreset, currentPresetObject, PRESET_KEY } from './presets';

const setText = (id:string, val:any) => { const el = byId(id); if (el) el.textContent = String(val); };
const show = (id:string, on:boolean) => { const el = byId(id); if (!el) return; el.classList.toggle('hidden', !on); };
const enable = (id:string, on:boolean) => { const el = byId<HTMLInputElement>(id); if (!el) return; el.disabled = !on; };

function bindRange(id:string, obj:any, key:string, fmt:(v:any)=>any=(v)=>v) {
  const el = byId<HTMLInputElement>(id); const label = byId('v_'+key) || byId('v_'+id);
  if (!el) return;
  el.value = String(obj[key]);
  if (label) label.textContent = fmt(obj[key]);
  el.oninput = () => {
    obj[key] = parseFloat(el.value);
    if (label) label.textContent = fmt(obj[key]);
    if (key === 'count') { State.desiredWaveCount = Math.round(obj[key]); ensureLayerCount(); applyContextLimits(); }
    if (key === 'pulseDuty') setText('v_duty', obj[key].toFixed(2));
    if (id === 'detail') setStride(obj[key]);
    applyContextLimits();
    updateVisibility();
  };
}
function bindSelect(id:string, obj:any, key:string) {
  const el = byId<HTMLSelectElement>(id); if (!el) return;
  el.value = String(obj[key]);
  el.onchange = () => { obj[key] = el.value; applyContextLimits(); updateVisibility(); };
}
function bindCheck(id:string, obj:any, key:string) {
  const el = byId<HTMLInputElement>(id); if (!el) return;
  el.checked = !!obj[key];
  el.oninput = () => { obj[key] = !!el.checked; applyContextLimits(); updateVisibility(); };
}
function bindColor(id:string, obj:any, key:string) {
  const el = byId<HTMLInputElement>(id); if (!el) return;
  el.value = obj[key];
  el.oninput = () => { obj[key] = el.value; };
}

function updateVisibility() {
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

function updateFullscreenBtn() {
  const btn = byId('fullscreenBtn');
  if (!btn) return;
  btn.textContent = (document.fullscreenElement || (document as any).webkitFullscreenElement) ? 'Exit Fullscreen' : 'Fullscreen';
}
function isFullscreen() { return !!(document.fullscreenElement || (document as any).webkitFullscreenElement); }
function requestFullscreen(elem:HTMLElement) {
  const anyElem:any = elem as any;
  if (anyElem.requestFullscreen) return anyElem.requestFullscreen();
  if (anyElem.webkitRequestFullscreen) return anyElem.webkitRequestFullscreen();
  if (anyElem.msRequestFullscreen) return anyElem.msRequestFullscreen();
}
function exitFullscreen() {
  const doc:any = document as any;
  if (doc.exitFullscreen) return doc.exitFullscreen();
  if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen();
  if (doc.msExitFullscreen) return doc.msExitFullscreen();
}

function initPresetsUI() {
  const presetSelect = byId<HTMLSelectElement>('presetSelect');
  const presetName = byId<HTMLInputElement>('presetName');
  if (!presetSelect || !presetName) return;
  const all = loadPresets();
  presetSelect.innerHTML = '';
  Object.keys(all).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name; opt.textContent = name; presetSelect.appendChild(opt);
  });
  presetSelect.onchange = () => { applyPreset(all[presetSelect.value] as any, State.perlin); syncControls(); };
  const saveBtn = byId('savePreset'); if (saveBtn) saveBtn.onclick = () => {
    const name = (presetName.value || '').trim() || 'My preset';
    all[name] = currentPresetObject() as any;
    savePresets(all);
    initPresetsUI();
    presetSelect.value = name;
  };
  const delBtn = byId('deletePreset'); if (delBtn) delBtn.onclick = () => {
    const name = presetSelect.value;
    if (defaultPresets[name]) return;
    delete (all as any)[name]; savePresets(all); initPresetsUI();
  };
  const expBtn = byId('exportPreset'); if (expBtn) expBtn.onclick = () => {
    const json = JSON.stringify(currentPresetObject(), null, 2);
    navigator.clipboard?.writeText(json).catch(()=>{});
    alert('Current settings copied to clipboard as JSON.');
  };
  const impBtn = byId('importPreset'); if (impBtn) impBtn.onclick = async () => {
    const text = prompt('Paste preset JSON:');
    if (!text) return;
    try { const obj = JSON.parse(text); applyPreset(obj, State.perlin); syncControls(); } catch { alert('Invalid JSON'); }
  };
}

export function initUI() {
  bindRange('waveCount', Settings.wave, 'count', (v)=>v.toFixed(0));
  bindRange('amplitude', Settings.wave, 'amplitude', (v)=>v.toFixed(0));
  bindCheck('autoAmplitude', Settings.wave, 'autoAmplitude');
  bindRange('frequency', Settings.wave, 'frequency', (v)=>v.toFixed(2));
  bindRange('speed', Settings.wave, 'speed', (v)=>v.toFixed(2));
  bindRange('minGap', Settings.wave, 'minGap', (v)=>v.toFixed(0));
  bindCheck('autoMinGap', Settings.wave, 'autoMinGap');
  bindRange('spread', Settings.wave, 'spread', (v)=>`${Math.round(v*100)}%`);
  bindRange('bandCenter', Settings.wave, 'bandCenter', (v)=>`${Math.round(v*100)}%`);
  bindSelect('shape', Settings.wave, 'shape');
  bindRange('pulseDuty', Settings.wave, 'pulseDuty', (v)=>v.toFixed(2));
  bindSelect('direction', Settings.wave, 'direction');
  bindRange('flowAngle', Settings.wave, 'flowAngleDeg', (v)=>`${v}°`);
  bindRange('tiltDeg', Settings.wave, 'tiltDeg', (v)=>`${v}°`);
  bindSelect('turbType', Settings.turbulence, 'type');
  bindRange('turbInt', Settings.turbulence, 'intensity', (v)=>v.toFixed(2));
  bindRange('turbScale', Settings.turbulence, 'scale', (v)=>Number(v).toFixed(4));
  bindRange('turbSpeed', Settings.turbulence, 'speed', (v)=>v.toFixed(2));
  const seedEl = byId<HTMLInputElement>('noiseSeed'); if (seedEl) seedEl.value = String(Settings.turbulence.seed);
  const reseedBtn = byId('reseed'); if (reseedBtn) reseedBtn.onclick = () => {
    const val = parseInt(seedEl?.value || '0', 10);
    Settings.turbulence.seed = (isFinite(val) ? val : ((Math.random()*1e9)|0));
    State.perlin.reseed(Settings.turbulence.seed);
  };
  bindSelect('interMode', Settings.interaction, 'mode');
  bindRange('interStrength', Settings.interaction, 'strength', (v)=>v.toFixed(2));
  bindRange('interRadius', Settings.interaction, 'radius', (v)=>v.toFixed(0));
  bindCheck('autoInterRadius', Settings.interaction, 'autoRadius');
  bindRange('spring', Settings.physics, 'spring', (v)=>v.toFixed(0));
  bindRange('neighbor', Settings.physics, 'neighbor', (v)=>v.toFixed(0));
  bindRange('damping', Settings.physics, 'damping', (v)=>v.toFixed(1));
  bindRange('sepK', Settings.physics, 'sepK', (v)=>v.toFixed(2));
  bindCheck('keepInside', Settings.physics, 'keepInside');
  bindRange('lineWidth', Settings.visual, 'lineWidth', (v)=>v.toFixed(1));
  bindSelect('lineStyle', Settings.visual, 'lineStyle');
  bindSelect('colorMode', Settings.visual, 'colorMode');
  bindColor('lineColor', Settings.visual, 'lineColor');
  bindColor('bgColor', Settings.visual, 'bgColor');
  bindSelect('blendMode', Settings.visual, 'blendMode');
  bindCheck('glowEnabled', Settings.visual, 'glowEnabled');
  bindRange('glow', Settings.visual, 'glow', (v)=>v.toFixed(0));
  bindColor('glowColor', Settings.visual, 'glowColor');
  bindCheck('plexEnabled', Settings.visual, 'plexEnabled');
  bindRange('plex', Settings.visual, 'plex', (v)=>v.toFixed(2));
  bindRange('detail', Settings.system, 'detail', (v)=>v.toFixed(0));
  bindCheck('autoDetail', Settings.system, 'autoDetail');
  const toggleBtn = byId('togglePanel'); if (toggleBtn) toggleBtn.onclick = () => { byId('panel')?.classList.toggle('collapsed'); requestAnimationFrame(() => window.dispatchEvent(new Event('resize'))); };
  const pauseBtn = byId('pauseBtn'); if (pauseBtn) pauseBtn.onclick = () => { Settings.system.paused = !Settings.system.paused; pauseBtn.textContent = Settings.system.paused ? 'Resume' : 'Pause'; };
  const randBtn = byId('randomize'); if (randBtn) randBtn.onclick = () => { randomizeSettings(); if (Settings.system.autoDetail) setStride(State.stride); ensureLayerCount(); syncControls(); applyContextLimits(); };
  const resetBtn = byId('resetCam'); if (resetBtn) resetBtn.onclick = () => { State.pointer.x = State.W*0.5; State.pointer.y = State.H*0.5; State.pointer.sx = State.pointer.x; State.pointer.sy = State.pointer.y; };
  const fullBtn = byId('fullscreenBtn'); if (fullBtn) fullBtn.onclick = () => { if (!isFullscreen()) requestFullscreen(document.documentElement); else exitFullscreen(); };
  document.addEventListener('fullscreenchange', updateFullscreenBtn);
  document.addEventListener('webkitfullscreenchange', updateFullscreenBtn as any);
  updateFullscreenBtn();
  initPresetsUI();
  syncControls();
  updateVisibility();
  applyContextLimits();
}

export function syncControls() {
  const pairs:[string, any][] = [ ['v_waveCount', Settings.wave.count], ['v_amplitude', Settings.wave.amplitude], ['v_frequency', Settings.wave.frequency.toFixed(2)], ['v_speed', Settings.wave.speed.toFixed(2)], ['v_minGap', Settings.wave.minGap], ['v_spread', `${Math.round(Settings.wave.spread*100)}%`], ['v_bandCenter', `${Math.round(Settings.wave.bandCenter*100)}%`], ['v_duty', Settings.wave.pulseDuty.toFixed(2)], ['v_flowAngle', `${Settings.wave.flowAngleDeg}°`], ['v_tiltDeg', `${Settings.wave.tiltDeg}°`], ['v_turbInt', Settings.turbulence.intensity.toFixed(2)], ['v_turbScale', Settings.turbulence.scale.toFixed(4)], ['v_turbSpeed', Settings.turbulence.speed.toFixed(2)], ['v_interStrength', Settings.interaction.strength.toFixed(2)], ['v_interRadius', Settings.interaction.radius.toFixed(0)], ['v_spring', Settings.physics.spring.toFixed(0)], ['v_neighbor', Settings.physics.neighbor.toFixed(0)], ['v_damping', Settings.physics.damping.toFixed(1)], ['v_sepK', Settings.physics.sepK.toFixed(2)], ['v_lineWidth', Settings.visual.lineWidth.toFixed(1)], ['v_glow', Settings.visual.glow.toFixed(0)], ['v_plex', Settings.visual.plex.toFixed(2)], ['v_detail', State.stride] ];
  for (const [id, val] of pairs) setText(id, val);
  const sync = (id:string, v:any) => { const el = byId(id) as any; if (!el) return; if (el.type === 'checkbox') el.checked = !!v; else el.value = v; };
  sync('waveCount', Settings.wave.count); sync('amplitude', Settings.wave.amplitude); sync('autoAmplitude', Settings.wave.autoAmplitude); sync('frequency', Settings.wave.frequency); sync('speed', Settings.wave.speed); sync('minGap', Settings.wave.minGap); sync('autoMinGap', Settings.wave.autoMinGap); sync('spread', Settings.wave.spread); sync('bandCenter', Settings.wave.bandCenter); sync('shape', Settings.wave.shape); sync('pulseDuty', Settings.wave.pulseDuty); sync('direction', Settings.wave.direction); sync('flowAngle', Settings.wave.flowAngleDeg); sync('tiltDeg', Settings.wave.tiltDeg); sync('turbType', Settings.turbulence.type); sync('turbInt', Settings.turbulence.intensity); sync('turbScale', Settings.turbulence.scale); sync('turbSpeed', Settings.turbulence.speed); const seedEl = byId<HTMLInputElement>('noiseSeed'); if (seedEl) seedEl.value = String(Settings.turbulence.seed); sync('interMode', Settings.interaction.mode); sync('interStrength', Settings.interaction.strength); sync('interRadius', Settings.interaction.radius); sync('autoInterRadius', Settings.interaction.autoRadius); sync('spring', Settings.physics.spring); sync('neighbor', Settings.physics.neighbor); sync('damping', Settings.physics.damping); sync('sepK', Settings.physics.sepK); sync('keepInside', Settings.physics.keepInside); sync('lineWidth', Settings.visual.lineWidth); sync('lineStyle', Settings.visual.lineStyle); sync('colorMode', Settings.visual.colorMode); sync('lineColor', Settings.visual.lineColor); sync('bgColor', Settings.visual.bgColor); sync('glowEnabled', Settings.visual.glowEnabled); sync('glow', Settings.visual.glow); sync('glowColor', Settings.visual.glowColor); sync('blendMode', Settings.visual.blendMode); sync('plexEnabled', Settings.visual.plexEnabled); sync('plex', Settings.visual.plex); sync('detail', State.stride); sync('autoDetail', Settings.system.autoDetail); const pauseBtn = byId('pauseBtn'); if (pauseBtn) pauseBtn.textContent = Settings.system.paused ? 'Resume' : 'Pause'; setText('ampHint', `Safe amplitude ≤ ${Settings.internal.amplitudeCap}px`); updateVisibility(); updateContextChip();
}
