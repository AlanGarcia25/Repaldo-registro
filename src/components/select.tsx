import type { SelectOption } from "../hooks/useSelectApi";

interface SelectProps {
    nombreSelect: string;
    options: SelectOption[]; 
    onChange: (valor: string) => void; 
}

function Select({ nombreSelect, options, onChange }: SelectProps) {
    return (
        <div className={`flex flex-col gap-4 py-3 w-full`}>
            <select 
                defaultValue=""
                onChange={(e) => onChange(e.target.value)}
                className="w-full min-w-0 cursor-pointer border-b border-black p-2 text-sm focus:outline-none focus:border-b-black block font-sans bg-transparent"
            >
                <option value="" selected>{nombreSelect}</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;