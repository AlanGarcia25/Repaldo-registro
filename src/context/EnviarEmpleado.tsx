import { api } from "../services/api.config";
import swal from 'sweetalert'
import { useEmpleado } from "../context/EmpleadoContext";

function EnviarEmpleado() {
    const { datos, huellaBase64, urlFirma, limpiarEmpleado } = useEmpleado();

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

    const hayCamposVacios = camposRequeridos.some((campo) => !campo || campo.toString().trim() === "");

    const deshabilitado =
        hayCamposVacios || !huellaBase64 || !urlFirma;

    const handleEnviar = async () => {
        if (deshabilitado) {
            swal({
                title: "Advertencia",
                text: "Ningun campo debe de estar vacio",
                icon: "warning",
                timer: 3000,
                buttons: {
                    visble: false
                }
            })
            return;
        }

        const payload = {
            ...datos,
            huellaBase64,
            urlFirma,
        };

        try {
            await api.post("/agrosmart/ags_empleado/guardar", payload); // --------
            swal({
                title: "Envio exitoso",
                text: "Formulario enviado con exito",
                icon: "success",
                timer: 2000,
                buttons: {
                    visble: false
                }
            }).then(() => {
                console.log(JSON.stringify(payload))//////////////////////// BORRAR 
                limpiarEmpleado()
            })
        } catch (error) {
            console.error(error);
            swal({
                title: "Error",
                text: "No se pudo enviar los datos",
                icon: "error",
                timer: 3000,
                buttons: {
                    visble: false
                }
            }).then(() => {
                limpiarEmpleado()
            })
        }
    };

    return (
        <div className="flex flex-col w-full mx-auto gap-4 pb-4 pt-4">
            <button
                type="button"
                onClick={handleEnviar}
                className=
                {`w-full py-2 px-4 rounded-md text-white transition 
                ${deshabilitado ? "bg-green-600/50 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 cursor-pointer"}`}>
                Enviar datos
            </button>
        </div>
    );
}

export default EnviarEmpleado;
