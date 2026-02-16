import Card from './components/card';
import Formulario from './Formulario';
import { EmpleadoProvider } from './context/EmpleadoContext';

function App() {
  return (
    <div className="@container">
      {/* <Card /> */}
      <EmpleadoProvider>
        <Formulario />
      </EmpleadoProvider>
    </div>
  )
}

export default App
