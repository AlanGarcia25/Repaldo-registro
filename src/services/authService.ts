interface LoginResponse {
    token?: string;
    mensaje?: string;
}

export const login = async (usuario: string, password: string): Promise<LoginResponse> => {
    try {

        const response = await fetch(`${import.meta.env.VITE_URL_DATOS}/login`, {
            method: "POST",
            body: JSON.stringify({ usuario, password }), 
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Credenciales incorrectas");
        }

        const data: LoginResponse = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        
        return data;
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
    
};