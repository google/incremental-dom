/**
 * @license
 * Copyright 2018 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// taze: chai from //third_party/javascript/typings/chai

import * as Sinon from 'sinon';

import {flush, queueChange} from '../../src/changes';

const {expect} = chai;

describe('changes', () => {
  it('should call the update functions for all changes', () => {
    const spyOne = Sinon.spy();
    const spyTwo = Sinon.spy();

    queueChange(spyOne, 'a', 'b', 'c', 'd');
    queueChange(spyTwo, 'd', 'e', 'f', 'g');
    flush();

    expect(spyOne).to.have.been.calledOnce.to.have.been.calledWith(
	'a', 'b', 'c', 'd');
    expect(spyTwo).to.have.been.calledOnce.to.have.been.calledWith(
	'd', 'e', 'f', 'g');
  });

  it('should clear the changes after flush', () => {
    const spy = Sinon.spy();
    queueChange(spy, 'a', 'b', 'c', 'd');
    flush();
    flush();

    expect(spy).to.have.been.calledOnce.to.have.been.calledWith('a', 'b', 'c', 'd');
  });

  it('should allow re-entrant usage', () => {
    const innerSpy = Sinon.spy();
    const outerSpyOne = Sinon.spy(() => {
      queueChange(innerSpy, 'd', 'e', 'f', 'g');
      queueChange(innerSpy, 'g', 'h', 'i', 'j');
      flush();
    });
    const outerSpyTwo = Sinon.spy();

    queueChange(outerSpyOne, 'a', 'b', 'c', 'd');

    queueChange(outerSpyTwo, 'j', 'k', 'l', 'm');
    flush();

    expect(innerSpy)
        .to.have.been.calledTwice.to.have.been.calledWith('d', 'e', 'f', 'g')
        .to.have.been.calledWith('g', 'h', 'i', 'j');
    expect(outerSpyOne)
        .to.have.been.calledOnce.to.have.been.calledWith('a', 'b', 'c', 'd');
    expect(outerSpyTwo)
        .to.have.been.calledOnce.to.have.been.calledWith('j', 'k', 'l', 'm');
  });
});
