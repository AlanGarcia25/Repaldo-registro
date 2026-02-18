import type { SelectProps } from "../models/api.models";

const Select = ({ nombreSelect, options, value, onChange, readOnly = false }: SelectProps) => {
    return (
        <div className="flex flex-col py-2 w-full">
            <label className="text-sm 2xl:text-lg font-bold text-gray-700">{nombreSelect}</label>
            <select
                className="italic 2xl:text-lg 2xl:border-b-3 border-b-2 w-full min-w-0 p-1.5 border-gray-500 font-sans bg-transparent transition duration-300 delay-10 focus:border-blue-600 outline-none"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                disabled={readOnly}
            >
                <option  value="" disabled hidden>Seleccione una opción</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;