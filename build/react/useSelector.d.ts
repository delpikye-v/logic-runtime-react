import { LogicRuntime } from "../core/runtime";
export declare function useSelector<S extends object, R>(runtime: LogicRuntime<S>, selector: (state: Readonly<S>) => R): R;
