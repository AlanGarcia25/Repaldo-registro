import { useState, useEffect } from "react";
import axios from "axios";

export interface EmpleadoDTO {
  empleadoId: string;
  empleadoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  empleadoCURP: string;
  empleadoRFC: string;
  sexo: string;
  fechaNacimiento: string;
  domicilio: string;
  colonia: string;
  codigoPostal: number;
  lugarNacimiento: string;
}

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

  const TOKEN_AQUI =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiY2VucmlxdWV6QGFncm9jaXIuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJjMzdhYjdiZi1kZjUwLTQ5MmYtODViNy03MGI1OTY1ZWEzZGIiLCJFbXByZXNhSWQiOiIxIiwiTm9tYnJlVXN1YXJpbyI6IiIsIk5vbWJyZUVtcHJlc2EiOiJBR1JPQ0lSIiwibWlWYWxvciI6Ik9rXzAxMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImFkbWluIiwiZXhwIjoxNzY5MTA2NzE0fQ.hkDiYhM_l8vn02w6InompZOTR6nFdwHAbghLUrrzML0";

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get(
          "http://10.10.0.159:7222/api/agrosmart/ags_Empleado/contrato/210948",
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
