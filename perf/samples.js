(function(scope) {

  function Samples(count) {
    this.startTime = 0;

    this.data = new Array(count).fill(0);
    this.data.length = 0;
  };

  Samples.prototype = {
    constructor: Stats,

    timeStart: function() {
      this.startTime = performance.now();
    },

    timeEnd: function() {
      this.data.push(performance.now() - this.startTime);
    }
  };

  scope.Samples = Samples;
}(window));
