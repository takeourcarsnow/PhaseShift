export interface WaveSettings { count:number; amplitude:number; frequency:number; speed:number; minGap:number; autoMinGap:boolean; shape:'sine'|'triangle'|'square'|'saw'|'pulse'; pulseDuty:number; autoAmplitude:boolean; spread:number; bandCenter:number; direction:'right'|'left'; flowAngleDeg:number; tiltDeg:number; }
export interface TurbulenceSettings { type:'none'|'sine'|'noise'|'perlin'|'vortex'|'chaos'; intensity:number; scale:number; speed:number; octaves:number; seed:number; }
export interface InteractionSettings { mode:'off'|'push'|'pull'|'gravity'|'swirl'; strength:number; radius:number; autoRadius:boolean; }
export interface PhysicsSettings { spring:number; neighbor:number; damping:number; sepK:number; keepInside:boolean; }
export interface VisualSettings { lineWidth:number; lineStyle:'solid'|'dashed'|'dotted'; colorMode:'custom'|'rainbow'|'velocity'; lineColor:string; bgColor:string; glowEnabled:boolean; glow:number; glowColor:string; blendMode:GlobalCompositeOperation; plexEnabled:boolean; plex:number; }
export interface SystemSettings { detail:number; autoDetail:boolean; targetFPS:number; paused:boolean; reduceMotion:boolean; }
export interface InternalSettings { rainbowShift:number; velocityHueMin:number; velocityHueMax:number; amplitudeCap:number; }

export interface SettingsShape { wave:WaveSettings; turbulence:TurbulenceSettings; interaction:InteractionSettings; physics:PhysicsSettings; visual:VisualSettings; system:SystemSettings; internal:InternalSettings; }

const reduceMotion = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Settings: SettingsShape = {
  wave: { count:5, amplitude:120, frequency:1.6, speed:0.6, minGap:28, autoMinGap:true, shape:'sine', pulseDuty:0.25, autoAmplitude:false, spread:1.0, bandCenter:0.5, direction:'right', flowAngleDeg:0, tiltDeg:0 },
  turbulence: { type:'perlin', intensity:0.35, scale:0.0022, speed:0.22, octaves:3, seed: ((Math.random()*1e9)|0) },
  interaction: { mode:'push', strength:1.2, radius:160, autoRadius:true },
  physics: { spring:80, neighbor:420, damping:10.5, sepK:0.6, keepInside:false },
  visual: { lineWidth:2.2, lineStyle:'solid', colorMode:'rainbow', lineColor:'#00d1ff', bgColor:'#0b0c10', glowEnabled:false, glow:18, glowColor:'#ffffff', blendMode:'source-over', plexEnabled:false, plex:0.1 },
  system: { detail:8, autoDetail:false, targetFPS:60, paused:false, reduceMotion },
  internal: { rainbowShift:0, velocityHueMin:200, velocityHueMax:360, amplitudeCap:999 }
};
