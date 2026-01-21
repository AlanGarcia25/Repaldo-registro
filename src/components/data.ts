import { type SelectOption } from "../hooks/useSelectApi";


export const OPCIONES_TIPO_JORNAL: SelectOption[] = [
  { value: 1, label: "Eventual" },
  { value: 3, label: "Fijo" },
  { value: 2, label: "Otro" },
];


export const OPCIONES_SEXO: SelectOption[] = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
  { value: "O", label: "Otro" },
];


export const OPCIONES_ESTADO_CIVIL: SelectOption[] = [
  { value: "S", label: "Soltero(a)" },
  { value: "C", label: "Casado(a)" },
  { value: "D", label: "Divorciado(a)" },
];
