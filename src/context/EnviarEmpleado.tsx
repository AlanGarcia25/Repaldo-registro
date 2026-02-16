import { useEmpleado } from "../context/EmpleadoContext";
import { api } from "../services/api.config";
import Swal from 'sweetalert2';
import axios from "axios";

function EnviarEmpleado() {
    const { datos, huellaBase64, urlFirma, limpiarEmpleado, datosEmpresa } = useEmpleado();

    const camposRequeridos = [
        datos.empleadoId,
        datos.empleadoNombre,
        datos.apellidoPaterno,
        datos.apellidoMaterno,
        datos.empleadoCURP,
        datos.empleadoRFC,
        datos.fechaNacimiento,
        datos.sexo,
        datos.estadoCivil,
        datos.domicilio,
        datos.tipoJornal,
        datosEmpresa
    ];

    const hayCamposVacios = camposRequeridos.some((campo) => !campo || campo.toString().trim() === "");
    const deshabilitado = hayCamposVacios || !huellaBase64 || !urlFirma;

    const handleEnviar = async () => {
        if (deshabilitado) {
            Swal.fire({
                title: "Advertencia",
                text: "Por favor, complete todos los campos, incluída la empresa y los biométricos.",
                icon: "warning",
                timer: 2500,
                showConfirmButton: false,
            });
            return;
        }

        try {
            const payload = {
                ...datos,
                huellaBase64,
                urlFirma,
            };

            const ruta = `agrosmart/ags_contrato/`;

            const response = await api.post(ruta, payload, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', `Contrato_${datos.empleadoId}.docx`);

            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            Swal.fire({
                title: "Generación exitosa",
                text: "El contrato se ha descargado correctamente",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                limpiarEmpleado();
            });

        } catch (error: unknown) {
            console.error("Error al obtener contrato:", error);

            let mensaje = "No se pudo generar el documento Word";

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    mensaje = "Sesión expirada. Por favor, vuelve a iniciar sesión.";
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return Promise.reject(error)
                } else if (error.response?.status === 404) {
                    mensaje = "No se encontró el recurso. Revisa los IDs.";
                }
            }

            Swal.fire({
                title: "Error",
                text: mensaje,
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
            });
        }
    };

    return (
        <div className="flex flex-col w-full mx-auto gap-4 pb-4 pt-4">
            <button
                type="button"
                onClick={handleEnviar}
                className={`w-full py-2 px-4 rounded-md text-white transition 
                ${deshabilitado
                        ? "bg-green-600/50 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 cursor-pointer shadow-md"}`}>
                Descargar Contrato
            </button>
        </div>
    );
}

export default EnviarEmpleado;