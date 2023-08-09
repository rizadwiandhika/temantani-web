import { Navigate } from "react-router-dom";
import { token as tokenStorage, roles } from "../util";

const {
  ADMIN_SUPER,
  ADMIN_LANDOWNER,
  ADMIN_PROJECT,
  BUYER,
  INVESTOR,
  LANDOWNER,
  WORKER,
} = roles;

const redirectMap = {
  [ADMIN_SUPER]: "/admin/register",
  [ADMIN_LANDOWNER]: "/admin/lands",
  [ADMIN_PROJECT]: "/admin/projects",
  [BUYER]: "/profile",
  [INVESTOR]: "/fundraisings",
  [LANDOWNER]: "/lands",
  [WORKER]: "/profile",
};
export function HomePage() {
  const [role, role2] = tokenStorage.getRoles();
  return <Navigate to={redirectMap[role2 || role]} />;
}
