import Swal from 'sweetalert2'
import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

import Boton from "./boton";

import { useEmpleado } from "../context/EmpleadoContext";

function Canvas() {
  const { setUrlFirma, setLimpiarCanvas } = useEmpleado();
  const [estaVacio, setEstaVacio] = useState(true);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    sigCanvas.current?.clear();
    setEstaVacio(true);
  };

  useEffect(() => {
    setLimpiarCanvas(() => handleClear);
  }, []);

  const guardarFirma = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      return;
    }

    const urlFirma = sigCanvas.current.getCanvas().toDataURL("image/png");

    setUrlFirma(urlFirma);
    Swal.fire({
      title: "Guardado exitoso!",
      text: "La firma se ha guardado",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
      allowOutsideClick: false,
      timerProgressBar: true,
    })
  };

  return (
    <div >
      <div className="border-2 2xl:border-3 border-gray-500 bg-[#f9f9f9]">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{ className: "sigCanvas w-full h-30 sm:w-full sm:h-35 md:w-full md:h-35 lg:w-full 2xl:h-42 2xl:w-full" }}
          onEnd={() => setEstaVacio(false)}
          backgroundColor="white"
          minWidth={3.3}
          maxWidth={1}
        />
      </div>

      <div className="flex pt-4 gap-6">
        <Boton
          nombreBoton="Limpiar"
          onClick={handleClear}
          disabled={estaVacio}
          color={estaVacio
            ? "bg-gray-500/50 cursor-not-allowed text-white/90"
            : "bg-stone-600 hover:bg-stone-800"
          }
        />
        <Boton
          nombreBoton="Guardar firma"
          onClick={() => {
            guardarFirma()
            setTimeout(() => {
              handleClear();
            }, 1000)
          }}
          disabled={estaVacio ? true : false}
          color={estaVacio
            ? "bg-gray-500/40 cursor-not-allowed text-white/90"
            : "bg-blue-500 hover:bg-blue-600"}
        />
      </div>
    </div>
  );
}

export default Canvas;
