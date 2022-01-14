//  Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
/** @license SPDX-License-Identifier: Apache-2.0 */

export interface ElementConstructor {
  new (): Element;
}

export type AttrMutator = (a: Element, b: string, c: any) => void;

export interface AttrMutatorConfig {
  [x: string]: AttrMutator;
}

export type NameOrCtorDef = string | ElementConstructor;

export type Key = string | number | null | undefined;

export type Statics = Array<{}> | null | undefined;

export type PatchFunction<T, R> = (
  node: Element | DocumentFragment,
  template: (a: T | undefined) => void,
  data?: T | undefined
) => R;

export type MatchFnDef = (
  matchNode: Node,
  nameOrCtor: NameOrCtorDef,
  expectedNameOrCtor: NameOrCtorDef,
  key: Key,
  expectedKey: Key
) => boolean;

export interface PatchConfig {
  matches?: MatchFnDef;
}
