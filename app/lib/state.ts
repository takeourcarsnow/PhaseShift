import { Settings } from './config';
import type { Layer } from './layers';

export interface Pointer { x:number; y:number; sx:number; sy:number; down:boolean; }

interface AppState {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  dpr: number; W:number; H:number;
  stride: number; sampleCount: number;
  xCoords: Float32Array; xNorms: Float32Array; preXScaled: Float32Array;
  layers: Layer[]; desiredWaveCount: number;
  pointer: Pointer;
  perlin: any;
  accumulator: number; time:number; last:number; fpsEMA:number; lastFpsUpdate:number; ro: ResizeObserver | null;
}

export const State: AppState = {
  canvas: null,
  ctx: null,
  dpr: 1, W:0, H:0,
  stride: Settings.system.detail,
  sampleCount: 0,
  xCoords: new Float32Array(0),
  xNorms: new Float32Array(0),
  preXScaled: new Float32Array(0),
  layers: [],
  desiredWaveCount: Settings.wave.count,
  pointer: { x:0, y:0, sx:0, sy:0, down:false },
  perlin: null,
  accumulator: 0, time:0, last: (typeof performance !== 'undefined' ? performance.now():0), fpsEMA:60, lastFpsUpdate:0,
  ro: null
};
