import type { InputProps } from "../models/api.models";
import { forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ nombre = "", tipo = "text", placeholder = "", value, onChange, onBlur, readOnly = false, onKeyDown }, ref) => {
    return (
      <div className="flex flex-col align-center py-2 ">
        <label className="text-sm font-bold text-gray-700"> {nombre} </label>
        <input
          ref={ref}
          type={tipo}
          value={value ?? ""}
          readOnly={readOnly}
          onKeyDown={onKeyDown}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur && onBlur(e.target.value)}
          placeholder={readOnly
            ? "Datos del sistema"
            : placeholder}
          className={`${readOnly
            ? "cursor-not-allowed text-gray-600"
            : "focus:border-blue-700 bg-transparent"} 
            truncate w-full min-w-0 border-b-[.1px] border-black p-1.5 focus:outline-none font-sans placeholder:italic`}
        />
      </div>
    );
  }
);

export default Input;