import { byId } from '../core';

export const setText = (id: string, val: any) => {
  const el = byId(id);
  if (el) {
    if (id === 'fpsChip' || id === 'detailChip' || id === 'ctxChip') {
      el.title = String(val);
      if (id === 'ctxChip') {
        el.dispatchEvent(new CustomEvent('chipUpdate', { detail: val }));
      }
    } else {
      el.textContent = String(val);
    }
  }
};

export const show = (id: string, on: boolean) => {
  const el = byId(id);
  if (!el) return;
  el.classList.toggle('hidden', !on);
};

export const enable = (id: string, on: boolean) => {
  const el = byId<HTMLInputElement>(id);
  if (!el) return;
  el.disabled = !on;
};



