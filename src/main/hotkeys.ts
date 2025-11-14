import { Settings } from '../core/config';
import { State } from '../core/state';
import { byId } from '../core/utils';
import { ensureLayerCount } from '../core/layers';
import { syncControls } from '../ui';
import { applyContextLimits } from '../core/context';

function setupHotkeys() {
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return; // don't interfere with form inputs
    switch (e.key.toLowerCase()) {
      case ' ': // space
        e.preventDefault();
        Settings.system.paused = !Settings.system.paused;
        const pauseBtn = byId('pauseBtn'); if (pauseBtn) pauseBtn.title = Settings.system.paused ? 'Resume' : 'Pause';
        break;
      case 'm': {
        const panel = byId('panel'); if (panel) { panel.classList.toggle('collapsed'); setTimeout(()=>window.dispatchEvent(new Event('resize')), 60); }
        break; }
      case 'r': {
        import('../core/randomize').then(m => { m.randomizeSettings(); ensureLayerCount(); syncControls(); applyContextLimits(); });
        break; }
      case 'c': {
        State.pointer.x = State.W*0.5; State.pointer.y = State.H*0.5; State.pointer.sx = State.pointer.x; State.pointer.sy = State.pointer.y; break; }
      case 's': {
        if (State.canvas) {
          const url = State.canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url; a.download = `wave-playground-${Date.now()}.png`; a.click();
        }
        break; }
      default: break;
    }
  });
}

export { setupHotkeys };




