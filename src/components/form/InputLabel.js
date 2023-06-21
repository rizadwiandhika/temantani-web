import React, { useId } from "react";
import { classNames } from "../../util";

export default function InputLabel({
  id = "",
  label = "Label",
  type = "text",
  placeholder = "value",
  value = "",
  onChange = () => {},
  required = false,
  readOnly = false,
}) {
  const defaultId = useId();
  id = id || defaultId;
  return (
    <div>
      <label htmlFor={id} className="block text-sm leading-6 text-gray-500">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={label}
          placeholder={placeholder}
          type={type}
          readOnly={readOnly}
          required={required}
          value={value}
          onChange={onChange}
          className={classNames(
            "block w-full my-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            readOnly && "bg-gray-100 cursor-not-allowed opacity-50",
          )}
        />
      </div>
    </div>
  );
}
