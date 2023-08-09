import React from "react";
import { classNames } from "../../util";

const typeStyle = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600",
  secondary:
    "border border-indigo-600 text-indigo-600 hover:opacity-80 focus-visible:outline-indigo-600",
};

/**
 * Renders a label status component.
 * @param {Object} props - The props object.
 * @param {boolean} props.disabled - The disabled status of button.
 * @param {string} props.text - The text of button.
 * @param {string} props.className - The appended classname.
 * @param {'primary'|'secondary'} props.type - The button type.
 * @param {(e: React.MouseEvent<HTMLElement>) => void} props.onClick - The action when clicked.
 * @returns {JSX.Element} The label status component.
 */
export function Button({
  disabled = false,
  text = "",
  className = "",
  type = "primary",
  onClick = (e) => {},
  children,
}) {
  return (
    <button
      className={classNames(
        "rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        typeStyle[type],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {text || children}
    </button>
  );
}
