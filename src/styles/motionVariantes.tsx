import { type Variants } from "framer-motion";

// COMPONENTE DE INICIO Y SALIDA DE CARD
export const animacionInicio: Variants = {
    initial: {
        y: 135,
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
        y: -135,
        transition: {
            duration: 0.3
        },
    },
};

//// COMPONENTE PARA EL RENDERIZADO POR PARTES 
// PADRE
export const contenedorVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.5,
        }
    }
};
// HIJOS
export const itemizquierdaVariants = {
    hidden: { y: 80, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};
export const itemsDerechaVariants = {
    hidden: { y: -80, opacity: 0 },
    visible: { y: 0, opacity: 1 }
}
////


// COMPONENTE DE BOTONES
export const botonVariants: Variants = {
    whileTap: { scale: 0.90 },
    animate: {
        transition: {
            scale: { type: "spring", stiffness: 400, damping: 17 }
        },
    },
    whileHover: { y: -3 }
}


// COMPONENTE DE INPUTS Y DOMICILIO
export const inputsVariant: Variants = {
    initial: {
        borderBottomWidth: 2,
    },
    focused: {
        borderColor: 'oklch(54.6% 0.245 262.881)',
    },
}

// COMPONENDE DE INPUTS Y DOMICILIO
export const clicVariant: Variants = {
    whileTap: { scale: 0.98 }
}

// COMPONENTE DEL MODAL
export const modalVariant: Variants = {
    initial: {
        scale: 0,
        opacity: 0
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

