export const roles = {
  ADMIN_SUPER: "ADMIN_SUPER",
  ADMIN_LANDOWNER: "ADMIN_LANDOWNER",
  ADMIN_PROJECT: "ADMIN_PROJECT",
  BUYER: "BUYER",
  INVESTOR: "INVESTOR",
  LANDOWNER: "LANDOWNER",
  WORKER: "WORKER",
};

export function isAdmin(role) {
  if (typeof role === "string") {
    return role.startsWith("ADMIN");
  }

  if (Array.isArray(role)) {
    return role.some((r) => r.startsWith("ADMIN"));
  }

  throw new Error("Unknown type for for");
}
