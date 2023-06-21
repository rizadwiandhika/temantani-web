import React from "react";

export function ArticleContent({ title = "", children }) {
  return (
    <div className="w-11/12 max-w-3xl mx-auto my-8">
      <h3 className="font-bold text-xl">{title}</h3>
      <hr className="mt-4 mb-8" />
      {children}
    </div>
  );
}
