import type { BotonProps } from "../models/api.models";
import { motion } from "motion/react"
import { botonVariants } from "../styles/motionVariantes";

function Boton({ nombreBoton, color, disabled, onClick }: BotonProps) {
    return (
        <div className="flex flex-col w-full align-center mx-auto gap-4 pb-4 pt-4 max-w[120px] truncate" >
            <motion.button
                variants={botonVariants}
                whileTap="whileTap"
                animate="animate"
                whileHover="whileHover"
                className={`transition-colors duration-500 ease-in-ou w-full 2xl:h-12 py-2 px-4 rounded-md text-base 2xl:text-lg ${color} text-white`}
                onClick={onClick}
                disabled={disabled}
                type="submit"
            >
                {nombreBoton}
            </motion.button>
        </div>
    );
};

export default Boton;