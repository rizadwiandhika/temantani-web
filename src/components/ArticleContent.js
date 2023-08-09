import React from "react";
import { classNames } from "../util";

export function ArticleContent({ title = "", children, className = "" }) {
  let header =
    title === "" ? null : (
      <>
        <h3 className="font-bold text-xl">{title}</h3>
        <hr className="mt-4 mb-8" />
      </>
    );

  return (
    <div className={classNames("w-11/12 max-w-3xl mx-auto my-8", className)}>
      {header}
      {children}
    </div>
  );
}
