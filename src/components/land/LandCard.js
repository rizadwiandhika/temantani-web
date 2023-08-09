import React from "react";
import { Link } from "react-router-dom";
import { LabelStatus } from "../../components";

const statusColorMap = {
  AVAILABLE: "green",
  REQUIRES_CLEANING: "green",
  REJECTED: "red",
  CANCELED: "red",
};

export function LandCard({
  picture = "https://images.unsplash.com/photo-1558871585-4c3574a1b7cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80",
  ownerId = "",
  proposedAt,
  city = "Jakarta",
  street = "Jl. Klampis Jaya Sawangan Ngasem No.35",
  postalCode = "16436",
  areaInHectares = 15,
  status = "PROPOSED",
  hideLink = false,
  link = "",
}) {
  return (
    <div className="border border-gray-300 p-4 rounded flex gap-4 max-h-48">
      <div className="w-1/3 ">
        <img
          src={picture}
          alt="fundraising img"
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold mb-2">
          {city}{" "}
          <LabelStatus
            color={statusColorMap[status] || "yellow"}
            status={status}
          />
        </h3>

        <div className="text-sm my-2 space-y-2 text-gray-600">
          <p>
            {street}, {city}, {postalCode}
          </p>
          <p className="mb-2 ">{areaInHectares} Hectares</p>
          {ownerId !== "" && <p>Landowner: {ownerId}</p>}
          {proposedAt && <p>Proposed at {proposedAt.toDateString()}</p>}
        </div>

        <div className="h-full flex items-end">
          {!hideLink && (
            <Link
              to={link}
              className="w-fit hover:underline text-sm text-indigo-600"
            >
              Check details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
