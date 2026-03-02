import dayjs from "dayjs";
import Swal from 'sweetalert2'
import { motion } from "motion/react";
import React, { useState, useEffect, useRef, useTransition } from "react";

import 'dayjs/locale/es';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Input from "./input";
import Boton from "./boton";
import Modal from "./modal";
import Canvas from "./canvas";
import Select from "./select";

import type { datosEmpleado } from "../models/api.models";

import { useSelectApi } from "../hooks/useSelectApi";
import EnviarEmpleado from "../context/EnviarEmpleado";
import { useInactividad } from "../hooks/useInactividad";
import { useEmpleado } from "../context/EmpleadoContext";
import { api, getNombreEmpresas, getDatosEmpleado } from "../services/api.config";
import { OPCIONES_TIPO_JORNAL, OPCIONES_ESTADO_CIVIL, OPCIONES_SEXO } from "./data";

import { clicVariant, contenedorVariants, inputsVariant, itemizquierdaVariants, itemsDerechaVariants } from "../styles/motionVariantes";

// ¡¡¡ INSTANCIA PARA USO DE SINGLETON !!! \\
let instanciaSDKGlobal: any = null;
// --------------------------------------- \\

function CardFor() {
    const { urlFirma, huellaBase64, datos, setDatos, setHuellaBase64, datosEmpresa, setDatosEmpresa, limpiarEmpleado } = useEmpleado();

    const [imagenHuella, setImagenHuella] = useState('');
    const [mensajeHuella, setMensajeHuella] = useState<string>()
    const [estadoHuella, setEstadoHuella] = useState<"escaneando" | "ok" | "error">("escaneando");

    const [cargando, setCargando] = useState(false)
    const [modalAbierto, setModalAbierto] = useState(false);

    const sdkRef = useRef<any>(null);
    const escaneandoRef = useRef(false);
    const timeoutRef = useRef<number | null>(null);

    const [isPending, startTransition] = useTransition();
    const [, setListaEmpleadosOriginal] = useState<datosEmpleado[]>([]);

    const hoy = new Date();
    const anioLimite = hoy.getFullYear() - 18;
    const minFecha = dayjs().subtract(100, 'year');
    const maxFecha18Anios = dayjs().year(anioLimite).endOf('year');

    const [estaCargando, setEstaCargando] = useState(false);

    ////// MAJENO DE CIERRE DE SESION
    const manejarCierreDeSesion = () => {
        limpiarEmpleado();
        sessionStorage.clear();
        setImagenHuella("");

        Swal.fire({
            title: "Sesión expirada",
            text: "No se ha registrado actividad o la sesión ha vencido.",
            icon: "warning",
            confirmButtonText: "Volver al Login",
            allowOutsideClick: false,
            buttonsStyling: true,
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login';
            }
        });
    };
    useInactividad(manejarCierreDeSesion, 600000);
    /////

    const { options: empresasOptions } = useSelectApi(
        getNombreEmpresas,
        (emp) => ({
            value: emp.empresaId,
            label: emp.empresaNombre
        })
    );

    /// OBTENER EMPLEADOS \\\
    useEffect(() => {
        const cargarEmpleados = async () => {
            try {
                const res = await api.get<datosEmpleado[]>(
                    "/agrosmart/ags_empleado/contrato"// --------------
                );
                setListaEmpleadosOriginal(res.data);
            } catch (error) {
                console.error("Error cargando empleados:", error);
            }
        };
        cargarEmpleados();
    }, []);
    ///

    /////////////////////////// INICIO SCRIPT MODAL \\\\\\\\\\\\\\\\\\\\\\\\\\\
    useEffect(() => {
        return () => {
            if (sdkRef.current) {
                try {
                    sdkRef.current.stopAcquisition();
                } catch (e) {
                    console.warn("Limpieza al desmontar:", e);
                }
            }
        };
    }, []);
    const cerrarModal = (delay = 2000) => {
        setTimeout(() => setModalAbierto(false), delay);
    };
    const detenerEscaneo = async () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        escaneandoRef.current = false;
        cerrarModal(1500);
        if (sdkRef.current) {
            try {
                sdkRef.current.onSamplesAcquired = null;
                sdkRef.current.onCommunicationFailed = null;
                await sdkRef.current.stopAcquisition();
            } catch (e) {
                console.warn("Error al detener sensor (posiblemente ya estaba detenido).", e);
            }
        }
    };
    const manejarErrorHuella = (msg: string) => {
        setEstadoHuella("error");
        setMensajeHuella(msg);
        detenerEscaneo();
    };
    ///////////////////////////

    ///////////////////////////////////////// INICIO HANDLE-OPTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    //// ESCANEO Y MANEJODE HUELLA
    const handleCapturarHuella = async () => {
        let yaSeMostroBloqueo = false;

        if (escaneandoRef.current) return;

        setModalAbierto(true);
        setEstadoHuella("escaneando");
        setMensajeHuella(undefined);
        escaneandoRef.current = true;

        timeoutRef.current = window.setTimeout(() => {
            if (!yaSeMostroBloqueo) {
                manejarErrorHuella("Tiempo de espera agotado");
            }
        }, 10000);

        try {
            const Fingerprint = (window as any).Fingerprint;
            if (!Fingerprint) throw new Error("SDK no disponible");

            // --- LÓGICA SINGLETON ---
            if (!instanciaSDKGlobal) {
                instanciaSDKGlobal = new Fingerprint.WebApi();
            }
            sdkRef.current = instanciaSDKGlobal;
            // ------------------------

            const devices = await Promise.race([
                sdkRef.current.enumerateDevices(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("SERVICIO_BLOQUEADO")), 3500)
                )
            ]) as any[];
            if (!devices || devices.length === 0) {
                throw new Error("Conecte el lector");
            }

            sdkRef.current.onSamplesAcquired = null;
            sdkRef.current.onCommunicationFailed = null;

            sdkRef.current.onSamplesAcquired = async (s: any) => {
                if (yaSeMostroBloqueo) return;
                try {
                    const samples = typeof s.samples === "string" ? JSON.parse(s.samples) : s.samples;
                    const rawData = typeof samples[0] === 'string' ? samples[0] : (samples[0].Data || samples[0].data);
                    const base64Limpio = rawData.trim().replace(/-/g, "+").replace(/_/g, "/");

                    setHuellaBase64(base64Limpio);
                    setImagenHuella(`data:image/png;base64,${base64Limpio}`);
                    setEstadoHuella("ok");
                    await detenerEscaneo();
                } catch (e) {
                    manejarErrorHuella("Error al procesar huella");
                }
            };
            sdkRef.current.onCommunicationFailed = () => {
                if (!yaSeMostroBloqueo) {
                    detenerEscaneo();
                    manejarErrorHuella("Fallo de comunicación con el servicio local");
                }
            };

            await sdkRef.current.startAcquisition(Fingerprint.SampleFormat.PngImage, devices[0]);

        } catch (error: any) {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            escaneandoRef.current = false;

            if (error.message === "SERVICIO_BLOQUEADO") {
                yaSeMostroBloqueo = true;
                setModalAbierto(false);
                Swal.fire({
                    title: 'Lector Saturado',
                    text: 'El servicio ha superado el límite de conexiones permitido.',
                    icon: 'warning',
                    confirmButtonText: 'Reiniciar Lector',
                    customClass: {
                        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg 2xl:text-xl 2xl:py-6 2xl:px-10',
                        title: 'text-2xl font-bold text-gray-800 2xl:text-5xl',
                        popup: 'rounded-xl border-2 border-yellow-400 2xl:border-4'
                    },
                    buttonsStyling: false,
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else {
                if (!yaSeMostroBloqueo) {
                    manejarErrorHuella(error.message || "Lector no listo");
                }
            }
        }
    };
    ////
    // MANEJO DE EXPIRACION DE HUELLA
    useEffect(() => {
        let temporizador: number | undefined;

        if (huellaBase64) {
            temporizador = window.setTimeout(() => {
                setHuellaBase64("");
                setImagenHuella("");

                Swal.fire({
                    title: "Sesión de captura expirada",
                    text: "La huella se ha eliminado de la memoria por seguridad. Por favor, capture de nuevo si es necesario.",
                    icon: "info",
                    confirmButtonText: "Entendido",
                    confirmButtonColor: "#3085d6"
                });
            }, 150000);
        }
        return () => {
            if (temporizador) {
                window.clearTimeout(temporizador);
            }
        };
    }, [huellaBase64, setHuellaBase64]);
    //

    //// BUSCAR POR ID Y TECLA 'ENTER'
    const handleEmpleadoKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        e.preventDefault();

        if (!datos.empleadoId || datos.empleadoId.toString().trim() === "") {
            Swal.fire({
                title: "Campo requerido",
                text: "Por favor, ingresa un ID de empleado",
                icon: "warning",
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }
        if (cargando) return;
        setCargando(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            const empleado = await getDatosEmpleado(`${datos.empleadoId}/${datosEmpresa}`, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!empleado || Object.keys(empleado).length === 0) {
                Swal.fire({
                    title: "No encontrado",
                    text: "El empleado no existe en la base de datos",
                    icon: "error",
                    timer: 3000,
                    showConfirmButton: false,
                });
                setDatos({ ...datos, empleadoId: "" });
                setCargando(true)
                return;
            }
            startTransition(() => {
                setDatos(empleado);
            });

        } catch (error: any) {
            const isTimeout = error.name === 'AbortError' || error.code === 'ECONNABORTED';
            Swal.fire({
                title: isTimeout ? "Sin respuesta" : "Error de conexión",
                text: isTimeout
                    ? "La base de datos tardó demasiado en responder"
                    : "No se pudo establecer conexión con el servidor",
                icon: isTimeout ? "warning" : "error",
                timer: 2500,
                showConfirmButton: false
            });
        } finally {
            setCargando(false);
        }
    };
    ////

    // INGRESAR LOS VALORES A LOS INPUT
    const handleInputChange = (campo: keyof datosEmpleado, valor: any) => {
        setDatos((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    };
    //

    ///////////////////////////////////////// 

    return (
        <div className="relative h-screen no-scrollbar overflow-y-auto">
            {estaCargando && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-gray-900/70 backdrop-blur-sm">
                    <div className="relative flex items-center justify-center w-24 h-24">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'conic-gradient(#fb2c36,#e7000b,#ff6900 )',
                                WebkitMaskImage: 'radial-gradient(transparent 60%, black 61%)',
                                maskImage: 'radial-gradient(transparent 60%, black 61%)',
                            }} />
                        <div className="absolute w-16 h-16 bg-blue-500/10 rounded-full blur-2xl"></div>
                    </div>
                    <p className="text-white text-lg font-mediu mt-4 select-none">Generando documento...</p>
                </motion.div>
            )}
            <motion.div variants={contenedorVariants} initial="hidden" animate="visible"
                className="flex flex-wrap md:flex-nowrap gap-6 p-4 w-full select-none">

                {/* ////////////////////////////////////////////////////MENU IZQUIERDO\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
                <motion.div variants={itemizquierdaVariants}
                    className="w-full md:w-1/2 p-5 box-border shadow-xl border-2 border-gray-500 rounded-l-xl 2xl:border-3" animate={{ opacity: isPending ? 0.6 : 1, transition: { duration: 0.2 } }}>
                    <h1 className="text-xl 2xl:text-2xl font-semibold flex items-center justify-center pt-2 pb-8">Datos del empleado</h1>

                    {/*   PRIMERA PARTE DEL MENU IZQUIERDO   */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-x-6 gap-y-2 md:gap-y-3 lg:gap-y-4">
                        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 md:gap-y-3 items-end">
                            <Select
                                nombreSelect={"Empresas"}
                                options={empresasOptions}
                                value={datosEmpresa}
                                onChange={setDatosEmpresa}
                                empresasVacio={empresasOptions.length === 0}
                            />
                            <Select
                                nombreSelect={"Tipo jornal"}
                                options={OPCIONES_TIPO_JORNAL}
                                value={datos.tipoJornal || ""}
                                onChange={(val) => { handleInputChange('tipoJornal', val) }}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <div className="flex flex-col py-2">
                                    <motion.label animate={{ color: datos.fechaIngreso ? "#193cb8" : "#374151" }} className="text-sm 2xl:text-lg font-bold transition-colors">
                                        Fecha de ingreso
                                    </motion.label>
                                    <DatePicker
                                        format="DD / MM / YYYY"
                                        views={['year', 'month', 'day']}
                                        maxDate={dayjs(hoy)}
                                        minDate={dayjs(minFecha)}
                                        openTo="year"
                                        value={datos.fechaIngreso ? dayjs(datos.fechaIngreso) : null}
                                        onChange={(val) => { handleInputChange('fechaIngreso', val) }}
                                        slotProps={{
                                            textField: {
                                                variant: "standard",
                                                InputProps: {
                                                    disableUnderline: true,
                                                    className: `${datos.fechaIngreso ? "!italic border-b-2 2xl:border-b-3 border-blue-800" : "!italic border-b-2 2xl:border-b-3 border-gray-500"} 
                                                            !pl-3 !text-base 2xl:!text-lg !font-sans bg-transparent outline-none w-full`,
                                                },
                                                sx: {
                                                    '& .MuiInputBase-input': {
                                                        padding: 0,
                                                        cursor: 'pointer',
                                                    }
                                                }
                                            },
                                            desktopPaper: {
                                                sx: {
                                                    '@media (min-width: 1536px)': {
                                                        transform: 'scale(1.2) !important',
                                                        transformOrigin: 'top left',
                                                        marginTop: '15px',
                                                        '& .MuiPickersLayout-root': {
                                                            width: '100%',
                                                        }
                                                    }
                                                }
                                            },
                                            mobilePaper: {
                                                sx: {
                                                    '@media (min-width: 1536px)': {
                                                        transform: 'scale(1.7) !important',
                                                    }
                                                }
                                            },
                                            openPickerButton: {
                                                sx: {
                                                    '@media (min-width: 1536px)': {
                                                        '& .MuiSvgIcon-root': { fontSize: '2rem' }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </LocalizationProvider>
                            <Input
                                nombre="No. Empleado"
                                tipo="text"
                                placeholder={"Ingrese el ID del empleado"}
                                value={datos.empleadoId}
                                onChange={(val) => {
                                    if (/^\d{0,10}$/.test(val)) {
                                        handleInputChange('empleadoId', val)
                                    }
                                }}
                                readOnly={false}
                                onKeyDown={handleEmpleadoKeyDown}
                            />
                            <Select
                                nombreSelect={"Sexo"}
                                options={OPCIONES_SEXO}
                                value={datos.sexo}
                                onChange={(val) => handleInputChange("sexo", val)}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <div className="flex flex-col py-2">
                                    <motion.label animate={{ color: datos.fechaNacimiento ? "#193cb8" : "#374151" }} className="text-sm 2xl:text-lg font-bold transition-colors truncate">
                                        Fecha de nacimiento
                                    </motion.label>
                                    <DatePicker
                                        format="DD / MM / YYYY"
                                        views={['year', 'month', 'day']}
                                        maxDate={maxFecha18Anios}
                                        minDate={dayjs(minFecha)}
                                        openTo="year"
                                        value={datos.fechaNacimiento ? dayjs(datos.fechaNacimiento) : null}
                                        onChange={(val) => { handleInputChange('fechaNacimiento', val) }}
                                        slotProps={{
                                            textField: {
                                                variant: "standard",
                                                InputProps: {
                                                    disableUnderline: true,
                                                    className: `${datos.fechaNacimiento ? "!italic border-b-2 2xl:border-b-3 border-blue-800" : "!italic border-b-2 2xl:border-b-3 border-gray-500"} 
                                                            !pl-3 !text-base 2xl:!text-lg !font-sans bg-transparent outline-none w-full`,
                                                },
                                                sx: {
                                                    '& .MuiInputBase-input': {
                                                        padding: 0,
                                                        cursor: 'pointer',
                                                    }
                                                }
                                            },
                                            desktopPaper: {
                                                sx: {
                                                    '@media (min-width: 1536px)': {
                                                        transform: 'scale(1.2) !important',
                                                        transformOrigin: 'top left',
                                                        marginTop: '15px',
                                                        '& .MuiPickersLayout-root': {
                                                            width: '100%',
                                                        }
                                                    }
                                                }
                                            },
                                            mobilePaper: {
                                                sx: {
                                                    '@media (min-width: 1536px)': {
                                                        transform: 'scale(1.7) !important',
                                                    }
                                                }
                                            },
                                            openPickerButton: {
                                                sx: {
                                                    '@media (min-width: 1536px)': {
                                                        '& .MuiSvgIcon-root': { fontSize: '2rem' }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </LocalizationProvider>
                        </div>
                        <Input
                            nombre="Nombre"
                            placeholder="Ingrese su nombre"
                            tipo="text"
                            value={datos.empleadoNombre}
                            onChange={(val) => handleInputChange('empleadoNombre', val)}
                            readOnly={true}
                        />
                        <Input
                            nombre="Apellido Paterno"
                            placeholder="Ingrese su Apellido Paterno"
                            tipo="text"
                            value={datos.apellidoPaterno}
                            onChange={(val) => handleInputChange('apellidoPaterno', val)}
                            readOnly={true}
                        />
                        <Input
                            nombre="Apellido Materno"
                            placeholder="Ingrese su Apellido Materno"
                            tipo="text"
                            value={datos.apellidoMaterno}
                            onChange={(val) => handleInputChange('apellidoMaterno', val)}
                            readOnly={true}
                        />
                        <Input
                            nombre="CURP"
                            placeholder="CURP"
                            tipo="text"
                            value={datos.empleadoCURP}
                            onChange={(val) => handleInputChange('empleadoCURP', val)}
                            readOnly={true}
                        />
                    </div>

                    {/*   SEGUNA PARTE DEL MENU DERECHO  */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-x-6 gap-y-3 md:gap-y-3 lg:gap-y-5 md:mt-3">
                        <Input
                            nombre="RFC"
                            placeholder="RFC"
                            tipo="text"
                            value={datos.empleadoRFC}
                            onChange={(val) => handleInputChange('empleadoRFC', val)}
                            readOnly={true}
                        />
                        <Select
                            nombreSelect={"Estado Civil"}
                            options={OPCIONES_ESTADO_CIVIL}
                            value={datos.estadoCivil || ""}
                            onChange={(val) => { handleInputChange('estadoCivil', val) }}
                        />
                        <Input
                            nombre="Lugar de Nac"
                            placeholder="Estado"
                            tipo="text"
                            value={datos.lugarNacimiento}
                            onChange={(val) => {
                                if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,.]*$/.test(val)) {
                                    handleInputChange('lugarNacimiento', val)
                                }
                            }}
                            readOnly={false}
                        />
                        <Input
                            nombre="Código Postal"
                            placeholder="Ej.43200"
                            tipo="number"
                            value={datos.codigoPostal}
                            onChange={(val) => {
                                if (/^\d{0,5}$/.test(val)) {
                                    handleInputChange('codigoPostal', val)
                                }
                            }}
                            onKeyDown={(e) => {
                                if (['+', '-', 'e', 'E', '.'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            readOnly={false}
                        />
                        <motion.div variants={clicVariant} whileTap="whileTap" className="col-span-1 sm:col-span-2 2xl:col-span-1 flex flex-col py-2 md:py-1 2xl:py-1 w-full ">
                            <motion.label animate={{ color: datos.domicilio ? "#193cb8" : "#374151" }}
                                className="text-sm 2xl:text-lg font-bold transition-colors">
                                Domicilio
                            </motion.label>
                            <motion.textarea
                                variants={inputsVariant}
                                initial="initial"
                                whileFocus="focused"
                                animate={{ borderColor: datos.domicilio ? "#193cb8" : "oklch(55.1% 0.027 264.364)" }}
                                rows={1}
                                placeholder="Ingrese su domicilio completo"
                                value={datos.domicilio || ""}
                                onChange={(e) => handleInputChange('domicilio', e.target.value)}
                                className="resize-y w-full bg-transparent pl-2.5 p-1.5 pb-2 sm:pb-5 sm:pl-2.5 sm:p-1.5 2xl:pb-3.25 focus:outline-none font-sans placeholder:italic xl:placeholder:text-base 2xl:placeholder:text-xl 2xl:text-xl border-b-2 2xl:border-b-3 border-gray-500"
                            />
                        </motion.div>
                        <div className="col-span-1 sm:col-span-2 2xl:col-span-1">
                            <Input
                                nombre="Colonia"
                                placeholder="Barrio/Colonia"
                                tipo="text"
                                value={datos.colonia}
                                onChange={(val) => { handleInputChange('colonia', val) }}
                                readOnly={false}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* ////////////////////////////////////////////////////MENU DERECHO\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
                <motion.div layout variants={itemsDerechaVariants}
                    className="w-full md:w-1/2 p-5 box-border shadow-xl border-2 border-gray-500 rounded-r-lg 2xl:border-3 flex flex-col gap-6">
                    <h1 className="text-xl 2xl:text-2xl font-semibold flex items-center justify-center pt-2 pb-4 ">Biométricos</h1>
                    <motion.div layout className="flex flex-col gap-6">
                        <div className="w-full">
                            <Boton
                                nombreBoton="Capturar huella"
                                color={`cursor-pointer w-full ${huellaBase64 ? "bg-green-600 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-600"}`}
                                onClick={handleCapturarHuella}
                            />
                        </div>

                        {huellaBase64 && (
                            <div className="flex items-center justify-between gap-4 p-2 md:p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-inner">
                                <div className="flex-1 text-center">
                                    <h1 className="text-lg sm:text-2xl md:text-xl lg:text-2xl 2xl:text-3xl font-bold text-gray-800 ">¡Captura exitosa!</h1>
                                    <p className="text-gray-500 text-sm md:text-base 2xl:text-lg">La huella capturada es la siguiente</p>
                                </div>
                                <div className="w-28 h-28 md:w-32 md:h-32 overflow-hidden rounded-lg shrink-0 border border-gray-300 bg-white p-1">
                                    <img
                                        className="w-full h-full object-contain"
                                        src={imagenHuella}
                                        alt="Huella"
                                        onContextMenu={(e) => e.preventDefault()}
                                        onDragStart={(e) => e.preventDefault()}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="w-full flex flex-col gap-2">
                            <motion.label animate={{ color: urlFirma ? "#193cb8" : "#374151" }}
                                className="text-base 2xl:text-lg font-bold transition-colors ">Firma{urlFirma && ' ✓'}
                            </motion.label>
                            <div className="w-full overflow-hidden">
                                <Canvas />
                            </div>
                        </div>
                        <div className="mt-2 w-full">
                            <EnviarEmpleado onEstadoCarga={setEstaCargando} />
                        </div>
                    </motion.div>
                </motion.div>
                <Modal
                    abierto={modalAbierto}
                    estado={estadoHuella}
                    mensaje={mensajeHuella}
                    onClose={() => setModalAbierto(false)}
                />
            </motion.div >
        </div>
    );
}

export default CardFor;