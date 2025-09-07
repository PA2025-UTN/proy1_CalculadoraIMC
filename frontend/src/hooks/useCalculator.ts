// hooks/useImcCalculator.ts
import { useState } from "react";
import axios from "axios";

export interface ImcResult {
  imc: number;
  categoria: string;
}

export const useCalculator = () => {
  const [resultado, setResultado] = useState<ImcResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const calcularImc = async (altura: number, peso: number) => {
    if (altura <= 0 || peso <= 0) {
      setError("Por favor, ingresa valores válidos (positivos).");
      setResultado(null);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post("https://proy1-calculadoraimc-1.onrender.com/imc/calcular", {
        altura,
        peso,
      });

      setResultado(response.data);
    } catch {
      setError("Error al calcular el IMC. Verifica si el backend está corriendo.");
      setResultado(null);
    } finally {
      setLoading(false);
    }
  };

  return { resultado, error, loading, calcularImc };
};
