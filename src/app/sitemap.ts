import type { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fv-storage-simulator.vercel.app"
).replace(/\/$/, "");

const routes = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/simulatore", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/cookie", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/termini", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/disclaimer", changeFrequency: "yearly" as const, priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
