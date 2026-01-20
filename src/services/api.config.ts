import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_DATOS;

const api = axios.create({
  baseURL: BASE_URL,
});

export interface nombreEmpresas {
  empresaId: number;
  empresaNombre: string;
}
export const getNombreEmpresas = async () => {
  const response = await api.get<nombreEmpresas[]>("/empresa/login");
  return response.data;
};

export const guardarEmpleado = async (empleadoData: any) => {
    const response = await api.post("/empleado/registro", empleadoData);
    return response.data;
};
