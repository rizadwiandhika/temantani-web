import React from "react";

export function PictureName({
  picture = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  name = "Jamie Saviola",
}) {
  return (
    <div className="flex gap-4 items-center">
      <img
        src={picture}
        alt="profile pic"
        className="rounded-full object-cover max-h-24"
      />
      <h3 className="font-bold text-2xl">{name}</h3>
    </div>
  );
}
