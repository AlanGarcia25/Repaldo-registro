import { forwardRef } from "react";
import type { InputProps } from "../models/api.models";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ tipo = "text", placeholder = "", value, onChange, onBlur, readOnly = false }, ref) => {
    return (
      <div className="flex flex-col align-center gap-4 pb-3 pt-3">
        <input
          ref={ref} // Ahora la ref funciona correctamente
          className="w-full min-w-0 border-b-[.1px] border-black p-1.5 focus:outline-none font-sans bg-transparent focus:border-blue-700"
          type={tipo}
          placeholder={placeholder}
          value={value ?? ""}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur && onBlur(e.target.value)}
        />
      </div>
    );
  }
);

export default Input;