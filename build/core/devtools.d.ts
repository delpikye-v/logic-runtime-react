import { Timeline } from "./timeline";
/**
 * Devtools public API
 */
export type Devtools = {
    timeline: Timeline;
    wrap(runtime: RuntimeLike): void;
};
/**
 * Minimal runtime surface for devtools
 */
type RuntimeLike = {
    scope: string;
    emit(intent: string, payload?: any): Promise<void>;
    state(): any;
};
export declare function attachDevtools(target: RuntimeLike): Devtools;
export {};
