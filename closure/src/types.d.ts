/** @license SPDX-License-Identifier: Apache-2.0 */
export interface ElementConstructor {
    new (): Element;
}
export declare type AttrMutator = (a: Element, b: string, c: any) => void;
export interface AttrMutatorConfig {
    [x: string]: AttrMutator;
}
export declare type NameOrCtorDef = string | ElementConstructor;
export declare type Key = string | number | null | undefined;
export declare type Statics = Array<{}> | null | undefined;
export declare type PatchFunction<T, R> = (node: Element | DocumentFragment, template: (a: T | undefined) => void, data?: T | undefined) => R;
export declare type MatchFnDef = (matchNode: Node, nameOrCtor: NameOrCtorDef, expectedNameOrCtor: NameOrCtorDef, key: Key, expectedKey: Key) => boolean;
export interface PatchConfig {
    matches?: MatchFnDef;
}
