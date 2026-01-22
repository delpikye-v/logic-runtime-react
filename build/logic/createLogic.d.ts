import { Scope } from "intentx-core-z";
import { LogicRuntime } from "../core/runtime";
import { EffectDef } from "../core/effect";
type ComputedFactory<S> = (context: {
    state: Readonly<S>;
}) => any;
type ActionFactory<S extends object, Fn extends (...args: any[]) => any> = (context: {
    emit: LogicRuntime<S, any>["emit"];
    getState: () => Readonly<S>;
}) => Fn;
export type LogicActions = Record<string, (...args: any[]) => any>;
export type LogicFactory<S extends object, A extends LogicActions> = {
    name?: string;
    create(scope?: Scope): LogicRuntime<S, A>;
};
export declare function createLogic<S extends object, A extends LogicActions>(config: {
    name?: string;
    state: S;
    computed?: Record<string, ComputedFactory<S>>;
    intents?: (bus: {
        on: LogicRuntime<S>["onIntent"];
        effect: (type: string, eff: EffectDef) => void;
    }) => void;
    actions?: {
        [K in keyof A]: ActionFactory<S, A[K]>;
    };
}): LogicFactory<S, A>;
export {};
