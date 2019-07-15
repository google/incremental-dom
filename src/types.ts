export interface ElementConstructor {new(): Element};

// tslint:disable-next-line:no-any
export type AttrMutator = (a: HTMLElement, b: string, c: any) => void;

export type AttrMutatorConfig = {[x: string]: AttrMutator};

export type NameOrCtorDef = string|ElementConstructor;

export type Key = string|number|null|undefined;

export type Statics = Array<{}>|null|undefined;

export type PatchFunction<T, R> = (
    node: Element|DocumentFragment,
    template: (a: T|undefined) => void,
    data?: T|undefined
) => R;

export type MatchFnDef = (
    matchNode: Node,
    nameOrCtor: NameOrCtorDef,
    expectedNameOrCtor: NameOrCtorDef,
    key: Key,
    expectedKey: Key
) =>  boolean;

export type PatchConfig = {
  matches?: MatchFnDef,
};
