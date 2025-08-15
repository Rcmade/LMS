export type IfReadonly<T, K extends keyof T> =
  Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? true : false;

export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

export type OnlyReadonlyProperties<T> = {
  [K in keyof T as IfReadonly<T, K> extends true ? K : never]: T[K];
};
