import { Navigate } from "react-router-dom";
import { token } from "../util";

export function withAuth(Component) {
  return (props) => {
    const jwt = token.get();
    if (!jwt) return <Navigate to="/login" replace />;

    return <Component {...props} />;
  };
}
