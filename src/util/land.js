export function isOnProposed(status) {
  return ["PROPOSED", "REQUIRES_REVISION", "REVISED"].includes(status);
}

export function alreadyApproved(status) {
  return ["REQUIRES_CLEANING", "AVAILABLE"].includes(status);
}

export function wasRejected(status) {
  return ["REJECTED"].includes(status);
}

export function wasCanceled(status) {
  return ["CANCELED"].includes(status);
}
