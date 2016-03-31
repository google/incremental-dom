(function(scope) {
  function filterOutliers(arr) {
    var values = [].concat(arr);
    values.sort(function(a, b) { return a - b });

    var q1 = values[Math.floor((values.length / 4))];
    var q3 = values[Math.ceil((values.length * (3 / 4)))];
    var iqr = q3 - q1;

    var min = q1 - iqr*1.5;
    var max = q3 + iqr*1.5;

    return arr.filter(function(a) { return (min < a) && (a < max) });
  }

  function sum(arr) {
    return arr.reduce(function(sum, val) { return sum + val }, 0);
  }

  function avg(arr) {
    return sum(arr) / arr.length;
  }

  scope.Stats = {
    filterOutliers: filterOutliers,
    avg: avg
  };
}(window));
