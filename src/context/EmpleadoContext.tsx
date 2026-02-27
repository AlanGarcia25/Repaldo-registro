import { createContext, useContext, useState } from "react";
import type { datosEmpleado } from "../models/api.models";

const valoresIniciales: datosEmpleado = {
  empleadoId: '',
  empleadoNombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  empleadoCURP: '',
  empleadoRFC: '',
  sexo: '',
  fechaNacimiento: '',
  domicilio: '',
  colonia: '',
  codigoPostal: 0,
  lugarNacimiento: '',
  estadoCivil: '',
  tipoJornal: '',
  fechaIngreso: ''
};

interface EmpleadoContextType {
  datos: datosEmpleado;
  setDatos: React.Dispatch<React.SetStateAction<datosEmpleado>>;
  huellaBase64: string;
  setHuellaBase64: (v: string) => void;
  urlFirma: string;
  setUrlFirma: (v: string) => void;
  limpiarEmpleado: () => void;
  datosEmpresa: string;
  setDatosEmpresa: (v: string) => void;
  setLimpiarCanvas: React.Dispatch<React.SetStateAction<() => void>>;
}

const EmpleadoContext = createContext<EmpleadoContextType | null>(null);

export const EmpleadoProvider = ({ children }: { children: React.ReactNode }) => {
  const [limpiarCanvas, setLimpiarCanvas] = useState<() => void>(() => { });
  const [datos, setDatos] = useState<datosEmpleado>(valoresIniciales);
  const [huellaBase64, setHuellaBase64] = useState("");
  const [datosEmpresa, setDatosEmpresa] = useState("");
  const [urlFirma, setUrlFirma] = useState("");

  const limpiarEmpleado = () => {
    setDatos(valoresIniciales);
    setHuellaBase64("");
    setDatosEmpresa("");
    setUrlFirma("");
    limpiarCanvas();
  };

  return (
    <EmpleadoContext.Provider
      value={{
        datos,
        setDatos,
        huellaBase64,
        setHuellaBase64,
        urlFirma,
        setUrlFirma,
        limpiarEmpleado,
        datosEmpresa,
        setDatosEmpresa,
        setLimpiarCanvas
      }}>
      {children}
    </EmpleadoContext.Provider>
  );
};

export const useEmpleado = () => {
  const ctx = useContext(EmpleadoContext);
  if (!ctx) throw new Error("useEmpleado debe usarse dentro de EmpleadoProvider");
  return ctx;
};
