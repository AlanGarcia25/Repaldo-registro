import type { BotonProps } from "../models/api.models";

function Boton({ nombreBoton, color, disabled, onClick }: BotonProps) {
    return (
        <div className="flex flex-col w-full align-center mx-auto gap-4 pb-4 pt-4 max-w[120px] truncate" >
            <button
                className={`w-full py-2 px-4 rounded-md ${color} text-white`}
                onClick={onClick}
                disabled={disabled}
                type="submit">
                {nombreBoton}
            </button>
        </div>
    );
};

export default Boton;