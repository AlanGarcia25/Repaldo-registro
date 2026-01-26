import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "./input"
import Boton from "./boton"
import type { Usuario } from "../models/api.models"
import axios from "axios"


const Card = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [datos] = useState<Usuario>({
        Email: "",
        Password: "",
    });

    const enviarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            datos.Email = "cenriquez@agrocir.com";
            datos.Password = "ag2026AGR.";
            // console.log(`se mandaron los datos ${datos.Email}`)
            const response = await axios.post('http://10.10.0.136:7222/api/usuario/contrato/login', datos);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem("auth", "true");
            navigate("/formulario", { replace: true });
        } catch (error) {
            console.error("Error al iniciar sesion", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="box-border p-6 w-full max-w-md shadow-xl ring-gray-200/50 border border-gray-200 rounded-lg">
                <h1 className="text-xl font-semibold flex items-center justify-center p-4">Inicio de sesión</h1>
                <form onSubmit={enviarDatos}>
                    <Input
                        nombre="Usuario"
                        value={email}
                        onChange={(value) => setEmail(value)}
                        tipo="email"
                        placeholder="Ingresa tu correo"
                    />
                    <Input
                        nombre="Contraseña"
                        tipo="password"
                        value={password}
                        onChange={(value) => setPassword(value)}
                        placeholder="Ingresa tu contraseña"
                    />
                    <Boton
                        nombreBoton="Iniciar sesión"
                        color='cursor-pointer bg-blue-500 text-white hover:bg-blue-600'
                    // onClick={validacion}
                    />
                </form>
            </div>
        </div>
    )
}

export default Card

// localStorage.setItem("auth", "true");
//             navigate("/formulario", { replace: true });