import { motion } from "motion/react";
import type { SelectProps } from "../models/api.models";

const Select = ({ nombreSelect, options, value, onChange, empresasVacio = false }: SelectProps) => {
    return (
        <motion.div layout whileTap={{ scale: 0.98 }} className="flex flex-col py-2 w-full group">
            <motion.label
                animate={{
                    color: empresasVacio
                        ? "#ef4444" : value
                            ? "#193cb8" : "#374151"
                }}
                className="text-sm 2xl:text-lg font-bold transition-colors">
                {nombreSelect}
            </motion.label>
            <div className="relative flex items-center">
                <select
                    className={`${empresasVacio ? 'appearance-none cursor-not-allowed' : 'cursor-pointer'} 
                        italic text-base 2xl:text-xl border-b-2 2xl:border-b-3 w-full min-w-0 p-1.5 2xl:p-2 pr-5 text-ellipsis font-sans bg-transparent transition-all duration-300 focus:border-blue-500 outline-none focus:outline-none focus:ring-0
                        ${empresasVacio
                            ? 'border-red-500 text-red-600'
                            : value
                                ? 'border-blue-800'
                                : 'border-gray-500'}`}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={empresasVacio}>
                    <option value="" disabled hidden>
                        {empresasVacio ? " Error al cargar empresas" : "Seleccione una opción"}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="text-black italic-none">
                            {opt.label}
                        </option>
                    ))}
                </select>

                {empresasVacio && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>

                    </motion.div>
                )}
            </div>
        </motion.div >
    );
};

export default Select;