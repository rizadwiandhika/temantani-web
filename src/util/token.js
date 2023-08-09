import { decodeJwtPayload } from "./decodeJwtPayload";

export function get() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const { jwt = "", exp } = JSON.parse(token);
  if (Date.now() >= exp * 1000) {
    localStorage.removeItem("token");
    return null;
  }

  return jwt;
}

export function getRoles() {
  const jwt = get();
  const { roles = [] } = decodeJwtPayload(jwt);
  return roles;
}

export function set(token = "") {
  const { exp } = decodeJwtPayload(token);
  localStorage.setItem("token", JSON.stringify({ jwt: token, exp }));
}

export function getUserId() {
  const token = get();
  if (!token) return null;

  const { sub } = decodeJwtPayload(token);
  return sub;
}
