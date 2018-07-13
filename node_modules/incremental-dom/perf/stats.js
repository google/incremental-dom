export function filterOutliers(arr) {
  const values = [...arr];
  values.sort(function(a, b) { return a - b });

  const q1 = values[Math.floor((values.length / 4))];
  const q3 = values[Math.ceil((values.length * (3 / 4)))];
  const iqr = q3 - q1;

  const min = q1 - iqr*1.5;
  const max = q3 + iqr*1.5;

  return arr.filter(function(a) { return (min < a) && (a < max) });
}

function sum(arr) {
  return arr.reduce(function(sum, val) { return sum + val }, 0);
}

export function avg(arr) {
  return sum(arr) / arr.length;
}
