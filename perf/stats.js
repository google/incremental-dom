(function(scope) {
  function filterOutliers(arr) {
    var values = [].concat(arr);
    values.sort((a, b) => a - b);

    var q1 = values[Math.floor((values.length / 4))];
    var q3 = values[Math.ceil((values.length * (3 / 4)))];
    var iqr = q3 - q1;

    var min = q1 - iqr*1.5;
    var max = q3 + iqr*1.5;

    return arr.filter((a) => (min < a) && (a < max));
  }

  function sum(arr) {
    return arr.reduce((sum, val) => sum + val);
  }

  function avg(arr) {
    return sum(arr) / arr.length;
  }

  scope.Stats = {
    filterOutliers: filterOutliers,
    avg: avg
  };
}(window));
