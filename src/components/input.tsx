import { forwardRef } from "react";
import type { InputProps } from "../models/api.models";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({nombre = "" ,tipo = "text", placeholder = "", value, onChange, onBlur, readOnly = false, onKeyDown, max, min}, ref) => {
    return (
      <div className="flex flex-col align-center py-2">
        <label className="text-sm font-bold text-gray-700">{nombre}</label>
        <input
          ref={ref}
          className={`${readOnly ? "cursor-not-allowed " : "focus:border-blue-700 bg-transparent"} w-full min-w-0 border-b-[.1px] border-black p-1.5 focus:outline-none font-sans`}
          type={tipo}
          placeholder={readOnly ? "Datos del sistema" : placeholder }
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