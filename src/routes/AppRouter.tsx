import { Routes, Route, Navigate } from 'react-router-dom';
import App from '../App'; 
import Formulario from '../Formulario';

const isAuthenticated = () => localStorage.getItem('auth') === 'true';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<App />} />
      <Route 
        path="/formulario" 
        element={isAuthenticated() ? <Formulario /> : <Navigate to="/login" replace />} 
      />
      <Route path="*" element={<h1>404 - No encontrado</h1>} />
    </Routes>
  );
}