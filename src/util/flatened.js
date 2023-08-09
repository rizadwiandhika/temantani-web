function isArray(value) {
  return Array.isArray(value);
}

function isObjectLiteral(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function combine(parentKey, combined, value) {
  if (isArray(value)) {
    throw new Error("Value cannot be an array");
  }

  if (!isObjectLiteral(value)) {
    combined[parentKey] = value;
    return;
  }

  for (const key in value) {
    const element = value[key];
    combined[parentKey + "." + key] = element;
  }
}

function flatenedObject(value) {
  if (!(isArray(value) || isObjectLiteral(value))) {
    throw new Error("value must be object or array. found: " + value);
  }

  const flat = {};

  if (isArray(value)) {
    const tmp = {};
    value.forEach((element, index) => (tmp[index] = element));
    value = tmp;
  }

  for (const key in value) {
    let element = value[key];

    if (isArray(element) || isObjectLiteral(element)) {
      element = flatenedObject(element);
    }

    combine(key, flat, element);
  }

  return flat;
}

export function flatened(value) {
  value = flatenedObject(value);
  const arr = [];
  for (const key in value) {
    const element = value[key];
    arr.push([key.replace(/(\d\.)|(\.\d)/g, ""), element]);
  }
  return arr;
}
