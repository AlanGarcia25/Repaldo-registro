import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL_DATOS;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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
