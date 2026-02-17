import * as React from "react";
import { Scope } from "intentx-core-z";
import type { ExtractLogicTypes, LogicActions, LogicFactory } from "../logic/createLogic";
import type { ComputedDef, InferComputed } from "../core/runtime";
type InjectedProps<S extends object, C extends ComputedDef<S>, A extends LogicActions> = {
    state: Readonly<S & InferComputed<C>>;
    actions: A;
    emit: (intent: string, payload?: any) => Promise<void>;
};
export type LogicViewProps<T extends LogicFactory<any, any, any>> = ExtractLogicTypes<T>;
export declare function withLogic<S extends object, C extends ComputedDef<S>, A extends LogicActions, P extends object>(logic: LogicFactory<S, C, A>, View: React.ComponentType<P & InjectedProps<S, C, A>>, scope?: Scope | string): React.FC<Omit<P, keyof InjectedProps<S, C, A>>>;
export {};
