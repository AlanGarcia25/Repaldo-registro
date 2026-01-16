import React from "react"
import Input from "./input"
import Boton from "./boton"

const Card = () => {
    const [nombre, setNombre] = React.useState("")
    const [password, setPassword] = React.useState("")


    const usuario = [{ id: 1, nombre: "admin", password: "admin123" }]

    function submitHandler(nombre: string, password: string) {
        if ((nombre === usuario[0].nombre) && (password === usuario[0].password)) {
            alert("Inicio de sesión exitoso");
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    }
    function validacion() {
        if ((nombre === usuario[0].nombre) && (password === usuario[0].password)) {
            alert("Inicio de sesión exitoso");
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="box-border p-6 w-full max-w-md shadow-xl ring-gray-200/50 border border-gray-200">
                <h1 className="text-xl font-semibold flex items-center justify-center p-4">Inicio de sesión</h1>
                <Input
                    nombre="usuario"
                    placeholder="Ingresa tu usuario"
                    value={nombre}
                    onChange={setNombre}
                />
                <Input
                    nombre="Contraseña"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    tipo="password"
                    onChange={setPassword}
                />
                <Boton
                    nombreBoton="Iniciar sesión"
                    nombreUsuario={nombre}
                    password={password}
                    color="bg-blue-500 text-white hover:bg-blue-600"
                    onChange={submitHandler}
                    onClick={validacion}
                />
            </div>
        </div>
    )
}

export default Card