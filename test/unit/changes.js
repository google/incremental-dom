/**
 * Copyright 2017 The Incremental DOM Authors. All Rights Reserved.
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

import {
  queueChange, flush
} from '../../src/changes';

describe('changes', () => {
  it('should call the update functions for all changes', () => {
    const spyOne = sinon.spy();
    const spyTwo = sinon.spy();

    queueChange(spyOne, 'a', 'b', 'c');
    queueChange(spyTwo, 'd', 'e', 'f');
    flush();

    expect(spyOne)
      .to.have.been.calledOnce
      .to.have.been.calledWith('a', 'b', 'c');
    expect(spyTwo)
      .to.have.been.calledOnce
      .to.have.been.calledWith('d', 'e', 'f');
  });

  it('should clear the changes after flush', () => {
    const spy = sinon.spy();

    queueChange(spy, 'a', 'b', 'c');
    flush();
    flush();

    expect(spy)
      .to.have.been.calledOnce
      .to.have.been.calledWith('a', 'b', 'c');
  });

  it('should allow re-entrant usage', () => {
    const innerSpy = sinon.spy();
    const outerSpyOne = sinon.spy(() => {
      queueChange(innerSpy, 'd', 'e', 'f');
      queueChange(innerSpy, 'g', 'h', 'i');
      flush();
    });
    const outerSpyTwo = sinon.spy();

    queueChange(outerSpyOne, 'a', 'b', 'c');
    queueChange(outerSpyTwo, 'j', 'k', 'l');
    flush();

    expect(innerSpy)
      .to.have.been.calledTwice
      .to.have.been.calledWith('d', 'e', 'f')
      .to.have.been.calledWith('g', 'h', 'i');
    expect(outerSpyOne)
      .to.have.been.calledOnce
      .to.have.been.calledWith('a', 'b', 'c');
    expect(outerSpyTwo)
      .to.have.been.calledOnce
      .to.have.been.calledWith('j', 'k', 'l');
  });
});

