import { Scope } from "intentx-core-z";
import { LogicRuntime, ComputedDef, InferComputed } from "../core/runtime";
import { EffectDef } from "../core/effect";
export type LogicActions = Record<string, (...args: any[]) => any>;
export type LogicFactory<S extends object, C extends ComputedDef<S>, A extends LogicActions> = {
    name?: string;
    create(scope?: Scope): LogicRuntime<S, C, A>;
};
export type ExtractLogicTypes<T> = T extends LogicFactory<infer S, infer C, infer A> ? {
    state: Readonly<S & InferComputed<C>>;
    actions: A;
    emit: (intent: string, payload?: any) => Promise<void>;
} : never;
export declare function createLogic<S extends object, C extends ComputedDef<S>, ActionsDef extends Record<string, (context: {
    emit: LogicRuntime<S, C, any>["emit"];
    getState: () => Readonly<S & InferComputed<C>>;
}) => (...args: any[]) => any>>(config: {
    name?: string;
    state: S;
    computed?: C;
    intents?: (bus: {
        on: LogicRuntime<S, C, any>["onIntent"];
        effect: (type: string, eff: EffectDef) => void;
    }) => void;
    actions: ActionsDef;
}): LogicFactory<S, C, {
    [K in keyof ActionsDef]: ReturnType<ActionsDef[K]>;
}>;
