import React from "react";
import { Link } from "react-router-dom";

import { classNames } from "../../util";

const statusColor = {
  FUNDRAISING: "bg-orange-200 text-orange-600",
  WAITING_FOR_FUNDS: "bg-orange-200 text-orange-600",
  HIRING: "bg-blue-200 text-blue-600",
  ONGOING: "bg-green-200 text-green-600",
  FINISHED: "bg-gray-200 text-gray-600",
};

export function ProjectCard({
  projectId = "779a282c-77a6-4aa9-9cde-a6dd44d5b891",
  startedAt = new Date(),
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisl. Donec euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisl.",
  harvest = "HARVEST",
  status = "ONGOING",
  hideLink = false,
  showFundraisingLink = false,
  link = "",
}) {
  const MAX_DESCIPTION = 128;
  if (description.length > MAX_DESCIPTION) {
    description = description.substring(0, MAX_DESCIPTION) + "...";
  }

  return (
    <div className="p-4 px-8 border border-gray-300 rounded flex text-sm">
      <div className="w-4/5 flex flex-col gap-2">
        <p className="font-semibold">Project {projectId}</p>
        <p className="text-gray-600">{description}</p>
        <p className="text-gray-600">Started at {startedAt.toDateString()}</p>
        {!hideLink && (
          <p>
            <Link
              to={link}
              className="underline hover:pointer hover:text-indigo-600"
            >
              Details
            </Link>
          </p>
        )}
        {showFundraisingLink && (
          <p>
            <Link
              to={`/fundraisings/${projectId}`}
              className="underline hover:pointer hover:text-indigo-600"
            >
              Check fundraising
            </Link>
          </p>
        )}
      </div>
      <div className="w-1/5 flex flex-col gap-2 items-end">
        <p className="font-semibold w-fit">{harvest}</p>
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
