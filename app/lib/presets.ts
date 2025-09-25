import { Settings, SettingsShape } from './config';
import { State } from './state';
import { ensureLayerCount } from './layers';
import { setStride } from './samples';
import { applyContextLimits } from './context';

export const PRESET_KEY = 'wave_playground_presets_v3';

export const defaultPresets: Record<string, Partial<SettingsShape>> = {
  "Clean Rainbow": { wave:{count:5,amplitude:110,frequency:1.5,speed:0.5,minGap:28,autoMinGap:true,shape:'sine',pulseDuty:0.25} as any,
    turbulence:{type:'perlin',intensity:0.25,scale:0.002,speed:0.18,octaves:3} as any,
    interaction:{mode:'push',strength:0.8,radius:180} as any,
    physics:{spring:70,neighbor:480,damping:10,sepK:0.6,keepInside:false} as any,
    visual:{lineWidth:2.2,lineStyle:'solid',colorMode:'rainbow',lineColor:'#00d1ff',bgColor:'#0b0c10',glowEnabled:false,glow:18,glowColor:'#ffffff',blendMode:'source-over',plexEnabled:false,plex:0.1} as any,
    system:{detail:8,autoDetail:false} as any },
  "Neon Storm": { wave:{count:6,amplitude:160,frequency:2.4,speed:1.2,minGap:24,autoMinGap:true,shape:'saw',pulseDuty:0.25} as any,
    turbulence:{type:'chaos',intensity:0.9,scale:0.003,speed:0.6,octaves:4} as any,
    interaction:{mode:'swirl',strength:1.5,radius:200} as any,
    physics:{spring:110,neighbor:800,damping:12,sepK:0.8,keepInside:true} as any,
    visual:{lineWidth:2.2,lineStyle:'dotted',colorMode:'rainbow',lineColor:'#ff00e5',bgColor:'#020307',glowEnabled:true,glow:26,glowColor:'#ffffff',blendMode:'screen',plexEnabled:true,plex:0.06} as any,
    system:{detail:7,autoDetail:true} as any },
  "Glass Strings": { wave:{count:5,amplitude:70,frequency:1.8,speed:0.7,minGap:34,autoMinGap:true,shape:'triangle',pulseDuty:0.25} as any,
    turbulence:{type:'sine',intensity:0.35,scale:0.0015,speed:0.35,octaves:3} as any,
    interaction:{mode:'pull',strength:0.9,radius:160} as any,
    physics:{spring:90,neighbor:620,damping:9,sepK:0.6,keepInside:false} as any,
    visual:{lineWidth:3,lineStyle:'dashed',colorMode:'custom',lineColor:'#b7fffd',bgColor:'#0b0c10',glowEnabled:false,glow:20,glowColor:'#b7fffd',blendMode:'overlay',plexEnabled:false,plex:0.1} as any,
    system:{detail:9,autoDetail:true} as any },
  "VelociGlow": { wave:{count:4,amplitude:140,frequency:1.1,speed:0.5,minGap:26,autoMinGap:true,shape:'square',pulseDuty:0.25} as any,
    turbulence:{type:'perlin',intensity:0.4,scale:0.0016,speed:0.2,octaves:4} as any,
    interaction:{mode:'gravity',strength:1.0,radius:240} as any,
    physics:{spring:80,neighbor:500,damping:11,sepK:0.7,keepInside:true} as any,
    visual:{lineWidth:2.6,lineStyle:'solid',colorMode:'velocity',lineColor:'#00ffd5',bgColor:'#0a0c10',glowEnabled:true,glow:18,glowColor:'#ffffff',blendMode:'lighter',plexEnabled:false,plex:0.09} as any,
    system:{detail:8,autoDetail:true} as any }
};

export function loadPresets() {
  if (typeof localStorage === 'undefined') return { ...defaultPresets };
  const raw = localStorage.getItem(PRESET_KEY);
  let user:Record<string, any> = {};
  if (raw) { try { user = JSON.parse(raw); } catch { /* ignore */ } }
  return { ...defaultPresets, ...user };
}
export function savePresets(obj:Record<string, any>) { if (typeof localStorage !== 'undefined') localStorage.setItem(PRESET_KEY, JSON.stringify(obj)); }

export function currentPresetObject() { return JSON.parse(JSON.stringify(Settings)); }

export function applyPreset(p:Partial<SettingsShape>, perlin:any) {
  Object.assign(Settings.wave, p.wave || {});
  State.desiredWaveCount = Math.round(Settings.wave.count);
  Object.assign(Settings.turbulence, p.turbulence || {});
  Object.assign(Settings.interaction, p.interaction || {});
  Object.assign(Settings.physics, p.physics || {});
  Object.assign(Settings.visual, p.visual || {});
  Object.assign(Settings.system, p.system || {});
  ensureLayerCount();
  if (typeof Settings.turbulence.seed === 'number' && perlin) perlin.reseed(Settings.turbulence.seed);
  setStride(Settings.system.detail);
  applyContextLimits();
}
