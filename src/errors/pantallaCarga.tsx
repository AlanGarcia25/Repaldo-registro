import { motion, AnimatePresence } from 'motion/react';

export default function PantallaCarga({ cargando }: { cargando: boolean }) {
    return (
        <AnimatePresence>
            {cargando && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-black/40 "
                >
                    <div className=" py-8 px-10 rounded-xl">
                        <div className="h-24 flex flex-col items-center justify-center mb-2">
                            <svg width="50" height="50" viewBox="0 0 50 50">
                                <motion.circle
                                    cx="25"
                                    cy="25"
                                    r="20"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    fill="transparent"
                                    animate={{
                                        pathLength: [0.1, 0.8, 0.1],
                                        pathOffset: [0, 0.5, 1],
                                        rotate: [0, 360],
                                        stroke: ["#fb2c36", "#f59e0b", "#fb2c36"]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                            </svg>
                        </div>

                        <div className="text-center">
                            <p className="text-white font-black text- tracking-[0.2em] uppercase">
                                Buscando Empleado
                            </p>
                            <motion.span
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-white text-[0.7rem] font-bold tracking-widest"
                            >
                                POR FAVOR ESPERE...
                            </motion.span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}