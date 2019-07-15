import {truncateArray} from './util';


// tslint:disable-next-line:no-any TODO(tomnguyen): Make this a struct[].
const buffer: any[] = [];

let bufferStart = 0;


/**
 * TODO(tomnguyen): This is a bit silly and really needs to be better typed.
 */
function queueChange<A, B, C>(
    fn: (a: A, b: B, c: C) => undefined, a: A, b: B, c: C) {
  buffer.push(fn);
  buffer.push(a);
  buffer.push(b);
  buffer.push(c);
}


/**
 * Flushes the changes buffer, calling the functions for each change.
 */
function flush() {
  // A change may cause this function to be called re-entrantly. Keep track of
  // the portion of the buffer we are consuming. Updates the start pointer so
  // that the next call knows where to start from.
  const start = bufferStart;
  const end = buffer.length;

  bufferStart = end;

  for (let i = start; i < end; i += 4) {
    // tslint:disable-next-line:no-any
    const fn = buffer[i] as (a: any, b: any, c: any) => undefined;
    fn(buffer[i + 1], buffer[i + 2], buffer[i + 3]);
  }

  bufferStart = start;
  truncateArray(buffer, start);
}


export {
  queueChange,
  flush,
};
