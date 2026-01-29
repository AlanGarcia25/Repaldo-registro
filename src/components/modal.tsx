import React from "react";

interface ModalHuellaProps {
    abierto: boolean;
    estado: "escaneando" | "ok" | "error";
    mensaje?: string;
}

const Modal: React.FC<ModalHuellaProps> = ({ abierto, estado, mensaje }) => {
    if (!abierto) return null;

    const colores = {
        escaneando: "text-slate-800",
        ok: "text-green-600",
        error: "text-red-600",
    };

    const textos = {
        escaneando: "Escaneando huella, por favor coloque su dedo…",
        ok: "Huella capturada correctamente",
        error: mensaje || "Error al capturar la huella",
    };

    const icons = {
        ok: "✅",
        error: "❌",
    };

    const Spinner = () => (
        <svg
            className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4"
            viewBox="0 0 24 24"
            fill="none"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md text-center">

                {estado === "escaneando"}

                {estado !== "escaneando" && (
                    <div className="text-4xl mb-3">
                        {icons[estado]}
                    </div>
                )}

                <div className={`text-lg font-semibold ${colores[estado]}`}>
                    {textos[estado]}
                </div>

                {estado === "escaneando" && (
                    <div className="animate-pulse text-gray-500 text-sm mt-2">
                        <Spinner />
                        Esperando lector…
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
