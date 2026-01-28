import { LogicRuntime, InferComputed } from "../core/runtime";
export declare function useLogic<S extends object, C extends Record<string, any>, A extends Record<string, any>>(runtime: LogicRuntime<S, C, A>): {
    state: Readonly<S & InferComputed<C>>;
    computed: Readonly<InferComputed<C>>;
    actions: A;
};
