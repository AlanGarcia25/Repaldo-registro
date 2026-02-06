import { type SelectOption } from "../hooks/useSelectApi";

// TIPO JORNAL
export const OPCIONES_TIPO_JORNAL: SelectOption[] = [
  { value: "Eventual", label: "Eventual" },
  { value: "Fijo", label: "Fijo" },
  { value: "Otro", label: "Otro" },
];

// GENERO
export const OPCIONES_SEXO: SelectOption[] = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "O", label: "Otro" },
];

// ESTADO CIVIL
export const OPCIONES_ESTADO_CIVIL: SelectOption[] = [
  { value: "Soltero", label: "Soltero" },
  { value: "Casado", label: "Casado" },
  { value: "Divorciado", label: "Divorciado" },
];
