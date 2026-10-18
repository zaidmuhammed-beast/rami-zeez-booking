import type { MetadataRoute } from "next";
import { EVENT } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${EVENT.brand} — Events & Revolution`,
    short_name: EVENT.brand,
    description:
      "Book a seat at the next Rami ZeeZ event, or join the movement putting tools and income into people's hands.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1e1033",
    theme_color: "#1e1033",
    categories: ["events", "social", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Upcoming events", url: "/events" },
      { name: "Become part of revolution", url: "/revolution" },
    ],
  };
}
