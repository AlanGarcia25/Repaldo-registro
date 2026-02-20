import { type Variants } from "framer-motion";

export const animacionInicio: Variants = {
    initial: {
        y:135,
        opacity: 0
    },
    animate: {
        scale: 1,
        y: 0,
        opacity: 1,
        transition: {
            y: {
                type: "spring",
            },
            opacity: {
                duration: 0.8
            },
        },
    },
    exit: {
        opacity: 0,
        y:-135,
        transition: {
            duration: 0.3
        },
    },
};


export const contenedorVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
        }
    }
};

export const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export const botonVariants: Variants = {
    whileTap: { scale: 0.90 },
    animate: {
        transition: {
            scale: { type: "spring", stiffness: 400, damping: 17 }
        },
    },
    whileHover: { y: -3 }
}

export const inputsVariant: Variants = {
    initial: {
        y:0,
        borderBottomWidth: 2,
        borderColor: 'oklch(55.1% 0.027 264.364)'
    },
    focused: {
        y: -2,
        borderColor: 'oklch(54.6% 0.245 262.881)',
    },
}


export const modalVariant: Variants = {
    initial: {
        scale: 0,
        opacity:0
    },
    animate: {
        scale: 1,
        opacity: 1,
    },
    exit: {
        opacity: 1,
        transition: {
            duration: 0
        },
    },
};
