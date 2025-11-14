import { byId } from '../core';
import { State } from '../core';
import { loadPresets, savePresets, defaultPresets, applyPreset, currentPresetObject } from '../presets';
import { syncControls } from './sync';

export function initPresetsUI() {
  const presetSelect = byId<HTMLSelectElement>('presetSelect');
  const presetName = byId<HTMLInputElement>('presetName');
  if (!presetSelect || !presetName) return;
  const all = loadPresets();
  presetSelect.innerHTML = '';
  Object.keys(all).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    presetSelect.appendChild(opt);
  });
  presetSelect.onchange = () => {
    applyPreset(all[presetSelect.value] as any, State.perlin);
    syncControls();
  };
  const saveBtn = byId('savePreset');
  if (saveBtn) saveBtn.onclick = () => {
    const name = (presetName.value || '').trim() || 'My preset';
    all[name] = currentPresetObject() as any;
    savePresets(all);
    initPresetsUI();
    presetSelect.value = name;
  };
  const delBtn = byId('deletePreset');
  if (delBtn) delBtn.onclick = () => {
    const name = presetSelect.value;
    if (defaultPresets[name]) return;
    delete (all as any)[name];
    savePresets(all);
    initPresetsUI();
  };
  const expBtn = byId('exportPreset');
  if (expBtn) expBtn.onclick = () => {
    const json = JSON.stringify(currentPresetObject(), null, 2);
    navigator.clipboard?.writeText(json).catch(() => {});
    alert('Current settings copied to clipboard as JSON.');
  };
  const impBtn = byId('importPreset');
  if (impBtn) impBtn.onclick = async () => {
    const text = prompt('Paste preset JSON:');
    if (!text) return;
    try {
      const obj = JSON.parse(text);
      applyPreset(obj, State.perlin);
      syncControls();
    } catch {
      alert('Invalid JSON');
    }
  };
}



