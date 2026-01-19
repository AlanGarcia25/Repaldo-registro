import Select from "./select"
import Input from "./input"
import Boton from "./boton"


function CardFor() {

    function avisoHuella(){
        alert('huella capturada')
    }

    return (
        <div className="flex gap-6 p-4 w-full">
            {/* columna izquierda */}
            <div className="w-1/2 p-5 box-border shadow-xl ring-gray-200/50 border border-gray-800 rounded-lg">
                <h1 className="text-xl font-semibold flex items-center justify-center p-4">Datos del empleado</h1>

                <div className="grid grid-cols-2 gap-4">

                    <Select sizeSelect="w-60" nombreSelect="Empresa" />
                    <Select sizeSelect="w-60" nombreSelect="Tipo Jornal" />

                    <Input nombre="No. Empleado" placeholder="Ingrese su No. Empleado" tipo="number" sizeBoton="w-60" onChange={() => { }} />
                    <Input nombre="Nombre" placeholder="Ingrese su nombre" tipo="text" sizeBoton="w-60" onChange={() => { }} />

                    <Input nombre="Apellido Paterno" placeholder="Ingrese su Apellido Paterno" tipo="text" sizeBoton="w-60" onChange={() => { }} />
                    <Input nombre="Apellido Materno" placeholder="Ingrese su Apellido Materno" tipo="text" sizeBoton="w-60" onChange={() => { }} />

                    <Input nombre="Curp" placeholder="Ingrese su CURP" tipo="text" sizeBoton="w-60" onChange={() => { }} />
                    <Select sizeSelect="w-60" nombreSelect="Sexo" />

                    <Select sizeSelect="w-60" nombreSelect="Estado Civil" />
                    <Input nombre="Fecha de Nacimiento" placeholder="Ingrese su Fecha de Nacimiento" tipo="date" sizeBoton="w-60" onChange={() => { }} />

                    <div className="col-span-2 flex flex-col gap-2 w-140 align-center justify-center mx-auto">
                        <label className="text-sm font-bold text-gray-700">Domicilio</label>
                        <textarea
                            className="w-full bg-[#FAF5F5] border-b-[.1px] border-black p-2 focus:outline-0 font-sans rounded resize-none"
                            placeholder="Ingrese el domicilio completo"
                            rows={3}
                        ></textarea>
                    </div>

                    <Input nombre="Colonia" placeholder="Ingrese su colonia" tipo="text" sizeBoton="w-60" onChange={() => { }} />
                    <Input nombre="Código Postal" placeholder="Ingrese su Codigo Postal" tipo="text" sizeBoton="w-60" onChange={() => { }} />
                </div>
            </div>
            {/* columna derecha */}
            <div className="w-1/2 p-6 box-border shadow-xl ring-gray-200/50 border border-gray-800 rounded-lg">
                <h1 className="text-xl font-semibold flex items-center justify-center p-4">Biométricos</h1>
                <div className="grid grid-rows gap-6 align-center justify-center">
                    <Boton
                        nombreBoton="Capturar huella"
                        color='bg-blue-500 text-white hover:bg-blue-600'
                        onClick={avisoHuella}
                    />
                    <canvas className="box-content border"></canvas>
                </div>
            </div>
        </div>
    )
}

export default CardFor