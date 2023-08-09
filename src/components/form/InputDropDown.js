import React, { useId } from "react";

/**
 * Renders an input drop-down component.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID attribute of the input drop-down.
 * @param {string} props.label - The label text for the input drop-down.
 * @param {Array<Record<'value'|'display', string>>} props.options - The array of options for the drop-down.
 * @param {string} props.value - The currently selected value of the drop-down.
 * @param {(e: React.MouseEvent<HTMLElement>) => void} props.onChange - The function to handle the change event of the drop-down.
 * @returns {JSX.Element} The input drop-down component.
 */
export function InputDropDown({
  id = "",
  label = "Label",
  options = [
    { value: "opt 1", display: "Option 1" },
    { value: "opt 2", display: "Option 2" },
  ],
  value = "",
  onChange = (e) => {},
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
