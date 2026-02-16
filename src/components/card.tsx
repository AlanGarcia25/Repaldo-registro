import swal from 'sweetalert';
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../services/api.config";

import Input from "./input"
import Boton from "./boton"
import axios from "axios"


const Card = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const enviarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email.trim() || !password.trim()) {
            swal({
                title: "Atencion",
                text: "Por favor, completa todos los campos",
                icon: "warning",
                timer: 1500,
                buttons: {
                    visble: false
                }
            })
            return;
        } 
        try {
            const credenciales = { Email: email, Password: password };
            console.log(JSON.stringify(credenciales, null, 2))
            const response = await axios.post(`${BASE_URL}/usuario/contrato/login`, credenciales,{ timeout:5000 }); // --------
            localStorage.setItem('token', response.data.token);
            localStorage.setItem("auth", "true");
            localStorage.setItem("empresaname", email);
            await swal({
                title: "Exito",
                text: "Se inicio sesion",
                icon: "success",
                timer: 2000,
                buttons: {
                    visble: false
                }
            })
            setEmail('')
            setPassword('')
            navigate("/formulario", { replace: true });

        } catch (error) {
            swal({
                title: "Error",
                text: "No se pudo iniciar sesion",
                icon: "error",
                timer: 3000,
                buttons: {
                    visble: false
                }
            }).then(() => {
                setEmail('')
                setPassword('')
            })
            console.error("Error al iniciar sesion", error);
        } 
    };


    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="box-border p-6 w-full max-w-md shadow-xl/30 ring-gray-200/50 border border-gray-200 rounded-lg">
                <h1 className="text-xl font-semibold flex items-center justify-center pt-2 pb-8">Inicio de sesión</h1>
                <form onSubmit={enviarDatos}>
                    <Input
                        nombre="Usuario"
                        tipo="email"
                        value={email}
                        onChange={(value) => setEmail(value)}
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
                    />
                </form>
            </div>
        </div>
    )
}

export default Card
