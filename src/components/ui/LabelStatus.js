import React from "react";
import { classNames } from "../../util";

const colorMap = {
  red: "bg-red-200 text-red-600",
  yellow: "bg-yellow-200 text-yellow-600",
  green: "bg-green-200 text-green-600",
};

const spaceXMap = {
  nospace: "mx-0",
  normal: "mx-2",
  wide: "bg-green-200 text-green-600",
};

/**
 * Renders a label status component.
 * @param {Object} props - The props object.
 * @param {string} props.status - The status text.
 * @param {'red'|'yellow'|'green'} props.color - The color of the label.
 * @param {'nospace'|'normal'|'wide'} props.spaceX - The horizontal spacing of the label.
 * @returns {JSX.Element} The label status component.
 */
export function LabelStatus({ status = "", color = "", spaceX = "" }) {
  color = color || "green";
  spaceX = spaceX || "normal";

  return (
    <span
      className={classNames(
        "py-1 px-2 rounded text-sm",
        spaceXMap[spaceX],
        colorMap[color],
      )}
    >
      {status}
    </span>
  );
}
