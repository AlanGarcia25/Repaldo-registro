import { useEffect, useRef } from 'react';

export const useInactividad = (callback: () => void, tiempoMs: number = 300000) => {
  const temporizadorRef = useRef<number | null>(null);

  useEffect(() => {
    const reiniciarTemporizador = () => {
      if (temporizadorRef.current) window.clearTimeout(temporizadorRef.current);
      temporizadorRef.current = window.setTimeout(callback, tiempoMs);
    };

    const eventos = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    reiniciarTemporizador();
    eventos.forEach(ev => window.addEventListener(ev, reiniciarTemporizador));

    return () => {
      if (temporizadorRef.current) window.clearTimeout(temporizadorRef.current);
      eventos.forEach(ev => window.removeEventListener(ev, reiniciarTemporizador));
    };
  }, [callback, tiempoMs]);
};