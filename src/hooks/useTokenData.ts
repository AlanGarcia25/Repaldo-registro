import axios from "axios";
import { useState, useEffect } from "react";
import type { EmpleadoDTO } from "../models/api.models"; 

export const useTokenData = () => {
  const [datos, setDatos] = useState<EmpleadoDTO>({
    empleadoId: "",
    empleadoNombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    empleadoCURP: "",
    empleadoRFC: "",
    sexo: "",
    fechaNacimiento: "",
    domicilio: "",
    colonia: "",
    codigoPostal: 0,
    lugarNacimiento: "",
  });

  const TOKEN_AQUI = "";

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get(
          "http://10.10.0.136:7222/api/agrosmart/ags_Empleado/contrato/210948",
          {
            headers: { Authorization: `Bearer ${TOKEN_AQUI}` },
          },
        );
        if (res.data) setDatos(res.data);
      } catch (error) {
        console.error("Error al traer datos");
      }
    };
    cargarDatos();
  }, []);

  return datos;
};
