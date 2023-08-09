import React from "react";
import { Link } from "react-router-dom";

export function ExpenseCard({
  name = "",
  description = "",
  date = new Date(),
  amount = 0,
  invoiceLink = "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80",
}) {
  return (
    <div className="p-4 px-8 border border-gray-300 rounded flex text-sm">
      <div className="w-4/5 flex flex-col gap-2">
        <p className="font-semibold">{name}</p>
        <p className="text-gray-600">{description}</p>
        <p className="text-gray-600">{date.toDateString()}</p>
      </div>
      <div className="w-1/5 flex flex-col gap-2 items-end">
        <p className="font-semibold w-fit">Rp{amount.toLocaleString()}</p>
        {invoiceLink !== "" && (
          <p>
            <Link
              to={invoiceLink}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              See invoice
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
