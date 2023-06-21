import React from "react";
import { Link } from "react-router-dom";

import { classNames } from "../../util";

const statusColor = {
  PENDING: "bg-orange-200 text-orange-600",
  PAID: "bg-green-200 text-green-600",
  CANCELED: "bg-red-200 text-red-600",
};

export function InvestmentCard({
  investmentId = "06147b1a-5f84-433b-9842-eabd86694656",
  projectId = "659487e7-1059-4b68-bf70-850f3180ec36",
  date = new Date(),
  amount = 1000000,
  status = "PENDING",
  hideLink = false,
}) {
  return (
    <div className="p-4 px-8 border border-gray-300 rounded flex text-sm">
      <div className="w-4/5 flex flex-col gap-2">
        <p className="font-semibold">Investment {investmentId}</p>
        <p className="text-gray-600">Created for project: {projectId}</p>
        <p className="text-gray-600">{date.toDateString()}</p>
        {!hideLink && (
          <p>
            <Link to={`/Investments/${investmentId}`} className="underline">
              Details
            </Link>
          </p>
        )}
      </div>
      <div className="w-1/5 flex flex-col gap-2 items-end">
        <p className="font-semibold w-fit">Rp {amount.toLocaleString()}</p>
        <p
          className={classNames(
            "p-1 px-2 rounded w-fit font-semibold",
            statusColor[status],
          )}
        >
          {status}
        </p>
      </div>
    </div>
  );
}
