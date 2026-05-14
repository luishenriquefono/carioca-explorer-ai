import { createServerFn } from "@tanstack/react-start";

export type ClimaResultado =
  | {
      ok: true;
      cidade: string;
      temperatura: number;
      sensacao: number;
      descricao: string;
      icon: string;
      umidade: number;
      vento: number;
    }
  | { ok: false; error: string };

export const obterClima = createServerFn({ method: "GET" }).handler(
  async (): Promise<ClimaResultado> => {
    const key = process.env.OPENWEATHER_API_KEY;
    if (!key) {
      return {
        ok: false,
        error:
          "Não foi possível carregar a previsão do tempo no momento. Tente novamente mais tarde.",
      };
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=-22.9068&lon=-43.1729&units=metric&lang=pt_br&appid=${key}`;
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 10_000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(t);
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error("[obterClima] OpenWeather API error", res.status, body);
        throw new Error(`api error ${res.status}`);
      }
      const data = (await res.json()) as {
        name: string;
        main: { temp: number; feels_like: number; humidity: number };
        weather: { description: string; icon: string }[];
        wind: { speed: number };
      };
      return {
        ok: true,
        cidade: data.name,
        temperatura: Math.round(data.main.temp),
        sensacao: Math.round(data.main.feels_like),
        descricao: data.weather[0]?.description ?? "",
        icon: data.weather[0]?.icon ?? "01d",
        umidade: data.main.humidity,
        vento: Math.round(data.wind.speed * 3.6),
      };
    } catch (e) {
      console.error("[obterClima] erro", e);
      return {
        ok: false,
        error:
          "Não foi possível carregar a previsão do tempo no momento. Tente novamente mais tarde.",
      };
    }
  },
);