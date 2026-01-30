import { api } from "../services/api.config";
import { useEmpleado } from "../context/EmpleadoContext";

function EnviarEmpleado() {
    const { datos, huellaBase64, firmaBase64 } = useEmpleado();

    const camposRequeridos = [
        datos.empleadoId,
        datos.empleadoNombre,
        datos.apellidoPaterno,
        datos.empleadoCURP,
        datos.empleadoRFC,
        datos.fechaNacimiento,
        datos.sexo,
        datos.estadoCivil,
        datos.domicilio,
    ];

    const hayCamposVacios = camposRequeridos.some( (campo) => !campo || campo.toString().trim() === "" );

    const deshabilitado =
        hayCamposVacios || !huellaBase64 || !firmaBase64;

    const handleEnviar = async () => {
        if (deshabilitado) {
            alert("❌ Ningún campo debe estar vacío");
            return;
        }

        const payload = {
            ...datos,
            huellaBase64,
            firmaBase64,};

        try {
            await api.post("/agrosmart/ags_empleado/guardar", payload); // --------
            alert("✅ Empleado enviado correctamente");
        } catch (error) {
            console.error(error);
            alert("❌ Error al enviar empleado");
        }
    };

    return (
        <div className="flex flex-col w-full mx-auto gap-4 pb-4 pt-4">
            <button
                type="button"
                onClick={handleEnviar}
                className=
                {`w-full py-2 px-4 rounded-md text-white transition 
                ${deshabilitado? "bg-green-600/50 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700 cursor-pointer"}`}>
                Enviar datos
            </button>
        </div>
    );
}

export default EnviarEmpleado;
