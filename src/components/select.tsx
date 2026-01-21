interface SelectProps {
    nombreSelect: string;
    options: { value: string | number; label: string }[];
    value?: string | number; 
    onChange: (val: string) => void;
}

const Select = ({ nombreSelect, options, value, onChange }: SelectProps) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-bold ">{nombreSelect}</label>
            <select
                className="border-b-[.1px] border-black p-2 bg-transparent focus:border-blue-700 outline-none"
                value={value || ""} 
                // cambiar a value={value || ""}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="" disabled>Seleccione una opción</option>
                
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