import { Timeline } from "./timeline";
export type Devtools = {
    timeline: Timeline;
    wrap(runtime: RuntimeLike): void;
};
type RuntimeLike = {
    scope: string;
    state(): any;
    emit(intent: string, payload?: any): Promise<void>;
};
export declare function attachDevtools(target: RuntimeLike): Devtools;
export {};
