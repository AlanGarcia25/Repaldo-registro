import { useEmpleado } from "../context/EmpleadoContext";
import { api } from "../services/api.config";
import { botonVariants } from "../styles/motionVariantes";
import { motion } from "motion/react";


import Swal from 'sweetalert2';
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";

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
        datos.fechaIngreso,
        huellaBase64,
        urlFirma,
        datosEmpresa
    ];

    const hayCamposVacios = camposRequeridos.some((campo) => !campo || campo.toString().trim() === "");
    const deshabilitado = hayCamposVacios || !huellaBase64 || !urlFirma;

    const handleEnviar = async () => {
        if (deshabilitado) {
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
                    sessionStorage.removeItem('token');
                    sessionStorage.setItem('auth', 'false');
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
        <div className="flex flex-col w-full mx-auto gap-4 pb-4 pt-4 2xl:pt-2">
            <Tooltip placement="top" title={deshabilitado ? "Completa todos los campos requeridos" : ""} disableInteractive arrow>
                <motion.button
                    variants={botonVariants}
                    whileTap="whileTap"
                    animate="animate"
                    whileHover="whileHover"
                    type="button"
                    onClick={handleEnviar}
                    disabled={deshabilitado}
                    className={
                        `duration-50 ease-in-out w-full py-2 px-4 rounded-md text-white transition 2xl:text-lg 2xl:h-12 
                    ${deshabilitado
                            ? "bg-gray-600/50 text-white/90 "
                            : "bg-green-600 hover:bg-green-700 cursor-pointer shadow-md"}`
                    }>
                    {deshabilitado ? "Campos incompletos" : "Descargar Contrato"}
                </motion.button>
            </Tooltip>
        </div >
    );
}

export default EnviarEmpleado;