import { IntentMiddleware } from "./middleware";
import { RuntimeIntentContext } from "./types";
import { EffectDef } from "./effect";
export type IntentHandler<S, P = any> = (context: RuntimeIntentContext<S, P>) => void | Promise<void>;
export declare class IntentBus<S> {
    private handlers;
    private effects;
    private middlewares;
    use(mw: IntentMiddleware<S>): void;
    effect(type: string, eff: EffectDef): void;
    on<P = any>(type: string, handler: IntentHandler<S, P>): void;
    emit(type: string, context: RuntimeIntentContext<S>): Promise<void>;
}
