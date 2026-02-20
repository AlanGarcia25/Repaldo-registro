import type { nombreEmpresas, datosEmpleado } from "../models/api.models";
import axios, { type AxiosInstance } from "axios";

export const BASE_URL = import.meta.env.VITE_URL_DATOS;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getNombreEmpresas = async () => {
  try {
    const response = await api.get<nombreEmpresas[]>("/empresa/login"); // -------
    return response.data;
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    throw error;
  }
};

export const getDatosEmpleado = async (
  empleadoId: string,
  options?: { signal?: AbortSignal },
): Promise<datosEmpleado | null> => {
  try {
    const res = await api.get<datosEmpleado>(
      `/agrosmart/ags_Empleado/contrato/${empleadoId}`, // --------
      options,
    );
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
