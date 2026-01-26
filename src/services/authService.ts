import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_DATOS,
});

interface LoginResponse {
  token?: string;
  mensaje?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>("/login", { email, password });

    if (data.token) {
      localStorage.setItem("token", data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }

    return data;
  } catch (error: any) {
    const mensaje = error.response?.data?.mensaje || "Error al iniciar sesión";
    throw new Error(mensaje);
  }
};