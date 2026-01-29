import { forwardRef } from "react";
import type { InputProps } from "../models/api.models";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({nombre = "" ,tipo = "text", placeholder = "", value, onChange, onBlur, readOnly = false, onKeyDown, max, min}, ref) => {
    return (
      <div className="flex flex-col align-center pb-3 pt-3">
        <label className="text-sm py- font-bold text-gray-700">{nombre}</label>
        <input
          ref={ref}
          className="w-full min-w-0 border-b-[.1px] border-black p-1.5 focus:outline-none font-sans bg-transparent focus:border-blue-700"
          type={tipo}
          placeholder={placeholder}
          value={value ?? ""}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur && onBlur(e.target.value)}
          onKeyDown={onKeyDown}
          max={max}
          min={min}
        />
      </div>
    );
  }
);

export default Input;