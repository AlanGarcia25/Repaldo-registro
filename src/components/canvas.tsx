import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Boton from './boton';

function Canvas() {
    const sigCanvas = useRef<SignatureCanvas>(null);

    const handleClear = () => {
        sigCanvas.current?.clear();
    };

    const enviarDatos = () => {
        alert('Datos enviados con éxito');
    };

    return (
        <div className='pt-2'>
            <div className="border border-gray-800">
                <SignatureCanvas
                    minDistance={5}
                    velocityFilterWeight={0.2}
                    ref={sigCanvas}
                    canvasProps={{ className: 'sigCanvas w-full h-40' }}
                />
            </div>
            <div className="flex pt-4 gap-6">
                <Boton nombreBoton="Limpiar" onClick={handleClear} color="bg-gray-400 hover:bg-gray-500" />
                <Boton nombreBoton="Guardar" onClick={enviarDatos} color="bg-green-600/80 hover:bg-green-600" />
            </div>
        </div>
    );
}

export default Canvas