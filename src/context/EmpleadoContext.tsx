import { createContext, useContext, useState } from "react";
import type { datosEmpleado } from "../models/api.models";

interface EmpleadoContextType {
  datos: datosEmpleado;
  setDatos: React.Dispatch<React.SetStateAction<datosEmpleado>>;
  huellaBase64: string;
  setHuellaBase64: (v: string) => void;
  firmaBase64: string;
  setFirmaBase64: (v: string) => void;
}

const EmpleadoContext = createContext<EmpleadoContextType | null>(null);

export const EmpleadoProvider = ({ children }: { children: React.ReactNode }) => {
  const [datos, setDatos] = useState<datosEmpleado>({} as datosEmpleado);
  const [huellaBase64, setHuellaBase64] = useState("");
  const [firmaBase64, setFirmaBase64] = useState("");

  return (
    <EmpleadoContext.Provider
      value={{
        datos,
        setDatos,
        huellaBase64,
        setHuellaBase64,
        firmaBase64,
        setFirmaBase64,
      }}
    >
      {children}
    </EmpleadoContext.Provider>
  );
};

export const useEmpleado = () => {
  const ctx = useContext(EmpleadoContext);
  if (!ctx) throw new Error("useEmpleado debe usarse dentro de EmpleadoProvider");
  return ctx;
};
