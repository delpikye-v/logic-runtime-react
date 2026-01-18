export declare function createSelector<T, R>(select: (state: T) => R, isEqual?: (value1: any, value2: any) => boolean): (state: T) => R;
