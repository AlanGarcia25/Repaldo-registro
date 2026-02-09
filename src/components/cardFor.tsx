import React, { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2'


import Select from "./select";
import Input from "./input";
import Boton from "./boton";
import Canvas from "./canvas";
import Modal from "./modal";
import EnviarEmpleado from "../context/EnviarEmpleado";

import type { datosEmpleado } from "../models/api.models";

import { useEmpleado } from "../context/EmpleadoContext";
import { useSelectApi } from "../hooks/useSelectApi";
import { api, getNombreEmpresas, getDatosEmpleado } from "../services/api.config";
import { OPCIONES_TIPO_JORNAL, OPCIONES_ESTADO_CIVIL, OPCIONES_SEXO } from "./data";



function CardFor() {
    const { huellaBase64, datos, setDatos, setHuellaBase64, } = useEmpleado();

    const [modalAbierto, setModalAbierto] = useState(false);
    const [estadoHuella, setEstadoHuella] = useState<"escaneando" | "ok" | "error">("escaneando");
    const [mensajeHuella, setMensajeHuella] = useState<string>();
    const [imagenHuella, setImagenHuella] = useState('')
    const [cargando, setCargando] = useState(false)

    const sdkRef = useRef<any>(null);
    const timeoutRef = useRef<number | null>(null);
    const escaneandoRef = useRef(false);

    const [, setIdEmpresaSel] = useState("");
    const [, setListaEmpleadosOriginal] = useState<datosEmpleado[]>([]);

    ///// FECHA
    const hoy = new Date();
    const maxFecha = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate()).toISOString().split("T")[0];

    const minFecha = new Date(hoy.getFullYear() - 100, hoy.getMonth(), hoy.getDate()).toISOString().split("T")[0];

    const { options: empresasOptions } = useSelectApi(
        getNombreEmpresas,
        (emp) => ({ value: emp.empresaId, label: emp.empresaNombre })
    );

    useEffect(() => {
        const cargarEmpleados = async () => {
            const res = await api.get<datosEmpleado[]>( // ------  
                "/agrosmart/ags_empleado/contrato"
            );
            setListaEmpleadosOriginal(res.data);
        };
        cargarEmpleados();
    }, []);


    /////////////////////////// INICIO CONST MODAL \\\\\\\\\\\\\\\\\\\\\\\\\\\
    const cerrarModal = (delay = 2000) => {
        setTimeout(() => setModalAbierto(false), delay);
    };

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

    const detenerEscaneo = async () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        escaneandoRef.current = false;
        cerrarModal();

        if (sdkRef.current) {
            const sdkCopia = sdkRef.current;
            sdkRef.current = null;

            try {
                sdkCopia.onSamplesAcquired = null;
                sdkCopia.onCommunicationFailed = null;

                await Promise.race([
                    sdkCopia.stopAcquisition(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500))
                ]);

                console.log("Conexión liberada con éxito.");
            } catch (e) {
                console.warn("El SDK no respondió, pero la memoria fue liberada.");
            }
        }
    };

    const manejarErrorHuella = (msg: string) => {
        setEstadoHuella("error");
        setMensajeHuella(msg);
        detenerEscaneo();
    };
    /////////////////////////// 

    ///////////////////////////////////////// INICIO HANDLE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    //// ESCANEO Y MANEJODE HUELLA
    const handleCapturarHuella = async () => {
        let yaSeMostroBloqueo = false;

        if (escaneandoRef.current) return;

        if (sdkRef.current) {
            try {
                await sdkRef.current.stopAcquisition();
            } catch (e) { }
            sdkRef.current = null;
        }

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

            const sdk = new Fingerprint.WebApi();
            sdkRef.current = sdk;

            const devices = await Promise.race([
                sdk.enumerateDevices(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("SERVICIO_BLOQUEADO")), 3500)
                )
            ]) as any[];

            if (!devices || devices.length === 0) {
                throw new Error("Conecte el lector");
            }

            sdk.onSamplesAcquired = async (s: any) => {
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

            sdk.onCommunicationFailed = () => {
                if (!yaSeMostroBloqueo) {
                    manejarErrorHuella("Fallo de comunicación con el servicio local");
                }
            };

            await sdk.startAcquisition(Fingerprint.SampleFormat.PngImage, devices[0]);

        } catch (error: any) {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

            sdkRef.current = null;
            escaneandoRef.current = false;

            if (error.message === "SERVICIO_BLOQUEADO") {
                yaSeMostroBloqueo = true;
                setModalAbierto(false);

                Swal.fire({
                    title: 'Lector Saturado',
                    text: 'El servicio ha superado el límite de conexiones permitido.',
                    icon: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'Reiniciar Lector',
                    customClass: {
                        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg',
                        title: 'text-2xl font-bold text-gray-800',
                        popup: 'rounded-xl border-2 border-yellow-400'
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
            const empleado = await getDatosEmpleado(datos.empleadoId, { signal: controller.signal });
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
                return;
            }

            setDatos(empleado);

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

    const handleInputChange = (campo: keyof datosEmpleado, valor: any) => {
        setDatos((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    };
    ///////////////////////////////////////// 


    return (
        <div className="p-3">
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-4 w-full">

                {/* ////////////////////////////////////////////////////MENU IZQUIERDO\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
                <div className="flex-1 md:w-1/2 p-5 box-border shadow-xl border border-gray-800 rounded-lg">
                    <h1 className="text-xl font-semibold flex items-center justify-center pt-2 pb-8">Datos del empleado</h1>

                    {/* PRIMERA PARTE DEL MENU IZQUIERDO   */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        <Select
                            nombreSelect={"Empresas"}
                            options={empresasOptions}
                            readOnly={false}
                            onChange={(val) => setIdEmpresaSel(val)}
                        />
                        <Select
                            nombreSelect={"Tipo jornal"}
                            options={OPCIONES_TIPO_JORNAL}
                            value={datos.tipoJornal || ""}
                            readOnly={false}
                            onChange={(val) => { handleInputChange('tipoJornal', val) }}
                        />
                        <Input
                            nombre="No. Empleado"
                            tipo="text"
                            placeholder={"Ingrese el ID del empleado"}
                            value={datos.empleadoId}
                            onChange={(val) => handleInputChange('empleadoId', val)}
                            readOnly={false}
                            onKeyDown={handleEmpleadoKeyDown}
                        />
                        <Input
                            nombre="Nombre"
                            tipo="text"
                            value={datos.empleadoNombre}
                            onChange={(val) => handleInputChange('empleadoNombre', val)}
                            readOnly={true}
                        />
                        <Input
                            nombre="Apellido Paterno"
                            tipo="text"
                            value={datos.apellidoPaterno}
                            onChange={(val) => handleInputChange('apellidoPaterno', val)}
                            readOnly={true}
                        />
                        <Input
                            nombre="Apellido Materno"
                            tipo="text"
                            value={datos.apellidoMaterno}
                            onChange={(val) => handleInputChange('apellidoMaterno', val)}
                            readOnly={true}
                        />
                    </div>

                    {/* SEGUNA PARTE DEL MENU IZQUIERDO   */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mt-5">
                        <Input
                            nombre="CURP"
                            placeholder="CURP"
                            tipo="text"
                            value={datos.empleadoCURP}
                            onChange={(val) => handleInputChange('empleadoCURP', val)}
                            readOnly={true}
                        />
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
                            readOnly={false}
                            onChange={(val) => { handleInputChange('estadoCivil', val) }}
                        />
                        <Input
                            nombre={
                                <div className="max-w[120px] truncate" >
                                    Lugar de nacimiento
                                </div>
                            }
                            placeholder="Estado, Ciudad, Municipio"
                            tipo="text"
                            value={datos.lugarNacimiento}
                            onChange={(val) => {
                                if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                                    handleInputChange('lugarNacimiento', val)
                                }
                            }}
                            readOnly={false}
                        />

                        {/* FILA AGRUPADA: FECHA, SEXO Y CP */}
                        <div className="col-span-1 sm:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 items-end">
                            <Input
                                nombre={
                                    <div className="max-w[120px] truncate" >
                                        Fecha de nacimiento
                                    </div>
                                }
                                tipo="date"
                                min={minFecha}
                                max={maxFecha}
                                value={datos.fechaNacimiento}
                                onChange={(val) => { handleInputChange('fechaNacimiento', val) }}
                                onKeyDown={(e) => e.preventDefault()}
                                readOnly={false}
                            />
                            <Select
                                nombreSelect={"Sexo"}
                                options={OPCIONES_SEXO}
                                value={datos.sexo}
                                readOnly={false}
                                onChange={(val) => handleInputChange("sexo", val)}
                            />
                            <Input
                                nombre="Código Postal"
                                tipo="number"
                                value={datos.codigoPostal}
                                onChange={(val) => {
                                    if (/^\d{0,5}$/.test(val)) {
                                        handleInputChange('codigoPostal', val)
                                    }
                                }}
                                readOnly={false}
                            />
                        </div>

                        <div className="col-span-1 sm:col-span-2 flex flex-col gap-2 w-full mt-1">
                            <label className="text-sm font-bold text-gray-700">Domicilio</label>
                            <textarea
                                className="w-full border-b-[.1px] border-black p-2 bg-transparent focus:border-blue-700 outline-none resize-none"
                                placeholder="Ingrese su domicilio completo"
                                value={datos.domicilio || ""}
                                rows={2}
                                onChange={(e) => handleInputChange('domicilio', e.target.value)}
                                readOnly={false}
                            ></textarea>
                        </div>

                        <div className="col-span-1 sm:col-span-2">
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
                </div>

                {/* ////////////////////////////////////////////////////MENU DERECHO\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
                <div className="w-full md:w-1/2 p-5 box-border shadow-xl border border-gray-800 rounded-lg flex flex-col gap-6 bg-white">
                    <h1 className="text-xl font-semibold flex items-center justify-center pt-2 pb-4 border-b border-gray-100">
                        Biométricos
                    </h1>

                    <div className="flex flex-col gap-6">
                        <div className="w-full">
                            <Boton
                                nombreBoton="Capturar huella"
                                color={`cursor-pointer w-full
                                ${huellaBase64
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                                onClick={handleCapturarHuella}
                            />
                        </div>

                        {huellaBase64 && (
                            <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-inner">
                                <div className="flex-1 text-center">
                                    <h1 className="text-xl font-bold text-gray-800">¡Captura exitosa!</h1>
                                    <p className="text-gray-500 text-sm">La huella capturada es la siguiente</p>
                                </div>

                                <div className="w-32 h-32 overflow-hidden rounded-lg shrink-0 border border-gray-300 bg-white p-1">
                                    <img
                                        className="w-full h-full object-contain"
                                        src={imagenHuella}
                                        alt="Huella"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="w-full flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Firma</label>
                            <div className="w-full  overflow-hidden">
                                <Canvas />
                            </div>
                        </div>

                        <div className="mt-2 w-full">
                            <EnviarEmpleado />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                abierto={modalAbierto}
                estado={estadoHuella}
                mensaje={mensajeHuella}
                onClose={() => setModalAbierto(false)}
            />
        </div>
    );
}

export default CardFor;