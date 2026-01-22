import { Timeline } from "./timeline";
type RuntimeLike = {
    scope: {
        name: string;
    } | string;
    getSnapshot(): any;
    emit(intent: string, payload?: any): Promise<void>;
};
export type Devtools = {
    timeline: Timeline;
    wrap(): void;
};
export declare function attachDevtools(target: RuntimeLike): Devtools;
export {};
