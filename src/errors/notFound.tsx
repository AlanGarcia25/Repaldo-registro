import { Link } from "react-router-dom"
import { motion } from "motion/react"

const MotionLink = motion.create(Link)

function NotFound() {
    return (
        <motion.section className="flex items-center h-screen p-16"
            style={{
                backgroundImage: "linear-gradient(90deg, #E2E8F0 0%, #CBD5E1 25%, #FFFFFF 50%, #CBD5E1 75%, #E2E8F0 100%)",
                backgroundSize: "200% auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            animate={{
                backgroundPosition: ["0% center", "-200% center"]
            }}
            transition={{
                duration: 12,
                ease: "linear",
                repeat: Infinity
            }}>
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 2xl:text-[10rem] font-extrabold text-9xl dark:text-gray-400 animate-sube-baja">
                        404
                    </h2>
                    <p className="text-2xl md:text-3xl 2xl:text-4xl font-semibold animate-pulso-lento">Pagina no encontrada</p>
                    <p className="text-sm md:text-base 2xl:text-[1.188rem] mt-2 sm:mt-4 mb-8 dark:text-gray-600 truncate">Para regresar presione el boton de abajo.</p>
                    <MotionLink
                        to="/"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="text-base  2xl:text-xl px-4 py-2 2xl:px-6 2xl:py-3 transition-colors duration-500 ease-in-ou cursor-pointer bg-blue-500 text-white hover:bg-blue-600 rounded-md truncate">
                        Regresar a la pagina de inicio
                    </MotionLink>
                </div>
            </div>
        </motion.section >
    )
}

export default NotFound