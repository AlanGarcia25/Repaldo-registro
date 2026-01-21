import { useState, useEffect } from "react";

export interface SelectOption {
    value: string | number;
    label: string;

}


export function useSelectApi<T>(

    serviceFunction: () => Promise<T[]>,
    mapFunction: (item: T) => SelectOption

) {

    const [options, setOptions] = useState<SelectOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        serviceFunction()
            .then((data) => {
                const transformed = data.map(mapFunction);
                setOptions(transformed);
            })
            .catch((err) => console.error("Error en el Hook:", err))
            .finally(() => setLoading(false));
    }, [serviceFunction]);

    return { options, loading };
    
}