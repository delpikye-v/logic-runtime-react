import * as React from "react";
type LogicInstance<S> = {
    state(): Readonly<S>;
    emit(intent: string, payload?: any): Promise<void>;
    subscribe(fn: () => void): () => void;
};
type LogicFactory<S> = {
    create(scope?: string): LogicInstance<S>;
};
export declare function withLogic<S, P extends object>(logic: LogicFactory<S>, View: React.ComponentType<P & {
    state: Readonly<S>;
    emit: (intent: string, payload?: any) => Promise<void>;
}>, scope?: string): React.FC<Omit<P, "state" | "emit">>;
export {};
