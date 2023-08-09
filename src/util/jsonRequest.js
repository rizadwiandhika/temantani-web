async function request({ url = "", method = "GET", token = "", body = {} }) {
  const APPLICATION_JSON = "application/json";
  const options = {
    method,
    headers: {
      "Content-Type": APPLICATION_JSON,
      // Accept: APPLICATION_JSON,
      Authorization: `Bearer ${token}`,
    },
  };

  if (["PUT", "POST"].includes(method)) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options);
}

export const jsonRequest = {
  get: (url = "", { token = "" }) => request({ url, token }),
  post: (url = "", { body = {}, token = "" }) =>
    request({ url, token, body, method: "POST" }),
  put: (url = "", { body = {}, token = "" }) =>
    request({ url, token, body, method: "PUT" }),
};
