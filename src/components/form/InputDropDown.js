import React, { useId } from "react";

export function InputDropDown({
  id = "",
  label = "Label",
  options = [
    { value: "opt 1", display: "Option 1" },
    { value: "opt 2", display: "Option 2" },
  ],
  value = "",
  onChange = () => {},
}) {
  const defaultId = useId();
  id = id || defaultId;

  return (
    <div>
      <label htmlFor={id} className="block text-sm leading-6 text-gray-500">
        {label}
      </label>
      <div className="mt-2">
        <select
          name={id}
          id={id}
          value={value}
          onChange={onChange}
          className="rounded text-xs border-gray-300 focus:border-indigo-600"
        >
          {options.map((op) => (
            <option key={op.value} value={op.value}>
              {op.display}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
