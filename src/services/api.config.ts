import type { nombreEmpresas, datosEmpleado } from "../models/api.models";
import axios, { type AxiosInstance } from "axios";

export const BASE_URL = import.meta.env.VITE_URL_DATOS;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getNombreEmpresas = async () => {
  try {
    const response = await api.get<nombreEmpresas[]>("/empresa/login");
    return response.data;
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    throw error;
  }
};

export const getDatosEmpleado = async (
  empleadoId: string
): Promise<datosEmpleado | null> => {
  try {
    const res = await api.get<datosEmpleado>(`/agrosmart/ags_empleado/contrato/${empleadoId}`);
    console.log("Datos obtenidos con exito :D !!!!!")
    return res.data;
  } catch (error) {
    console.error("Error al obtener empleado  :C", error);
    return null;
  }
};

export const postDatosEmpleado = axios.post('',{
  nombreUsuario: ''
})
