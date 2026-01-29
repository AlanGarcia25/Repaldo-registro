import React, { useState, useEffect, useRef } from "react";
import Select from "./select";
import Input from "./input";
import Boton from "./boton";
import Canvas from "./canvas";
import Modal from "./modal";

import type { datosEmpleado } from "../models/api.models";

import { useSelectApi } from "../hooks/useSelectApi";
import { api, getNombreEmpresas, getDatosEmpleado } from "../services/api.config";
import {
    OPCIONES_TIPO_JORNAL,
    OPCIONES_ESTADO_CIVIL,
    OPCIONES_SEXO,
} from "./data";

function CardFor() {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [estadoHuella, setEstadoHuella] = useState<"escaneando" | "ok" | "error">("escaneando");
    const [mensajeHuella, setMensajeHuella] = useState<string>();
    const [huellaBase64, setHuellaBase64] = useState("");

    const sdkRef = useRef<any>(null);
    const timeoutRef = useRef<number | null>(null);
    const escaneandoRef = useRef(false);

    const [, setIdEmpresaSel] = useState("");
    const [, setListaEmpleadosOriginal] = useState<datosEmpleado[]>([]);

    const hoy = new Date();
    const maxFecha = new Date(hoy.getFullYear() - 10, hoy.getMonth(), hoy.getDate()).toISOString().split("T")[0];

    const minFecha = new Date(hoy.getFullYear() - 100, hoy.getMonth(), hoy.getDate()).toISOString().split("T")[0];

    const [datos, setDatos] = useState<datosEmpleado>({
        empleadoId: "",
        empleadoNombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        empleadoCURP: "",
        empleadoRFC: "",
        sexo: "",
        fechaNacimiento: "",
        domicilio: "",
        colonia: "",
        codigoPostal: 0,
        lugarNacimiento: "",
        estadoCivil: "",
        tipoJornal: "",
    });

    const { options: empresasOptions } = useSelectApi(
        getNombreEmpresas,
        (emp) => ({ value: emp.empresaId, label: emp.empresaNombre })
    );

    useEffect(() => {
        const cargarEmpleados = async () => {
            const res = await api.get<datosEmpleado[]>(
                "/agrosmart/ags_empleado/contrato"
            );
            setListaEmpleadosOriginal(res.data);
        };
        cargarEmpleados();
    }, []);

    ///////////////////////////////// UTILIDADES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    const cerrarModal = (delay = 2000) => {
        setTimeout(() => setModalAbierto(false), delay);
    };

    const detenerEscaneo = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (sdkRef.current) {
            try {
                sdkRef.current.stopAcquisition();
            } catch { }
            sdkRef.current = null;
        }

        escaneandoRef.current = false;
        cerrarModal();
    };

    const manejarErrorHuella = (msg: string) => {
        setEstadoHuella("error");
        setMensajeHuella(msg);
        detenerEscaneo();
    };

    //////////////////////////////////// CAPTURAR HUELLA \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    const handleCapturarHuella = () => {
        if (escaneandoRef.current) return;

        escaneandoRef.current = true;
        setModalAbierto(true);
        setEstadoHuella("escaneando");
        setMensajeHuella(undefined);

        timeoutRef.current = window.setTimeout(() => {
            manejarErrorHuella("Tiempo de espera agotado");
        }, 5000);

        const Fingerprint = (window as any).Fingerprint;
        if (!Fingerprint) {
            manejarErrorHuella("SDK de huella no disponible");
            return;
        }

        const sdk = new Fingerprint.WebApi(8000);
        sdkRef.current = sdk;

        sdk.onSamplesAcquired = (s: any) => {
            try {
                const samples =
                    typeof s.samples === "string"
                        ? JSON.parse(s.samples)
                        : s.samples;

                const rawData = samples?.[0]?.Data || samples?.[0]?.data;
                if (!rawData) throw new Error();

                const base64 = rawData
                    .replace(/-/g, "+")
                    .replace(/_/g, "/");

                console.log("🧬 HUELLA BASE64:", base64);

                setHuellaBase64(base64);
                setEstadoHuella("ok");
                detenerEscaneo();
            } catch {
                manejarErrorHuella("Error al procesar la huella");
            }
        };

        sdk.onCommunicationFailed = () => {
            manejarErrorHuella("Error de comunicación con el lector");
        };

        sdk.enumerateDevices()
            .then((devices: any[]) => {
                if (!devices.length) {
                    manejarErrorHuella("Lector no detectado");
                    return;
                }
                sdk.startAcquisition(
                    Fingerprint.SampleFormat.Intermediate,
                    devices[0]
                );
            })
            .catch(() => manejarErrorHuella("No se pudo iniciar el lector"));
    };

    const handleEmpleadoKeyDown = async (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key !== "Enter") return;
        e.preventDefault();

        const empleado = await getDatosEmpleado(datos.empleadoId);
        empleado
            ? setDatos(empleado)
            : alert("Empleado no encontrado");
    };

    const handleFirmaRecibida = (url: string) => {
        console.log("✍️ Firma:", url);
    };

    const handleInputChange = (campo: keyof datosEmpleado, valor: any) => {
        setDatos((prev) => ({ ...prev, [campo]: valor }));
        // CAMBIAR, BORRAR O MODIFICAR HACER BIEN EL MEDOTO POST PARA ENVIAR LOS DATOS
        // DE ESTE FORMULARIO AL CANVAS INCUIDO EL BASE64 DE HUELLA, Y LA IAMGEN DE LA FIRMA
        localStorage.setItem("Empleado", JSON.stringify(datos))
    };

    //////////////////////////////////////////////// FIN CONST HANDLE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    return (
        <div className="p-3">
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-4 w-full">

                {/* ////////////////////////////////////////////////////MENU IZQUIERDO\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
                <div className="flex-1 md:w-1/2 p-5 box-border shadow-xl border border-gray-800 rounded-lg">
                    <h1 className="text-xl font-semibold flex items-center justify-center pt-2 pb-8">Datos del empleado</h1>

                    {/*  PRIMERA PARTE DEL MENU IZQUIERDO   */}
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
                            placeholder="Nombre"
                            value={datos.empleadoNombre}
                            onChange={(val) => handleInputChange('empleadoNombre', val)}
                            readOnly={true}
                        />
                        <Input
                            nombre="Apellido Paterno"
                            tipo="text"
                            placeholder="Apellido paterno"
                            value={datos.apellidoPaterno}
                            onChange={(val) => handleInputChange('apellidoPaterno', val)}
                            readOnly={true}
                        />
                        <Input
                            nombre="Apellido Materno"
                            tipo="text"
                            placeholder="Apellido materno"
                            value={datos.apellidoMaterno}
                            onChange={(val) => handleInputChange('apellidoMaterno', val)}
                            readOnly={true}
                        />
                    </div>

                    {/*  SEGUNA PARTE DEL MENU IZQUIERDO   */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
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
                            nombreSelect={"Sexo"}
                            options={OPCIONES_SEXO}
                            value={datos.sexo}
                            readOnly={false}
                            onChange={(val) => handleInputChange("sexo", val)}
                        />
                        <Select
                            nombreSelect={"Estado Civil"}
                            options={OPCIONES_ESTADO_CIVIL}
                            value={datos.estadoCivil || ""}
                            readOnly={false}
                            onChange={(val) => { handleInputChange('estadoCivil', val) }}
                        />
                        <Input
                            nombre="Fecha de Nacimiento"
                            placeholder="Fecha de Nacimiento"
                            tipo="date"
                            min={minFecha}
                            max={maxFecha}
                            value={datos.fechaNacimiento}
                            onChange={(val) => { handleInputChange('fechaNacimiento', val) }}
                            readOnly={false}
                        />
                        <Input
                            nombre="Lugar de nacimiento"
                            placeholder="Lugar"
                            tipo="text"
                            value={datos.lugarNacimiento}
                            onChange={(val) => {
                                if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(val)) {
                                    handleInputChange('lugarNacimiento', val)
                                }
                            }}
                            readOnly={false}
                        />
                        <div className="col-span-1 sm:col-span-2 flex flex-col gap-2 w-full mt-1">
                            <label className="text-sm font-bold text-gray-700">Domicilio</label>
                            <textarea
                                className="w-full border-b-[.1px] border-black p-2 bg-transparent focus:border-blue-700 outline-none resize-none"
                                placeholder="Ingrese el domicilio"
                                value={datos.domicilio}
                                rows={2}
                                onChange={(e) => handleInputChange('domicilio', e.target.value)}
                                readOnly={false}
                            ></textarea>
                        </div>
                        <Input
                            nombre="Colonia"
                            placeholder="Colonia"
                            tipo="text"
                            value={datos.colonia}
                            onChange={(val) => { handleInputChange('colonia', val) }}
                            readOnly={false}
                        />
                        <Input
                            nombre="Código Postal"
                            placeholder="C.P."
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
                </div>

                {/* ////////////////////////////////////////////////////MENU DERECHO\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
                <div className="w-full md:w-1/2 p-5 box-border shadow-xl border border-gray-800 rounded-lg flex flex-col gap-4">
                    <h1 className="text-xl font-semibold flex items-center justify-center pt-2 pb-4">Biométricos</h1>
                    <div className="content-around text-center">
                        <Boton
                            nombreBoton="Capturar huella"
                            color={`cursor-pointer mb-4 text-white 
                                ${huellaBase64 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                            onClick={handleCapturarHuella}
                        />

                        {huellaBase64 && (
                            <div className="mb-4 p-2 bg-green-100 border border-green-500 rounded">
                                <span className="text-green-700 text-sm font-bold">✓ Huella capturada y lista</span>
                            </div>
                        )}

                        <Canvas onEnviar={handleFirmaRecibida} />

                    </div>
                </div>
            </div>
            <Modal
                abierto={modalAbierto}
                estado={estadoHuella}
                mensaje={mensajeHuella}
            />
        </div>
    );
}

export default CardFor;