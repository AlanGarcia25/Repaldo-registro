interface InputProps {
    nombre: string;
    tipo: string;
    placeholder: string;
    value?: string | number;
    onChange: (value: string) => void;
    onBlur?: (value: string) => void; 
}

function Input({ tipo = "text", placeholder = "", value, onChange, onBlur }: InputProps) {
    return (

        <div className={`flex flex-col align-center gap-4 pb-3 pt-3`}>
            
            <input
                className="w-full min-w-0 border-b-[.1px] border-black p-1.5 focus:outline-none font-sans bg-transparent focus:border-blue-700 focus:outline-hidde"
                type={tipo}
                placeholder={placeholder}
                value={value ?? ""} 
                required
                onChange={(e) => onChange(e.target.value)}
                onBlur={(e) => onBlur && onBlur(e.target.value)} 
            />

        </div>

    )
}

export default Input;