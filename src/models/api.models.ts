// USO PARA "api.config"
export interface nombreEmpresas {
  empresaId: number;
  empresaNombre: string;
}

// USO PARA "useTokenData"
export interface datosEmpleado {
  empleadoId: string;
  empleadoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  empleadoCURP: string;
  empleadoRFC: string;
  sexo: string;
  fechaNacimiento: string | number;
  domicilio: string;
  colonia: string;
  codigoPostal: number;
  lugarNacimiento: string;
  // NO SE USA DE MOMENTO
  estadoCivil: string;
  tipoJornal: string;
  // NO SE USA DE MOMENTO
}

// USO PARA EL COMPONENTE "boton"
export interface BotonProps {
  nombreBoton: string;
  color: string;
  disabled?: boolean;
  onClick?: () => void;
}

// USO PARA EL COMPONENTE "input"
export interface InputProps {
  nombre: string;
  tipo: string;
  placeholder?: string;
  value?: string | number;
  readOnly?: boolean;
  estilos?: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  ref?: null;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

// USO PARA EL COMPONENTE "select"
export interface SelectProps {
  nombreSelect: string;
  options: { value: string | number; label: string }[];
  value?: string | number;
  readOnly?: boolean;
  onChange: (val: string) => void;
}

// USO PARA EL INICIO DE SESION "card"
export interface Usuario {
  empresaId?: number;
  empresaNombre?: string;
  userId?: string;
  Email: string;
  userName?: string;
  Password: string;
  activo?: boolean;
}

// USO PARA LA OBTENCION Y DURACION DEL TOKEN
export interface Token {
  token: string;
  fechaExpiracion: Date;
}
