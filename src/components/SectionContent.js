import React from "react";
import { classNames } from "../util";

export function SectionContent({
  title = "",
  noBold = false,
  children = null,
  className = "",
}) {
  return (
    <div className={classNames("my-8", className)}>
      {title !== "" && (
        <>
          <p className={classNames(noBold ? "text-gray-500" : "font-bold")}>
            {title}
          </p>
          <hr className="border border-gray-200 my-2 mb-4" />
        </>
      )}
      <div>{children}</div>
    </div>
  );
}
