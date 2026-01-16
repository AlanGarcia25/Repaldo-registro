interface InputProps {
    nombre: string
    tipo?: string
    placeholder?: string
    value: string
    onChange: (value: string) => void
}

function Input({ tipo = "text", placeholder = "Ingresa texto", value, onChange }: InputProps) {
    return (
        <div className="flex flex-col w-full align-center mx-auto gap-4 pb-3 pt-3">
            <input 
                className="bg-[#E8E6E6] border-b-[.1px] p-2 focus:outline-none font-sans"
                type={tipo}
                placeholder={placeholder}
                value={value}
                required
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default Input