import type { SelectProps } from "../models/api.models";
import { motion } from "motion/react";

const Select = ({ nombreSelect, options, value, onChange }: SelectProps) => {
    return (
        <motion.div layout whileTap={{ scale: 0.98 }} className="flex flex-col py-2 w-full group">
            <motion.label 
                animate={{ color: value ? "#2563eb" : "#374151" }}
                className="text-sm 2xl:text-lg font-bold transition-colors">
                {nombreSelect}
            </motion.label>
            
            <div className="relative">
                <select
                    className="italic 2xl:text-lg border-b-2 2xl:border-b-3 w-full min-w-0 p-1.5 border-gray-500 font-sans bg-transparent transition-all duration-300 focus:border-blue-600 outline-none cursor-pointer "
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
};
export default Select;