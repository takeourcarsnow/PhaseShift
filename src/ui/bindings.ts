import { byId } from '../core';
import { setStride } from '../core/samples';
import { ensureLayerCount } from '../core/layers';
import { applyContextLimits } from '../core/context';
import { Settings } from '../core/config';
import { State } from '../core/state';
import { setText } from './utils';
import { updateVisibility } from './visibility';

export function bindRange(id: string, obj: any, key: string, fmt: (v: any) => any = (v) => v) {
  const el = byId<HTMLInputElement>(id);
  const label = byId('v_' + key) || byId('v_' + id);
  if (!el) return;
  el.value = String(obj[key]);
  el.title = fmt(obj[key]);
  if (label) label.textContent = fmt(obj[key]);

  // Create tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'slider-tooltip';
  el.parentElement!.appendChild(tooltip);

  const updateTooltip = () => {
    const val = fmt(obj[key]);
    tooltip.textContent = val;
    const min = parseFloat(el.min);
    const max = parseFloat(el.max);
    const percent = (obj[key] - min) / (max - min);
    const sliderRect = el.getBoundingClientRect();
    const groupRect = el.parentElement!.getBoundingClientRect();
    const left = sliderRect.left - groupRect.left + percent * sliderRect.width - tooltip.offsetWidth / 2;
    tooltip.style.left = left + 'px';
    tooltip.style.top = (sliderRect.top - groupRect.top - tooltip.offsetHeight - 5) + 'px';
  };

  let isDragging = false;
  el.onmousedown = () => {
    isDragging = true;
    updateTooltip();
    tooltip.style.opacity = '1';
  };
  el.oninput = () => {
    obj[key] = parseFloat(el.value);
    el.title = fmt(obj[key]);
    if (label) label.textContent = fmt(obj[key]);
    if (isDragging) updateTooltip();
    if (key === 'count') {
      State.desiredWaveCount = Math.round(obj[key]);
      ensureLayerCount();
      applyContextLimits();
    }
    if (key === 'pulseDuty') setText('v_duty', obj[key].toFixed(2));
    if (id === 'detail') setStride(obj[key]);
    applyContextLimits();
    updateVisibility();
  };
  el.onmouseup = () => {
    isDragging = false;
    tooltip.style.opacity = '0';
  };
  // Also hide on mouseleave or something, but for now, mouseup is fine
}

export function bindSelect(id: string, obj: any, key: string) {
  const el = byId<HTMLSelectElement>(id);
  if (!el) return;
  el.value = String(obj[key]);
  el.onchange = () => {
    obj[key] = el.value;
    applyContextLimits();
    updateVisibility();
  };
}

export function bindCheck(id: string, obj: any, key: string) {
  const el = byId<HTMLInputElement>(id);
  if (!el) return;
  el.checked = !!obj[key];
  el.oninput = () => {
    obj[key] = !!el.checked;
    applyContextLimits();
    updateVisibility();
  };
}

export function bindColor(id: string, obj: any, key: string) {
  const el = byId<HTMLInputElement>(id);
  if (!el) return;
  el.value = obj[key];
  el.oninput = () => {
    obj[key] = el.value;
  };
}



