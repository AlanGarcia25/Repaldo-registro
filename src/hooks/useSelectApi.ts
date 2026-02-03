import { useState, useEffect } from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

export function useSelectApi<T>(
  serviceFunction: () => Promise<T[]>,
  mapFunction: (item: T) => SelectOption,
) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceFunction()
      .then((data) => {
        if (Array.isArray(data)) {
          const transformed = data.map(mapFunction);
          setOptions(transformed);
        } else {
          console.warn("La API no devolvió un arreglo:", data);
          setOptions([]); 
        }
      })
      .catch((err) => {
        console.error("Error en el Hook:", err);
        setOptions([]); 
      })
      .finally(() => setLoading(false));
  }, [serviceFunction]); 

  return { options, loading };
}
