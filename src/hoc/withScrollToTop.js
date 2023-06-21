import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export function withScrollToTop(Component) {
  return (props) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);

    return <Component {...props} />;
  };
}
