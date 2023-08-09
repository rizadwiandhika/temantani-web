import { Navigate } from "react-router-dom";
import { ErrorView } from "../pages";
import { token as tokenStorage } from "../util";

export function withAuth(Component, ...roles) {
  return (props) => {
    const token = tokenStorage.get();
    const userRoles = tokenStorage.getRoles();
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    if (
      roles.length > 0 &&
      !userRoles.some((userRole) => roles.includes(userRole))
    ) {
      return <ErrorView.NotFoundPage />;
    }

    return <Component {...props} />;
  };
}
