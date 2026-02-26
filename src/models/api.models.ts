// USO PARA "api.config"
export interface nombreEmpresas {
  empresaId: number;
  empresaNombre: string;
}

// USO PARA "empleados"
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
  estadoCivil: string;
  tipoJornal: string;
  firmaBase64?: string;
  huellaBase64?: string;
  fechaIngreso: string;
}

// USO PARA EL COMPONENTE "boton"
export interface BotonProps {
  color: string;
  disabled?: boolean;
  nombreBoton: string;
  onClick?: () => void;
}

// USO PARA EL COMPONENTE "input"
export interface InputProps {
  ref?: null;
  tipo: string;
  estilos?: string;
  readOnly?: boolean;
  placeholder?: string;
  value?: string | number;
  nombre: React.ReactNode;
  onBlur?: (value: string) => void;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

// USO PARA EL COMPONENTE "select"
export interface SelectProps {
  nombreSelect: string;
  value?: string | number;
  onChange: (val: string) => void;
  options: { value: string | number; label: string }[];
}

// USO PARA EL INICIO DE SESION "card"
export interface Usuario {
  Email: string;
  userId?: string;
  Password: string;
  activo?: boolean;
  userName?: string;
  empresaId?: number;
  empresaNombre?: string;
}

// USO PARA LA OBTENCION Y DURACION DEL TOKEN
export interface Token {
  token: string;
  fechaExpiracion: Date;
}

// USO EN MODAL.TSX
export interface ModalHuellaProps {
    abierto: boolean;
    estado: "escaneando" | "ok" | "error";
    mensaje?: string;
    onClose: () => void;
}
