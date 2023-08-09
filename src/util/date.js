export function dateToISOWithOffset(date) {
  date = new Date(date);
  const isoString = date.toISOString();
  const offsetString = date.getTimezoneOffset();
  const offsetHours = Math.abs(Math.floor(offsetString / 60))
    .toString()
    .padStart(2, "0");
  const offsetMinutes = (Math.abs(offsetString) % 60)
    .toString()
    .padStart(2, "0");
  const offsetSign = offsetString < 0 ? "+" : "-";

  return isoString.replace("Z", `${offsetSign}${offsetHours}:${offsetMinutes}`);
}

function main() {
  console.log(dateToISOWithOffset(new Date()));
}

main();
