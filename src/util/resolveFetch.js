export async function resolveFetch(promise = new Promise()) {
  const response = await promise;
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }
  return data;
}
