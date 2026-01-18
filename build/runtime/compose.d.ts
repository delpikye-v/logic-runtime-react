type LogicInstance = {
    state(): any;
    emit?: (intent: string, payload?: any) => Promise<any> | any;
    subscribe(fn: () => void): () => void;
};
type ComposedLogic = {
    create(scope?: string): LogicInstance;
} | {
    namespace?: string;
    logic: {
        create(scope?: string): LogicInstance;
    };
};
export declare function composeLogic(...entries: ComposedLogic[]): {
    create(scope?: string): {
        readonly state: any;
        emit(intent: string, payload?: any): Promise<void>;
        subscribe(fn: () => void): () => void;
    };
};
export {};
