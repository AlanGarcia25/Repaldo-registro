import { useToken } from "../hooks/pruebaVistaToken";

const VistaToken = () => {
  const datos = useToken();

  if (!datos) return <p>No hay datos en el token</p>;

  return (
    <div className="p-4 bg-gray-100 border border-blue-500 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2 text-blue-700">Datos Extraídos del Token</h2>
      <div className="space-y-2">
        <p><strong>Nombre:</strong> {datos.name}</p>
        <p><strong>Sub:</strong> {datos.sub}</p>
        <p><strong>IAT:</strong> {datos.iat}</p>
      </div>
    </div>
  );
};

export default VistaToken;