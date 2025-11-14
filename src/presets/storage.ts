import { defaultPresets, PRESET_KEY } from './data';

export function loadPresets(): Record<string, any> {
  if (typeof localStorage === 'undefined') return { ...defaultPresets };
  const raw = localStorage.getItem(PRESET_KEY);
  let user:Record<string, any> = {};
  if (raw) { try { user = JSON.parse(raw); } catch { /* ignore */ } }
  return { ...defaultPresets, ...user };
}

export function savePresets(obj:Record<string, any>) {
  if (typeof localStorage !== 'undefined') localStorage.setItem(PRESET_KEY, JSON.stringify(obj));
}



