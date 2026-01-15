import { Timeline } from "./timeline";
export type Devtools = {
    timeline: Timeline;
    wrap(runtime: RuntimeLike): void;
};
type RuntimeLike = {
    scope: string;
    emit(intent: string, payload?: any): Promise<void>;
    state(): any;
};
export declare function attachDevtools(target: RuntimeLike): Devtools;
export {};
