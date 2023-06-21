import React from "react";
import { classNames } from "../../util";

export function SectionContent({ title = "", noBold, children = null }) {
  return (
    <div className="my-8">
      <p className={classNames(noBold ? "text-gray-500" : "font-bold")}>
        {title}
      </p>
      <hr className="border border-gray-200 my-2 mb-4" />
      <div>{children}</div>
    </div>
  );
}
