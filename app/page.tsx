'use client';
import React, { useEffect, useRef, useState } from 'react';
import { boot } from '@/main';
import { Activity, Triangle, Square, Zap, ArrowRight, ArrowLeft, X, Move, Circle, RotateCw, Minus, Palette, Rainbow, Monitor, Layers, Sun, Blend, Gauge, Settings, CheckCircle, AlertTriangle, Pause, Maximize, Menu } from 'lucide-react';

export default function Page() {
  const booted = useRef(false);
  const [shapeValue, setShapeValue] = useState('sine');
  const [directionValue, setDirectionValue] = useState('right');
  const [interModeValue, setInterModeValue] = useState('off');
  const [lineStyleValue, setLineStyleValue] = useState('solid');
  const [colorModeValue, setColorModeValue] = useState('custom');
  const [blendModeValue, setBlendModeValue] = useState('source-over');
  const [ctxValue, setCtxValue] = useState('OK');

  useEffect(() => {
    if (!booted.current) { boot(); booted.current = true; }
  }, []);

  useEffect(() => {
    const sel = document.getElementById('shape') as HTMLSelectElement;
    if (sel) {
      setShapeValue(sel.value);
      const handler = () => setShapeValue(sel.value);
      sel.addEventListener('change', handler);
      return () => sel.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    const sel = document.getElementById('direction') as HTMLSelectElement;
    if (sel) {
      setDirectionValue(sel.value);
      const handler = () => setDirectionValue(sel.value);
      sel.addEventListener('change', handler);
      return () => sel.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    const sel = document.getElementById('interMode') as HTMLSelectElement;
    if (sel) {
      setInterModeValue(sel.value);
      const handler = () => setInterModeValue(sel.value);
      sel.addEventListener('change', handler);
      return () => sel.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    const sel = document.getElementById('lineStyle') as HTMLSelectElement;
    if (sel) {
      setLineStyleValue(sel.value);
      const handler = () => setLineStyleValue(sel.value);
      sel.addEventListener('change', handler);
      return () => sel.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    const sel = document.getElementById('colorMode') as HTMLSelectElement;
    if (sel) {
      setColorModeValue(sel.value);
      const handler = () => setColorModeValue(sel.value);
      sel.addEventListener('change', handler);
      return () => sel.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    const sel = document.getElementById('blendMode') as HTMLSelectElement;
    if (sel) {
      setBlendModeValue(sel.value);
      const handler = () => setBlendModeValue(sel.value);
      sel.addEventListener('change', handler);
      return () => sel.removeEventListener('change', handler);
    }
  }, []);

  useEffect(() => {
    const el = document.getElementById('ctxChip');
    if (el) {
      const handler = (e: any) => setCtxValue(e.detail);
      el.addEventListener('chipUpdate', handler);
      return () => el.removeEventListener('chipUpdate', handler);
    }
  }, []);

  const getShapeIcon = (value: string) => {
    switch(value) {
      case 'sine': return Activity;
      case 'triangle': return Triangle;
      case 'square': return Square;
      case 'saw': return Zap;
      case 'pulse': return Circle;
      default: return Activity;
    }
  };

  const getDirectionIcon = (value: string) => {
    switch(value) {
      case 'right': return ArrowRight;
      case 'left': return ArrowLeft;
      default: return ArrowRight;
    }
  };

  const getInterModeIcon = (value: string) => {
    switch(value) {
      case 'off': return X;
      case 'push': return Move;
      case 'pull': return Move;
      case 'gravity': return Circle;
      case 'swirl': return RotateCw;
      default: return X;
    }
  };

  const getLineStyleIcon = (value: string) => {
    switch(value) {
      case 'solid': return Minus;
      case 'dashed': return Minus;
      case 'dotted': return Circle;
      default: return Minus;
    }
  };

  const getColorModeIcon = (value: string) => {
    switch(value) {
      case 'custom': return Palette;
      case 'rainbow': return Rainbow;
      case 'velocity': return Zap;
      default: return Palette;
    }
  };

  const getBlendModeIcon = (value: string) => {
    switch(value) {
      case 'source-over': return Blend;
      case 'lighter': return Sun;
      case 'screen': return Monitor;
      case 'overlay': return Layers;
      case 'soft-light': return Sun;
      case 'difference': return Minus;
      default: return Blend;
    }
  };

  const ctxIcon = ctxValue === 'OK' ? CheckCircle : AlertTriangle;

  const CtxIcon = ctxIcon;
  return (
    <div className="app">
      <aside>
        <div className="panel" id="panel">
          <div className="topbar">
            <div className="title"></div>
            <span className="chip" id="fpsChip"><Gauge size={14} /></span>
            <span className="chip" id="detailChip"><Settings size={14} /></span>
            <span className="chip" id="ctxChip"><CtxIcon size={14} /></span>
            <div className="spacer" />
            <button className="btn" id="fullscreenBtn"><Maximize size={14} /></button>
          </div>

          <div className="sec">Waves</div>
          <div className="group">
            <label>Count</label><div className="value" id="v_waveCount"></div>
            <input id="waveCount" type="range" min={1} max={128} step={1} />
          </div>
          <div className="group">
            <label>Amplitude</label><div className="value" id="v_amplitude"></div>
            <input id="amplitude" type="range" min={0} max={300} step={1} />
          </div>
          <div className="group">
            <label>Auto amplitude</label>
            <div className="value"><input id="autoAmplitude" type="checkbox" /></div>
          </div>
          <div className="group wide subtle" id="row_ampHint">
            <span id="ampHint" className="mono"></span>
          </div>
          <div className="group">
            <label>Frequency (cycles)</label><div className="value" id="v_frequency"></div>
            <input id="frequency" type="range" min={0.2} max={6} step={0.1} />
          </div>
          <div className="group">
            <label>Phase speed</label><div className="value" id="v_speed"></div>
            <input id="speed" type="range" min={0} max={4} step={0.01} />
          </div>

          <div className="group">
            <label>Vertical spacing (base)</label><div className="value" id="v_minGap"></div>
            <input id="minGap" type="range" min={0} max={120} step={1} />
          </div>
          <div className="group">
            <label>Auto min-gap</label>
            <div className="value"><input id="autoMinGap" type="checkbox" /></div>
          </div>

          <div className="group">
            <label>Layer spread</label><div className="value" id="v_spread"></div>
            <input id="spread" type="range" min={0.25} max={1.5} step={0.01} />
          </div>
          <div className="group">
            <label>Band center</label><div className="value" id="v_bandCenter"></div>
            <input id="bandCenter" type="range" min={0} max={1} step={0.01} />
          </div>

          <div className="group">
            <label>Shape</label>
            <select id="shape" style={{display: 'none'}}>
              <option value="sine">Sine</option>
              <option value="triangle">Triangle</option>
              <option value="square">Square</option>
              <option value="saw">Sawtooth</option>
              <option value="pulse">Pulse</option>
            </select>
            <button className="btn" onClick={() => {
              const sel = document.getElementById('shape') as HTMLSelectElement;
              const opts = Array.from(sel.options);
              const currentIndex = opts.findIndex(o => o.value === shapeValue);
              const nextIndex = (currentIndex + 1) % opts.length;
              sel.value = opts[nextIndex].value;
              sel.dispatchEvent(new Event('change'));
            }}>
              {React.createElement(getShapeIcon(shapeValue), {size: 16})}
            </button>
          </div>
          <div className="group hidden" id="row_pulseDuty">
            <label>Pulse duty</label><div className="value" id="v_duty"></div>
            <input id="pulseDuty" type="range" min={0.05} max={0.95} step={0.01} />
          </div>

          <div className="sec">Flow</div>
          <div className="group">
            <label>Direction</label>
            <select id="direction" style={{display: 'none'}}>
              <option value="right">Right →</option>
              <option value="left">← Left</option>
            </select>
            <button className="btn" onClick={() => {
              const sel = document.getElementById('direction') as HTMLSelectElement;
              const opts = Array.from(sel.options);
              const currentIndex = opts.findIndex(o => o.value === directionValue);
              const nextIndex = (currentIndex + 1) % opts.length;
              sel.value = opts[nextIndex].value;
              sel.dispatchEvent(new Event('change'));
            }}>
              {React.createElement(getDirectionIcon(directionValue), {size: 16})}
            </button>
          </div>
          <div className="group">
            <label>Flow angle (deg)</label><div className="value" id="v_flowAngle"></div>
            <input id="flowAngle" type="range" min={-90} max={90} step={1} />
          </div>
          <div className="group">
            <label>Line tilt (deg)</label><div className="value" id="v_tiltDeg"></div>
            <input id="tiltDeg" type="range" min={-90} max={90} step={0.5} />
          </div>

          <div className="sec">Turbulence</div>
          <div className="group">
            <label>Type</label>
            <select id="turbType">
              <option value="none">None</option>
              <option value="sine">Sine</option>
              <option value="noise">Noise</option>
              <option value="perlin">Perlin</option>
              <option value="vortex">Vortex</option>
              <option value="chaos">Chaos</option>
            </select>
          </div>
          <div className="group hidden" id="row_turbInt">
            <label>Intensity</label><div className="value" id="v_turbInt"></div>
            <input id="turbInt" type="range" min={0} max={1.5} step={0.01} />
          </div>
          <div className="group hidden" id="row_turbScale">
            <label>Scale</label><div className="value" id="v_turbScale"></div>
            <input id="turbScale" type="range" min={0.0003} max={0.01} step={0.0001} />
          </div>
          <div className="group hidden" id="row_turbSpeed">
            <label>Speed</label><div className="value" id="v_turbSpeed"></div>
            <input id="turbSpeed" type="range" min={0} max={2} step={0.01} />
          </div>
          <div className="group hidden" id="row_noiseSeed">
            <label>Noise seed</label>
            <input id="noiseSeed" type="number" className="mono" step={1} min={0} max={2147483647} />
          </div>

          <div className="sec">Interaction</div>
          <div className="group">
            <label>Mode</label>
            <select id="interMode" style={{display: 'none'}}>
              <option value="off">Off</option>
              <option value="push">Push</option>
              <option value="pull">Pull</option>
              <option value="gravity">Gravity</option>
              <option value="swirl">Swirl</option>
            </select>
            <button className="btn" onClick={() => {
              const sel = document.getElementById('interMode') as HTMLSelectElement;
              const opts = Array.from(sel.options);
              const currentIndex = opts.findIndex(o => o.value === interModeValue);
              const nextIndex = (currentIndex + 1) % opts.length;
              sel.value = opts[nextIndex].value;
              sel.dispatchEvent(new Event('change'));
            }}>
              {React.createElement(getInterModeIcon(interModeValue), {size: 16})}
            </button>
          </div>
          <div className="group hidden" id="row_interStrength">
            <label>Strength</label><div className="value" id="v_interStrength"></div>
            <input id="interStrength" type="range" min={0} max={4} step={0.01} />
          </div>
          <div className="group hidden" id="row_interRadius">
            <label>Radius</label><div className="value" id="v_interRadius"></div>
            <input id="interRadius" type="range" min={8} max={500} step={1} />
          </div>
          <div className="group">
            <label>Auto radius</label>
            <div className="value"><input id="autoInterRadius" type="checkbox" /></div>
          </div>

          <div className="sec">Physics</div>
          <div className="group">
            <label>Elasticity (to shape)</label><div className="value" id="v_spring"></div>
            <input id="spring" type="range" min={1} max={180} step={1} />
          </div>
          <div className="group">
            <label>Neighbor coupling</label><div className="value" id="v_neighbor"></div>
            <input id="neighbor" type="range" min={0} max={1200} step={10} />
          </div>
          <div className="group">
            <label>Damping</label><div className="value" id="v_damping"></div>
            <input id="damping" type="range" min={0} max={24} step={0.1} />
          </div>
          <div className="group" id="row_sepK">
            <label>Separation strength</label><div className="value" id="v_sepK"></div>
            <input id="sepK" type="range" min={0} max={2} step={0.01} />
          </div>
          <div className="group">
            <label>Keep inside</label>
            <div className="value"><input id="keepInside" type="checkbox" /></div>
          </div>

          <div className="sec">Visual</div>
          <div className="group">
            <label>Line width</label><div className="value" id="v_lineWidth"></div>
            <input id="lineWidth" type="range" min={0.5} max={10} step={0.1} />
          </div>
          <div className="group">
            <label>Line style</label>
            <select id="lineStyle">
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
          <div className="group">
            <label>Color mode</label>
            <select id="colorMode">
              <option value="custom">Custom</option>
              <option value="rainbow">Rainbow</option>
              <option value="velocity">Velocity</option>
            </select>
          </div>
          <div className="group hidden" id="row_lineColor">
            <label>Custom color</label>
            <input id="lineColor" type="color" />
          </div>
          <div className="group">
            <label>Background</label>
            <input id="bgColor" type="color" />
          </div>
          <div className="group">
            <label>Blend mode</label>
            <select id="blendMode" style={{display: 'none'}}>
              <option value="source-over">Normal</option>
              <option value="lighter">Lighter</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="soft-light">Soft light</option>
              <option value="difference">Difference</option>
            </select>
            <button className="btn" onClick={() => {
              const sel = document.getElementById('blendMode') as HTMLSelectElement;
              const opts = Array.from(sel.options);
              const currentIndex = opts.findIndex(o => o.value === blendModeValue);
              const nextIndex = (currentIndex + 1) % opts.length;
              sel.value = opts[nextIndex].value;
              sel.dispatchEvent(new Event('change'));
            }}>
              {React.createElement(getBlendModeIcon(blendModeValue), {size: 16})}
            </button>
          </div>

          <div className="group">
            <label>Glow</label>
            <div className="value"><input id="glowEnabled" type="checkbox" /></div>
          </div>
          <div className="group hidden" id="row_glow">
            <label>Glow size</label><div className="value" id="v_glow"></div>
            <input id="glow" type="range" min={0} max={50} step={1} />
          </div>
          <div className="group hidden" id="row_glowColor">
            <label>Glow color</label>
            <input id="glowColor" type="color" />
          </div>

          <div className="group">
            <label>Plex (trail)</label>
            <div className="value"><input id="plexEnabled" type="checkbox" /></div>
          </div>
          <div className="group hidden" id="row_plex">
            <label>Trail fade</label><div className="value" id="v_plex"></div>
            <input id="plex" type="range" min={0} max={1} step={0.01} />
          </div>

          <div className="sec">Performance</div>
          <div className="group">
            <label>Detail (px/sample)</label><div className="value" id="v_detail"></div>
            <input id="detail" type="range" min={3} max={16} step={1} />
          </div>
          <div className="group">
            <label>Auto detail</label>
            <div className="value"><input id="autoDetail" type="checkbox" /></div>
          </div>

          <div className="sec">Presets</div>
          <div className="group">
            <label>Load preset</label>
            <select id="presetSelect"></select>
          </div>
          <div className="group">
            <label>Name</label>
            <input id="presetName" type="text" placeholder="My preset" />
          </div>
          <div className="btn-row" style={{marginTop: '-4px'}}>
            <button className="btn" id="savePreset">Save</button>
            <button className="btn" id="deletePreset">Delete</button>
          </div>
          <div className="btn-row">
            <button className="btn" id="exportPreset">Export JSON</button>
            <button className="btn" id="importPreset">Import JSON</button>
          </div>

          <div className="note">Context-aware controls, layer spread and band center, flow direction/angle, visual tilt, auto amplitude/radius. Hotkeys: Space pause, M menu, R randomize, C center pointer, S screenshot.</div>

          <div className="footer">
            <div className="btn-row">
              <button className="btn" id="randomize">Randomize</button>
              <button className="btn" id="resetCam">Center Pointer</button>
            </div>
          </div>
        </div>
      </aside>
      <main><canvas id="c" aria-label="Interactive wave canvas" /></main>
    </div>
  );
}
