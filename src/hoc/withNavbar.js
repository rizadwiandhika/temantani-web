import React from "react";
import { Navbar } from "../components";

export function withNavbar(Component) {
  return (props) => (
    <>
      <Navbar />
      <Component {...props} />
    </>
  );
}
