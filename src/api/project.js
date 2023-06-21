const host = "http://127.0.0.1:8283";

export async function getDetailProject(token = "", id = "") {
  const url = `${host}/projects/${id}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }
  return data;
}
