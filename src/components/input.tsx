import type { InputProps } from "../models/api.models";
import { memo } from "react";
import { motion } from "motion/react";
import { clicVariant, inputsVariant } from "../styles/motionVariantes";

const Input = memo(({ nombre, tipo, placeholder, value, onChange, onBlur, readOnly = false, onKeyDown }: InputProps) => {

  const colorAzulFuerte = "#193cb8";

  return (
    <motion.div variants={clicVariant} whileTap={readOnly ? '' : 'whileTap'} className="flex flex-col align-center py-2">
      <motion.label
        animate={{ color: value ? colorAzulFuerte : "#374151" }}
        className="text-sm 2xl:text-lg font-bold transition-colors">
        {nombre}
      </motion.label>
      <motion.input
        variants={inputsVariant}
        animate={{
          borderColor: value ? "#193cb8" : "oklch(55.1% 0.027 264.364)"
        }}
        whileFocus={readOnly ? '' : 'focused'}
        type={tipo}
        value={value ?? ""}
        readOnly={readOnly}
        onKeyDown={onKeyDown}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur && onBlur(e.target.value)}
        placeholder={readOnly
          ? "Datos completados por el sistema"
          : placeholder}
        className={`${readOnly
          ? "cursor-not-allowed text-gray-600"
          : "bg-transparent"} 
               xl:placeholder:text-base 2xl:placeholder:text-lg truncate w-full min-w-0 border-b-2 2xl:border-b-3 p-1.5 pl-2.5 focus:outline-none font-sans placeholder:italic`}
      />
    </motion.div>
  );
}
);

export default Input;