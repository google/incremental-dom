/**
 * @license
 * Copyright 201• The Incremental DOM Authors. All Rights Reserved.
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
import {calculateDiff} from '../../src/diff';
import {attributes} from '../../src/attributes';
const {expect} = chai;

describe('calculateDiff', () => {
  const updateCtx = {};
  let updateFn: Sinon.SinonSpy;

  beforeEach(() => {
    updateFn = Sinon.spy();
  });

  it('should call the update function for added items', () => {
    const prev: string[] = [];
    const next = ['name1', 'value1', 'name2', 'value2'];

    calculateDiff(prev, next, updateCtx, updateFn, attributes);

    expect(updateFn)
        .to.have.been.calledTwice.to.have.been
        .calledWith(updateCtx, 'name1', 'value1')
        .to.have.been.calledWith(updateCtx, 'name2', 'value2');
  });

  it('should call the update function for removed items', () => {
    const prev = ['name1', 'value1', 'name2', 'value2'];
    const next: string[] = [];

    calculateDiff(prev, next, updateCtx, updateFn, attributes);

    expect(updateFn)
        .to.have.been.calledTwice.to.have.been
        .calledWith(updateCtx, 'name1', undefined)
        .to.have.been.calledWith(updateCtx, 'name2', undefined);
  });

  it('should not call the update function if there are no changes', () => {
    const prev = ['name', 'value'];
    const next = ['name', 'value'];

    calculateDiff(prev, next, updateCtx, updateFn, attributes);

    expect(updateFn).to.have.been.not.called;
  });

  it('should handle items appearing earlier', () => {
    const prev = ['name1', 'value1'];
    const next = ['name2', 'value2', 'name1', 'value1'];

    calculateDiff(prev, next, updateCtx, updateFn, attributes);

    expect(updateFn).to.have.been.calledOnce.to.have.been.calledWith(
        updateCtx, 'name2', 'value2');
  });

  it('should handle changed item ordering', () => {
    const prev = ['name1', 'value1', 'name2', 'value2'];
    const next = ['name2', 'value2', 'name1', 'value1'];

    calculateDiff(prev, next, updateCtx, updateFn, attributes);

    expect(updateFn).to.have.been.not.called;
  });
});
