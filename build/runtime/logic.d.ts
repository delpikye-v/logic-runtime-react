import type { LogicRuntime, IntentHandler, Effect } from "../core/types";
import { LogicPlugin } from "../plugins";
type ComputedDef<S, C> = {
    [K in keyof C]: (ctx: {
        state: S;
    }) => C[K];
};
type LogicDef<S extends object, C extends object = {}> = {
    name?: string;
    state: S;
    computed?: ComputedDef<S, C>;
    intents?: (bus: {
        on(intent: string, handler: IntentHandler<S, S & C>): void;
        effect(intent: string, fx: Effect<S, S & C>): void;
    }) => void;
    plugins?: LogicPlugin<S, C>[];
};
export declare function createLogic<S extends object = {}, C extends object = {}>(def: LogicDef<S, C>): {
    create(scope?: string): LogicRuntime<S, C>;
};
export {};
