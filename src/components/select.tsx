import type { SelectProps } from "../models/api.models";

const Select = ({ nombreSelect, options, value, onChange, readOnly = false }: SelectProps) => {
    return (
        <div className="flex flex-col align-center py-2">
            <label className="text-sm font-bold text-gray-700">{nombreSelect}</label>
            <select
                className="italic border-b-[.1px] w-full min-w-0 p-1.5 border-black font-sans bg-transparent focus:border-blue-700 outline-none"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                disabled={readOnly}
            >
                <option value="" disabled hidden>Seleccione una opción</option>
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