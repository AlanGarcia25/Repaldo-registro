import React from "react"
import { useNavigate } from "react-router-dom"
import Input from "./input"
import Boton from "./boton"

const Card = () => {
    const [nombre, setNombre] = React.useState("")
    const [password, setPassword] = React.useState("")
    const usuario = {
        nombre: "admin",
        password: "admin123"
    }
    const navigate = useNavigate();

    function validacion() {
        if ((nombre === usuario.nombre) && (password === usuario.password)) {
            localStorage.setItem("auth", "true");
            navigate("/formulario");
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="box-border p-6 w-full max-w-md shadow-xl ring-gray-200/50 border border-gray-200 rounded-lg">
                <h1 className="text-xl font-semibold flex items-center justify-center p-4">Inicio de sesión</h1>
                <Input
                    nombre="usuario"
                    placeholder="Ingresa tu usuario"
                    tipo="text"
                    value={nombre}
                    onChange={setNombre}
                />
                <Input
                    nombre="Contraseña"
                    placeholder="Ingresa tu contraseña"
                    tipo="password"
                    value={password}
                    onChange={setPassword}
                />
                <Boton
                    nombreBoton="Iniciar sesión"
                    color='bg-blue-500 text-white hover:bg-blue-600'
                    onClick={validacion}
                />
            </div>
        </div>
    )
}

export default Card