import type { Effect, EffectCtx } from "./types";
export declare function composeEffects<W, R>(effects: Effect<W, R>[]): Effect<W, R>;
export declare function takeLatest<W, R>(): Effect<W, R>;
export declare function debounce<W, R>(ms: number): Effect<W, R>;
export declare function retry<W, R>(count?: number): Effect<W, R>;
export declare function effect<W extends object, R extends object = W, P = any>(body: (ctx: EffectCtx<W, R, P>) => void | Promise<void>): any;
