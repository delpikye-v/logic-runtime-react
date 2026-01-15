import type { Effect } from "./types";
export declare function composeEffects<W, R>(effects: Effect<W, R>[]): Effect<W, R>;
export declare function takeLatest<W, R>(): Effect<W, R>;
export declare function debounce<W, R>(ms: number): Effect<W, R>;
export declare function retry<W, R>(count?: number): Effect<W, R>;
export type EffectBuilder<W, R> = Effect<W, R> & {
    takeLatest(): EffectBuilder<W, R>;
    debounce(ms: number): EffectBuilder<W, R>;
    retry(count?: number): EffectBuilder<W, R>;
};
export declare function effect<W extends object = any, R extends object = W>(fx: Effect<W, R>): EffectBuilder<W, R>;
