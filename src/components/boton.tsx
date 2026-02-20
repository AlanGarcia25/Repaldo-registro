import type { BotonProps } from "../models/api.models";

function Boton({ nombreBoton, color, disabled, onClick }: BotonProps) {
    return (
        <div className="flex flex-col w-full align-center mx-auto gap-4 pb-4 pt-4 max-w[120px] truncate" >
            <button
                className={`transition duration-300 delay-10 w-full 2xl:h-12 py-2 px-4 rounded-md text-base 2xl:text-lg ${color} text-white`}
                onClick={onClick}
                disabled={disabled}
                type="submit"
            >
                {nombreBoton}
            </button>
        </div>
    );
};

export default Boton;