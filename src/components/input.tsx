import type { InputProps } from "../models/api.models";
import { forwardRef } from "react";
import { motion } from "motion/react";
import { inputsVariant } from "../styles/motionVariantes";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ nombre, tipo, placeholder, value, onChange, onBlur, readOnly = false, onKeyDown }, ref) => {
    return (
      <div className="flex flex-col align-center py-2">
        <motion.label animate={{ color: value ? "#2563eb" : "#374151" }}
          className="text-sm 2xl:text-lg font-bold transition-colors" >
          {nombre}
        </motion.label>
        <motion.input
          variants={inputsVariant}
          initial="initial"
          whileFocus={readOnly ? '' : 'focused'}
          transition={{ duration: 0.3 }}
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
            : " bg-transparent"} 
            placeholder:text-sm xl:placeholder:text-base 2xl:placeholder:text-lg truncate w-full min-w-0 border-b-2 2xl:border-b-3 border-gray-500 p-1.5 focus:outline-none font-sans placeholder:italic `}
        />
      </div>
    );
  }
);

export default Input;