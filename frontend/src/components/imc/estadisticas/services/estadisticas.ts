import axios from "axios";
import {
  ResumenEstadisticas,
  SerieIMC,
  SeriePeso,
  DistribucionCategoria,
} from "../types/estadisticas";

const BASE_URL = import.meta.env.VITE_BACK_URL;
const token = localStorage.getItem("accessToken")

export async function fetchResumen(): Promise<ResumenEstadisticas> {
  const { data } = await axios.get(`${BASE_URL}/estadisticas`, {
    headers: {
      Authorization: token,
    },
  });

  return {
    imcPromedio: parseFloat(data.imcPromedio),
    imcMinimo: parseFloat(data.imcMinimo),
    imcMaximo: parseFloat(data.imcMaximo),
    pesoPromedio: parseFloat(data.pesoPromedio),
    pesoMinimo: parseFloat(data.pesoMinimo),
    pesoMaximo: parseFloat(data.pesoMaximo),
    alturaPromedio: parseFloat(data.alturaPromedio),
    alturaMinimo: parseFloat(data.alturaMinimo),
    alturaMaximo: parseFloat(data.alturaMaximo),
    imcUltimo: parseFloat(data.imcUltimo),
    pesoUltimo: parseFloat(data.pesoUltimo),
    alturaUltimo: parseFloat(data.alturaUltimo),
    total: Number(data.total),
  };
}

export async function fetchSerieIMC(): Promise<SerieIMC[]> {
  const { data } = await axios.get(`${BASE_URL}/estadisticas/serie-imc`, {
    headers: {
      Authorization: token
    }
  });
  return data;
}

export async function fetchSeriePeso(): Promise<SeriePeso[]> {
  const { data } = await axios.get(`${BASE_URL}/estadisticas/serie-peso`, {
    headers: {
      Authorization: token
    }
  });
  return data;
}

export async function fetchDistribucionCategorias(): Promise<DistribucionCategoria[]> {
  const { data } = await axios.get(`${BASE_URL}/estadisticas/categorias`, {
    headers: {
      Authorization: token
    }
  });
  return data.map((item: any) => ({
    categoria: item.categoria,
    count: Number(item.count),
  }));
}

