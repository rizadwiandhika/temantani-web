export function decodeJwtPayload(token) {
  const base64UrlPayload = token.split(".")[1]; // Extract the payload part of the JWT
  const base64Payload = base64UrlPayload.replace(/-/g, "+").replace(/_/g, "/"); // Replace URL-safe characters
  const jsonPayload = decodeURIComponent(
    atob(base64Payload)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  ); // Decode Base64 and handle URI encoding

  return JSON.parse(jsonPayload); // Parse JSON payload
}
