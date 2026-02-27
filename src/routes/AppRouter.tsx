import App from '../App';
import Formulario from '../Formulario';
import NotFound from '../errors/notFound';
import { Routes, Route, Navigate } from 'react-router-dom';
import { EmpleadoProvider } from '../context/EmpleadoContext';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const auth = sessionStorage.getItem('auth') === 'true';
  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ children }: Props) => {
  const auth = sessionStorage.getItem('auth') === 'true';

  if (auth) {
    return <Navigate to="/formulario" replace />;
  }

  return <>{children}</>;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <App />
          </PublicRoute>
        }
      />

      <Route
        path="/formulario"
        element={
          <ProtectedRoute>
            <EmpleadoProvider>
              <Formulario />
            </EmpleadoProvider>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}