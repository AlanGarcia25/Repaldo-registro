import { useState } from "react"
import Select from "./select"
import Input from "./input"
import Boton from "./boton"
import Canvas from "./canvas"

import { useTokenData } from "../hooks/useTokenData"
import { useSelectApi } from "../hooks/useSelectApi";
import { getNombreEmpresas } from "../services/api.config";
import { OPCIONES_TIPO_JORNAL, OPCIONES_ESTADO_CIVIL, OPCIONES_SEXO } from "./data"

function CardFor() {
    const { options: empresasOptions, loading: loadingEmpresas } = useSelectApi(
        getNombreEmpresas,
        (emp) => ({
            value: emp.empresaId,
            label: emp.empresaNombre
        })
    );

    const [, setIdEmpresaSel] = useState("");
    const datos = useTokenData(); 

    function avisoHuella() {
        alert('Huella capturada');
    }

    return (
        <div className="p-3">
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-4 w-full">
                {/* MENU IZQUIERDO */}
                <div className="flex-1 md:w-1/2 p-5 box-border shadow-xl border border-gray-800 rounded-lg">
                    <h1 className="text-xl font-semibold flex items-center justify-center p-4">Datos del empleado</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                        <Select
                            nombreSelect={loadingEmpresas ? "Cargando..." : "Empresa"}
                            options={empresasOptions}
                            onChange={(val) => setIdEmpresaSel(val)}
                        />
                        <Select
                            nombreSelect={"Tipo jornal"}
                            options={OPCIONES_TIPO_JORNAL}
                            onChange={(val) => setIdEmpresaSel(val)}
                        />
                        <Input
                            nombre="No. Empleado"
                            tipo="text"
                            placeholder="No.Empleado"
                            value={datos.empleadoId}
                            onChange={() => { }}
                        />
                        <Input
                            nombre="Nombre"
                            tipo="text"
                            placeholder="Nombre"
                            value={datos.empleadoNombre}
                            onChange={() => { }}
                        />
                        <Input
                            nombre="Apellido Paterno"
                            tipo="text"
                            placeholder="Apellido materno"
                            value={datos.apellidoPaterno}
                            onChange={() => { }}
                        />
                        <Input
                            nombre="Apellido Materno"
                            tipo="text"
                            placeholder="Apellido paterno"
                            value={datos.apellidoMaterno}
                            onChange={() => { }}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        <Input
                            nombre="Curp"
                            placeholder="CURP"
                            tipo="text"
                            value={datos.empleadoCURP}
                            onChange={() => { }} />
                        <Input
                            nombre="RFC"
                            placeholder="RFC"
                            tipo="text"
                            value={datos.empleadoRFC}
                            onChange={() => { }} />
                        <Select
                            nombreSelect={"Sexo"}
                            options={OPCIONES_SEXO}
                            value={datos.sexo}
                            onChange={() => { }} />
                        <Select
                            nombreSelect={"Estado Civil"}
                            options={OPCIONES_ESTADO_CIVIL}
                            onChange={() => { }} />
                        <Input
                            nombre="Fecha de Nacimiento"
                            placeholder="Fecha de Nacimiento"
                            value={datos.fechaNacimiento}
                            tipo="date" onChange={() => { }} />
                        <Input
                            nombre="LugarNac"
                            placeholder="Lugar"
                            tipo="text"
                            value={datos.lugarNacimiento}
                            onChange={() => { }} />

                        <div className="col-span-1 sm:col-span-2 flex flex-col gap-2 w-full mt-4">
                            <label className="text-sm font-bold text-gray-700">Domicilio</label>
                            <textarea
                                className="w-full border-b-[.1px] border-black p-2 bg-transparent focus:border-blue-700 outline-none resize-none"
                                placeholder="Ingrese el domicilio"
                                defaultValue={datos.domicilio}

                                rows={2}
                            ></textarea>
                        </div>
                        <Input nombre="Colonia"
                            placeholder="Colonia"
                            tipo="text"
                            value={datos.colonia}
                            onChange={() => { }} />
                        <Input nombre="Código Postal"
                            placeholder="C.P."
                            tipo="number"
                            value={datos.codigoPostal}
                            onChange={() => { }} />
                    </div>
                </div>

                {/* MENU DERECHO */}
                <div className="w-full md:w-1/2 p-5 box-border shadow-xl border border-gray-800 rounded-lg flex flex-col gap-4">
                    <h1 className="text-xl font-semibold flex items-center justify-center p-4">Biométricos</h1>
                    <div className="content-around text-center">
                        <Boton
                            nombreBoton="Capturar huella"
                            color='bg-blue-500 text-white hover:bg-blue-600 mb-4'
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