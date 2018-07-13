export class Samples {
  constructor (count) {
    this.startTime = 0;

    this.data = new Array(count).fill(0);
    this.data.length = 0;
  }

  timeStart() {
    this.startTime = performance.now();
  }

  timeEnd() {
    this.data.push(performance.now() - this.startTime);
  }
}