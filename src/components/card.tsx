import Swal from 'sweetalert2';
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../services/api.config";
import { motion, AnimatePresence } from "motion/react"

import { animacionInicio } from "../styles/motionVariantes";

import axios from "axios"
import Input from "./input"
import Boton from "./boton"

const Card = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [enviado, setEnviado] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [correoElec, setCorreoElec] = useState(false);

    const enviarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setCargando(true)
        if (!email.trim() || !password.trim()) {
            Swal.fire({
                title: "Atencion",
                text: "Por favor, completa todos los campos",
                icon: "warning",
                timer: 2100,
                showConfirmButton: false,
                timerProgressBar: true,
            })
            setCargando(false)
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setCorreoElec(true);
            setEmail('')
            return;
        }
        try {
            const credenciales = { Email: email, Password: password };
            const response = await axios.post(`${BASE_URL}/usuario/contrato/login`, credenciales, { timeout: 5000 }); // --------

            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem("auth", "true");
            sessionStorage.setItem("empresaname", email); 0

            await Swal.fire({
                title: "Exito",
                text: "Se inicio sesion",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
                toast: true,
                position: "top-end",
                color: '#000',
            })
            setEmail('')
            setPassword('')
            setEnviado(true)

        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo iniciar sesion",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
            }).then(() => {
                setEmail('')
                setPassword('')
            })
            setCargando(false);
            console.error("Error al iniciar sesion", error);
        }
    };

    return (
        <AnimatePresence>
            {!enviado && (
                <div className="min-h-screen flex items-center justify-center ">
                    <motion.div layout variants={animacionInicio} initial="initial" animate="animate" exit="exit" onAnimationComplete={() => { if (enviado) { navigate("/formulario", { replace: true }); } }}
                        className="box-border p-6 2xl:p-7 w-5/6 h-auto sm:w-3/5 sm:h-3/4 lg:w-2/5 shadow-xl/30 ring-gray-200/50 border-2 border-gray-300 rounded-lg">
                        <h1 className="text-xl 2xl:text-2xl font-semibold flex items-center justify-center pt-2 pb-8">Inicio de sesión</h1>
                        <form onSubmit={enviarDatos}>
                            <Input
                                nombre="Correo"
                                tipo="text"
                                value={email}
                                onChange={(value) => {
                                    setEmail(value);
                                    if (correoElec) setCorreoElec(false);
                                }}
                                placeholder="tucorreo@ejemplo.com"
                            />
                            {correoElec && (
                                <p className="text-red-500 text-sm pb-1">Correo electrónico inválido</p>
                            )}
                            <Input
                                nombre="Contraseña"
                                tipo="password"
                                value={password}
                                onChange={(value) => setPassword(value)}
                                placeholder="Ingresa tu contraseña"
                            />
                            <div className="pt-4">
                                <Boton
                                    nombreBoton="Iniciar sesión"
                                    color={`bg-blue-500 text-white hover:bg-blue-600 ${cargando ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    disabled={cargando}
                                />
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default Card
