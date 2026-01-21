import { useState } from "react"
import Select from "./select"
import Input from "./input"
import Boton from "./boton"
import Canvas from "./canvas"

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

    // idEmpresaSel

    function avisoHuella() {
        alert('Huella capturada');
    }

    return (

        // CONTAINER
        <div className="p-3">
            <div className="flex flex-wrap md:flex-nowrap gap-6 p-4 w-full">

                {/* INICIO MENU IZQUIERDO */}
                <div className="flex-1 md:w-1/2 p-5 box-border shadow-xl border border-gray-800 rounded-lg">
                    <h1 className="text-xl font-semibold flex items-center justify-center p-4">Datos del empleado</h1>
                    {/* DATOS PERSONALES */}
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
                            placeholder="No. Empleado"
                            tipo="number"
                            onChange={() => { }} />
                        <Input
                            nombre="Nombre"
                            placeholder="Nombre"
                            tipo="text"
                            onChange={() => { }} />
                        <Input
                            nombre="Apellido Paterno"
                            placeholder="Apellido Paterno"
                            tipo="text"
                            onChange={() => { }} />
                        <Input nombre="Apellido Materno"
                            placeholder="Apellido Materno"
                            tipo="text"
                            onChange={() => { }} />
                    </div>

                    {/* DOMICILIO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        <Input
                            nombre="Curp"
                            placeholder="CURP"
                            tipo="text"
                            onChange={() => { }} />
                        <Input
                            nombre="RFC"
                            placeholder="RFC"
                            tipo="text"
                            onChange={() => { }} />
                        <Select
                            nombreSelect={"Sexo"}
                            options={OPCIONES_SEXO}
                            onChange={(val) => setIdEmpresaSel(val)}
                        />
                        <Select
                            nombreSelect={"Estado Civil"}
                            options={OPCIONES_ESTADO_CIVIL}
                            onChange={(val) => setIdEmpresaSel(val)}
                        />
                        <Input
                            nombre="Fecha de Nacimiento"
                            placeholder="dd/mm/aaaa"
                            tipo="date"
                            onChange={() => { }} />
                        <Input
                            nombre="LugarNac"
                            placeholder="Lugar de nacimiento"
                            tipo="text"
                            onChange={() => { }} />
                        <div className="col-span-1 sm:col-span-2 flex flex-col gap-2 w-full mt-4">
                            <label className="text-sm font-bold text-gray-700">Domicilio</label>
                            <textarea
                                id="domicilioTextArea"
                                className="w-full border-b-[.1px] border-black p-2 focus:outline-0 font-sans rounded resize-none bg-transparent focus:border-blue-700 focus:outline-hidde"
                                placeholder="Ingrese el domicilio"
                                rows={2}
                            ></textarea>
                        </div>
                        <Input nombre="Colonia" placeholder="Colonia" tipo="text" onChange={() => { }} />
                        <Input nombre="Código Postal" placeholder="Codigo Postal" tipo="text" onChange={() => { }} />
                    </div>
                </div>
                {/* FIN MENU IZQUIERDO */}


                {/* INICIO MENU DERECHO */}
                <div className="w-full md:w-1/2 p-5 box-border shadow-xl border border-gray-800 rounded-lg flex flex-col gap-4">
                    <h1 className="text-xl font-semibold flex items-center justify-center p-4">Biométricos</h1>
                    <div className="content-around">
                        <Boton
                            nombreBoton="Capturar huella"
                            color='bg-blue-500 text-white hover:bg-blue-600'
                            onClick={avisoHuella}
                        />
                        <Canvas />
                    </div>
                </div>
                {/* FIN MENU DERECHO */}

            </div>
        </div>
        // FIN CONTAINER
        
    )
}

export default CardFor