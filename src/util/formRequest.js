import { flatened } from "../util";

async function request(url = "", { method = "", token = "", data = {} }) {
  const body = new FormData();

  const flatData = flatened(data);
  for (const [key, value] of flatData) {
    body.append(key, value);
  }

  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  };

  return fetch(url, options);
}

export const formRequest = {
  post: (url = "", { data = {}, token = "" }) =>
    request(url, { token, data, method: "POST" }),
  put: (url = "", { data = {}, token = "" }) =>
    request(url, { token, data, method: "PUT" }),
};
