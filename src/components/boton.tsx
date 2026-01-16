interface BotonProps {
    nombreBoton: string
    color: string
    nombreUsuario: string
    password: string
    onChange: (value1: string, value2: string) => void
    onClick?: () => void
}

function Boton({ nombreBoton, color, onChange, nombreUsuario, password }: BotonProps) {
    return (
        <div className="flex flex-col w-full align-center mx-auto gap-4 pb-3 pt-3">
            <button className={`w-full py-2 px-4 rounded-md ${color}`} onClick={() => onChange(nombreUsuario, password)}>
                {nombreBoton}
            </button>
        </div>
    )
}

export default Boton