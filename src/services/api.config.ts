import type { nombreEmpresas } from "../models/api.models";
import type { datosEmpleado } from "../models/api.models";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_DATOS;

const api = axios.create({
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

export const getDatosEmpleado = async () => {
  try {
    const response = await api.get<datosEmpleado[]>("/empresa/login");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos del empleado:", error);
    throw error;
  }
};
