interface InputProps {
    nombre: string
    tipo: string
    placeholder: string
    onChange: (value: string) => void
}

function Input({ tipo = "text", placeholder = "", onChange }: InputProps) {
    return (
        <div className={`flex flex-col align-center gap-4 pb-3 pt-3`}>
            <input
                className="w-full min-w-0 border-b-[.1px] border-black p-1.5 focus:outline-none font-sans bg-transparent"
                type={tipo}
                placeholder={placeholder}
                required
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default Input