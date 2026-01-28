import { Scope } from "intentx-core-z";
import { LogicRuntime, ComputedDef, InferComputed } from "../core/runtime";
import { EffectDef } from "../core/effect";
export type LogicActions = Record<string, (...args: any[]) => any>;
export type LogicFactory<S extends object, C extends ComputedDef<S>, A extends LogicActions> = {
    name?: string;
    create(scope?: Scope): LogicRuntime<S, C, A>;
};
export declare function createLogic<S extends object, C extends ComputedDef<S> = {}, A extends LogicActions = {}>(config: {
    name?: string;
    state: S;
    computed?: C;
    intents?: (bus: {
        on: LogicRuntime<S, C, A>["onIntent"];
        effect: (type: string, eff: EffectDef) => void;
    }) => void;
    actions?: {
        [K in keyof A]: (context: {
            emit: LogicRuntime<S, C, A>["emit"];
            getState: () => Readonly<S & InferComputed<C>>;
        }) => A[K];
    };
}): LogicFactory<S, C, A>;
