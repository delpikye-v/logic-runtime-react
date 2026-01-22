export type EffectStrategy = "default" | "takeLatest" | "debounce";
export type EffectHandler<S = any> = (context: S) => void | Promise<void>;
export type EffectDef<S = any> = {
    _kind: "effect";
    handler: EffectHandler<S>;
    strategy: EffectStrategy;
    wait: number;
};
export declare function effect<S = any>(fn: EffectHandler<S>): {
    takeLatest(): {
        takeLatest(): any;
        debounce(ms: number): any;
        _kind: "effect";
        handler: EffectHandler<S>;
        strategy: EffectStrategy;
        wait: number;
    };
    debounce(ms: number): {
        takeLatest(): any;
        debounce(ms: number): any;
        _kind: "effect";
        handler: EffectHandler<S>;
        strategy: EffectStrategy;
        wait: number;
    };
    _kind: "effect";
    handler: EffectHandler<S>;
    strategy: EffectStrategy;
    wait: number;
};
