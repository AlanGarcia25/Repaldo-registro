import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

import Boton from "./boton";

import { useEmpleado } from "../context/EmpleadoContext";

function Canvas() {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [estaVacio, setEstaVacio] = useState(true);

  const { setFirmaBase64 } = useEmpleado();

  const handleClear = () => {
    sigCanvas.current?.clear();
    setEstaVacio(true);
  };

  const guardarFirma = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      alert("Debe firmar");
      return;
    }

    const firmaBase64 = sigCanvas.current
      .getCanvas()
      .toDataURL("image/png");

    setFirmaBase64(firmaBase64);
    alert("Firma guardada");
    console.log("La firma base64 es: ", firmaBase64) 
  };

  return (
    <div className="pt-2">
      <div className="border border-gray-800 bg-[#f9f9f9]">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{ className: "sigCanvas w-full h-40" }}
          onEnd={() => setEstaVacio(false)}
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
          nombreBoton="Guardar firma"
          onClick={guardarFirma}
          disabled={estaVacio ? true : false}
          color={ estaVacio? "bg-yellow-600/40 cursor-not-allowed": "bg-yellow-600 hover:bg-yellow-700"}
        />
      </div>
    </div>
  );
}

export default Canvas;
