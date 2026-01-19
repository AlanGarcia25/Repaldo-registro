interface BotonProps {
    nombreBoton: string;
    color: string;
    onClick?: () => void;
}

function Boton({ nombreBoton, color, onClick }: BotonProps) {
    return (
        <div className="flex flex-col w-full align-center mx-auto gap-4 pb-3 pt-3 " >
            <button 
                className={`w-full py-2 px-4 rounded-md ${color}`} 
                onClick={onClick}    
            >
                {nombreBoton}
            </button>
        </div>
    )
}

export default Boton;