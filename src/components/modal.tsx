import React, { useEffect } from "react";
import Swal from "sweetalert2";

interface ModalHuellaProps {
    abierto: boolean;
    estado: "escaneando" | "ok" | "error";
    mensaje?: string;
    onClose: () => void;
}

const Modal: React.FC<ModalHuellaProps> = ({ abierto, estado, mensaje, onClose }) => {

    useEffect(() => {
        if (abierto) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [abierto]);

    useEffect(() => {
        if (!abierto) return;

        if (estado === "ok") {
            Swal.fire({
                title: "¡Éxito!",
                text: "Huella capturada correctamente",
                icon: "success",
                timer: 1800,
                showConfirmButton: false,
                stopKeydownPropagation: true,
                allowOutsideClick: false,
                    customClass: {
                popup: 'rounded-2xl border-t-4 border-green-500 shadow-2xl',
            }
            }).then(() => {
                onClose();
            });
}

if (estado === "error") {
    Swal.fire({
        title: "Error",
        text: mensaje || "Error al capturar la huella",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        stopKeydownPropagation: true,
        customClass: {
            popup: 'rounded-2xl border-t-4 border-red-500 shadow-2xl',
        }
    }).then(() => {
        onClose();
    });
}
    }, [estado, abierto, mensaje, onClose]);

if (!abierto) return null;
if (estado !== "escaneando") return null;

const Spinner = () => (
    <svg className="h-14 w-14 animate-spin text-blue-600 mx-auto" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
);

return (
    <div className="fixed inset-0  flex items-center justify-center bg-black/50 backdrop-blur-[1px] p-4 overscroll-contain">
        <div className="bg-white rounded-md shadow-2xl pt-10 pb-10 px-6 w-full max-w-[95%] sm:max-w-[32em] text-center">
            <div className="mb-6">
                <Spinner />
            </div>
            <h2 className="text-[1.5em] font-semibold text-[#545454] leading-tight mb-4">
                Escaneando Huella
            </h2>
            <p className="text-[1rem] text-[#545454] font-normal">
                Por favor, coloque su dedo en el lector...
            </p>
        </div>
    </div>
);
};

export default Modal;