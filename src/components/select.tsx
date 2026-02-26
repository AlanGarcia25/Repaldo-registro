import type { SelectProps } from "../models/api.models";
import { motion } from "motion/react";
import { forwardRef } from "react";

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ nombreSelect, options, value, onChange }, ref) => {
        return (
            <motion.div layout whileTap={{ scale: 0.98 }} className="flex flex-col py-2 w-full group">
                <motion.label
                    animate={{ color: value ? "#193cb8" : "#374151" }}
                    className="text-sm 2xl:text-lg font-bold transition-colors">
                    {nombreSelect} {value && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}></motion.span>}
                </motion.label>

                <div className="relative">
                    <select
                        ref={ref}
                        className={`italic 2xl:text-lg border-b-2 2xl:border-b-3 w-full min-w-0 p-1.5 truncate font-sans bg-transparent transition-all duration-300 focus:border-blue-500 cursor-pointer outline-none focus:outline-none focus:ring-0
                        ${value ? 'border-blue-800' : 'border-gray-500'}`
                        }
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        <option value="" disabled hidden>Seleccione una opción</option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="text-black">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </motion.div>
        );
    });

export default Select;