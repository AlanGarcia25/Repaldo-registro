import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Boton from './boton';

interface CanvasProps {
    onEnviar: (url: string) => void;
}

function Canvas({ onEnviar }: CanvasProps) {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [estaVacio, setEstaVacio] = useState(true);

    const handleClear = () => {
        sigCanvas.current?.clear();
        setEstaVacio(true);
    };

    const revisarFirma = () => {
        if (sigCanvas.current) {
            setEstaVacio(sigCanvas.current.isEmpty());
        }
    };

    const enviarDatos = () => {
        if (estaVacio) return;

        const canvas = sigCanvas.current?.getCanvas();
        if (canvas) {
            const dataURL = canvas.toDataURL('image/png');
            onEnviar(dataURL);
            alert('Datos enviados con éxito');
            handleClear();
            window.location.reload()
        }
    };

    return (
        <div className='pt-2'>
            <div className="border border-gray-800 bg-[#f9f9f9]">
                <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{ className: 'sigCanvas w-full h-40' }}
                    onEnd={revisarFirma}
                    backgroundColor="white"
                    minWidth={3.5}
                    maxWidth={1}
                />
            </div>

            <div className="flex pt-4 gap-6">
                <Boton
                    nombreBoton="Limpiar"
                    onClick={handleClear}
                    color="bg-stone-600 hover:bg-stone-800"
                />
                <Boton
                    nombreBoton="Enviar"
                    disabled={estaVacio}
                    onClick={enviarDatos}
                    color={estaVacio ? "bg-yellow-600/40 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-600 cursor-pointer"}
                />
            </div>
        </div>
    );
}
export default Canvas;