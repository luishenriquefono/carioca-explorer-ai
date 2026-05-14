import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/debug-clima")({
  server: {
    handlers: {
      GET: async () => {
        const key = process.env.OPENWEATHER_API_KEY;
        if (!key) return Response.json({ step: "key", present: false });
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=-22.9068&lon=-43.1729&units=metric&lang=pt_br&appid=${key}`;
        try {
          const res = await fetch(url);
          const text = await res.text();
          return Response.json({ step: "fetch", status: res.status, body: text.slice(0, 500), keyLen: key.length });
        } catch (e) {
          return Response.json({ step: "throw", err: String(e) });
        }
      },
    },
  },
});