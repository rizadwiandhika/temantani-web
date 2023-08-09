import React from "react";
import { Link } from "react-router-dom";

const MAX_DESCRIPTION = 128;

export function FundraisingCard({
  fundraisingId = "abcdef",
  picture = "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80",
  harvest = "",
  description = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestias laudantium eos voluptate blanditiis nulla corrupti reprehenderit fugit velit rem libero?",
  collectedFunds = 2000000,
  targetFunds = 5000000,
  deadline = new Date(),
}) {
  if (description.length > MAX_DESCRIPTION) {
    description = description.substring(0, MAX_DESCRIPTION) + "...";
  }
  return (
    <div className="border border-gray-300 p-4 rounded flex gap-4 max-h-48">
      <div className="w-1/3">
        <img
          src={picture}
          alt="fundraising img"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-2/3">
        {harvest !== "" ? (
          <h3 className="font-bold mb-2">
            {harvest}{" "}
            <span className="font-normal text-sm">
              • (Ends at: {deadline.toDateString()})
            </span>
          </h3>
        ) : (
          <h3 className="mb-2 text-sm">(Ends at: {deadline.toDateString()})</h3>
        )}
        <p className="text-sm mb-4">
          Rp{collectedFunds.toLocaleString()} / {targetFunds.toLocaleString()}
        </p>
        <p className="my-2 text-sm text-gray-600">{description}</p>
        <Link
          to={"/fundraisings/" + fundraisingId}
          className="hover:underline text-sm"
        >
          Check details {" >>"}
        </Link>
      </div>
    </div>
  );
}
