
interface InputProps {
    nombre: string
    tipo: string
    sizeBoton: string
    placeholder: string
    onChange: (value: string) => void
}

function Input({ tipo = "text", placeholder = "", onChange, sizeBoton }: InputProps) {

    return (
        <div className={`flex flex-col align-center mx-auto gap-4 pb-3 pt-3 ${sizeBoton}`}>
            <input
                className="peer bg-[#FAF5F5] border-b-[.1px] p-1.5 focus:outline-none font-sans"
                type={tipo}
                placeholder={placeholder}
                required
                onChange={(e) => onChange(e.target.value)}
            />
        </div>

    )
}

export default Input