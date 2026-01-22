interface BotonProps {
    nombreBoton: string;
    color: string;
    disabled?:  boolean;
    onClick?: () => void;
}

function Boton({ nombreBoton, color, disabled , onClick }: BotonProps) {
    return (
        <div className="flex flex-col w-full align-center mx-auto gap-4 pb-4 pt-4 " >
            <button
                className={`w-full py-2 px-4 rounded-md ${color} text-white`}
                onClick={onClick}
                disabled={disabled}
            >
                {nombreBoton}
            </button>
        </div>
    )
}

export default Boton;