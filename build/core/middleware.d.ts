export type IntentMiddleware<Ctx = any> = (ctx: Ctx, next: () => Promise<void>) => Promise<void>;
export declare function compose(middlewares: IntentMiddleware[]): (ctx: any, next: () => Promise<void>) => Promise<void>;
