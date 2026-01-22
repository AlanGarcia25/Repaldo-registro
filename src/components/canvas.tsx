import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Boton from './boton';

function Canvas() {
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

    const descargarImagen = () => {
        const canvas = sigCanvas.current?.getCanvas();
        if (canvas) {
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'firma.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const enviarDatos = () => {
        if (estaVacio) {
            alert("No puedes enviar una firma vacía");
            return;
        }
        alert('Datos enviados con éxito');
        descargarImagen();
        handleClear();
    };

    return (
        <div className='pt-2'>
            <div className="border border-gray-800">
                <SignatureCanvas
                    minDistance={5}
                    backgroundColor="white"
                    velocityFilterWeight={0.2}
                    ref={sigCanvas}
                    canvasProps={{ className: 'sigCanvas w-full h-40' }}
                    onEnd={revisarFirma}
                />
            </div>

            <div className="flex pt-4 gap-6">
                <Boton
                    nombreBoton="Limpiar"
                    onClick={handleClear}
                    color="cursor-pointer bg-stone-600 hover:bg-stone-800"
                />
                <Boton
                    nombreBoton="Guardar"
                    disabled={estaVacio}
                    onClick={enviarDatos}
                    color={estaVacio ? "cursor-not-allowed bg-green-600/40" : "cursor-pointer bg-green-600/80 hover:bg-green-600"}
                />
            </div>
        </div>
    );
}

export default Canvas;