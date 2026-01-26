import { useState } from "react"
import Select from "./select"
import Input from "./input"
import Boton from "./boton"
import Canvas from "./canvas"

import type { datosEmpleado } from "../models/api.models"

import { useSelectApi } from "../hooks/useSelectApi";
import { getNombreEmpresas } from "../services/api.config";
import { getDatosEmpleado } from "../services/api.config"
import { OPCIONES_TIPO_JORNAL, OPCIONES_ESTADO_CIVIL } from "./data"

function CardFor() {
    const [, setIdEmpresaSel] = useState("");
    const handleInputChange = (campo: keyof datosEmpleado, valor: string | number) => {
        setDatos(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    // OBTENCION DE DATOS PARA EMPRESAS Y EMPLADO
    const [listaEmpleadosOriginal, setListaEmpleadosOriginal] = useState<datosEmpleado[]>([]);
    const { options: empresasOptions, loading: loadingEmpresas } = useSelectApi(
        getNombreEmpresas,
        (emp) => ({ value: emp.empresaId, label: emp.empresaNombre })
    );

    const { options: empleadoOptions } = useSelectApi(
        async () => {
            const res = await getDatosEmpleado();
            setListaEmpleadosOriginal(res);
            return res;
        },
        (emp) => ({
            value: emp.empleadoId,
            label: `${emp.empleadoNombre} ${emp.apellidoPaterno}`
        })
    );

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
        // NO SE USA DE MOMENTO
        estadoCivil: ""
        // NO SE USA DE MOMENTO
    });

    const handleEmpleadoChange = (id: string | number) => {
        const seleccionado = listaEmpleadosOriginal.find(e => e.empleadoId === id);
        if (seleccionado) {
            setDatos(seleccionado);
        }
    };
    // FIN DE OBTENCION DE DATOS PARA EMPRESAS Y EMPLADO

    const avisoHuella = () => {
        alert("La huella se registro con exito")
    }

    return (
        <div className="p-3">
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-4 w-full">
                {/* MENU IZQUIERDO */}
                <div className="flex-1 md:w-1/2 p-5 box-border shadow-xl border border-gray-800 rounded-lg">
                    <h1 className="text-xl font-semibold flex items-center justify-center pb-5">Datos del empleado</h1>

                    {/* PRIMERO PARTE MENO IZQUIERO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        <Select
                            nombreSelect={loadingEmpresas ? "Cargando..." : "Empresa"}
                            options={empresasOptions}
                            readOnly={true}
                            onChange={(val) => setIdEmpresaSel(val)}
                        />
                        <Select
                            nombreSelect={"Tipo jornal"}
                            options={OPCIONES_TIPO_JORNAL}
                            readOnly={true}
                            onChange={(val) => setIdEmpresaSel(val)}
                        />
                        <Input
                            nombre="No. Empleado"
                            tipo="text"
                            placeholder="No.Empleado"
                            value={datos.colonia}
                            onChange={() => { handleEmpleadoChange }}
                            readOnly={true}
                        />
                        <Input
                            nombre="Nombre"
                            tipo="text"
                            placeholder="Nombre"
                            value={datos.empleadoNombre}
                            onChange={() => { handleEmpleadoChange }}
                            readOnly={true}
                        />
                        <Input
                            nombre="Apellido Paterno"
                            tipo="text"
                            placeholder="Apellido materno"
                            value={datos.apellidoPaterno}
                            onChange={() => { handleEmpleadoChange }}
                            readOnly={true}
                        />
                        <Input
                            nombre="Apellido Materno"
                            tipo="text"
                            placeholder="Apellido paterno"
                            value={datos.apellidoMaterno}
                            onChange={() => { handleEmpleadoChange }}
                            readOnly={true}
                        />
                    </div>

                    {/* SEGUNDA PARTE MENU IZQUIERPO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        <Input
                            nombre="Curp"
                            placeholder="CURP"
                            tipo="text"
                            value={datos.empleadoCURP}
                            readOnly={true}
                            onChange={() => { handleEmpleadoChange }} />
                        <Input
                            nombre="RFC"
                            placeholder="RFC"
                            tipo="text"
                            value={datos.empleadoRFC}
                            readOnly={true}
                            onChange={() => { handleEmpleadoChange }} />
                        <Select
                            nombreSelect={"Sexo"}
                            options={empleadoOptions}
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
                            value={datos.fechaNacimiento}
                            tipo="date"
                            readOnly={false}
                            onChange={(val) => { handleInputChange('fechaNacimiento', val) }}
                        />
                        <Input
                            nombre="LugarNac"
                            placeholder="Lugar"
                            tipo="text"
                            value={datos.lugarNacimiento}
                            readOnly={false}
                            onChange={(val) => { handleInputChange('lugarNacimiento', val) }}
                        />

                        <div className="col-span-1 sm:col-span-2 flex flex-col gap-2 w-full mt-4">
                            <label className="text-sm font-bold text-gray-700">Domicilio</label>
                            <textarea
                                className="w-full border-b-[.1px] border-black p-2 bg-transparent focus:border-blue-700 outline-none resize-none"
                                placeholder="Ingrese el domicilio"
                                defaultValue={datos.domicilio}
                                rows={2}
                                readOnly={false}
                            ></textarea>
                        </div>
                        <Input nombre="Colonia"
                            placeholder="Colonia"
                            tipo="text"
                            value={datos.colonia}
                            readOnly={false}
                            onChange={(val) => { handleInputChange('colonia', val) }}
                        />
                        <Input nombre="Código Postal"
                            placeholder="C.P."
                            tipo="number"
                            value={datos.codigoPostal}
                            readOnly={false}
                            onChange={(val) => { handleInputChange('codigoPostal', val) }}
                        />
                    </div>
                </div>

                {/* MENU DERECHO */}
                <div className="w-full md:w-1/2 p-5 box-border shadow-xl border border-gray-800 rounded-lg flex flex-col gap-4">
                    <h1 className="text-xl font-semibold flex items-center justify-center pb-5">Biométricos</h1>
                    <div className="content-around text-center">
                        <Boton
                            nombreBoton="Capturar huella"
                            color='cursor-pointer bg-blue-500 text-white hover:bg-blue-600 mb-4'
                            onClick={avisoHuella}
                        />
                        <Canvas />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CardFor;