import React, { useId } from "react";

export function InputFileButton({
  id = "",
  label = "",
  onChange = () => {},
  innerRef = null,
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
          // ref={innerRef}
          onChange={onChange}
          type="file"
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-violet-300 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 hover:cursor-pointer"
        />
      </div>
    </div>
  );
}
