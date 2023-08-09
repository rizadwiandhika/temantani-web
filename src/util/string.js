export function camelCaseToCapitalized(str) {
  // Replace capital letters with spaces and capitalize the first letter of each word
  const capitalized = str
    .replace(/([A-Z])/g, " $1")
    .replace(/^\w/, (c) => c.toUpperCase());

  return capitalized;
}
