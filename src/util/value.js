export function value(callback) {
  return (e) => callback(e.target.value);
}
