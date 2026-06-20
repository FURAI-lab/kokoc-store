/**
 * Collabs data.
 * Static for now — wire to D1 later when collab table exists.
 * Each entry: id, name, slug, description, logoUrl, bannerUrl, status, year
 */
export const COLLABS = [
  {
    id: "crocs-classic",
    name: "Crocs Classic",
    slug: "crocs-classic",
    description: "A classic silhouette reimagined in Kokoc's pastel palette. Limited series with exclusive Jibbitz.",
    logoUrl: "/crops/collab-crocs-logo.png",
    bannerUrl: "/crops/collab-crocs-banner.png",
    status: "active",
    year: "2025",
  },
  {
    id: "jibbitz-drop-1",
    name: "Jibbitz Drop #1",
    slug: "jibbitz-drop-1",
    description: "12 unique charms — cats, clouds, stars. The first original set from Kokoc × FURAI lab.",
    logoUrl: "/crops/collab-jibbitz-logo.png",
    bannerUrl: "/crops/collab-jibbitz-banner.png",
    status: "active",
    year: "2025",
  },
  {
    id: "pastel-series",
    name: "Pastel Series",
    slug: "pastel-series",
    description: "A collaborative drop with Vietnamese artists. Hand-painted, limited to 50 pairs.",
    logoUrl: "/crops/collab-pastel-logo.png",
    bannerUrl: "/crops/collab-pastel-banner.png",
    status: "archive",
    year: "2024",
  },
];

export function getCollabs({ status = null } = {}) {
  if (status) return COLLABS.filter(c => c.status === status);
  return COLLABS;
}

export function getCollabBySlug(slug) {
  return COLLABS.find(c => c.slug === slug) ?? null;
}

/**
 * Loads collabs from KV when available.
 * Used by server.js to render the public page.
 */
export async function getCollabsFromKV(env, options = {}) {
  try {
    const raw = await env.KV.get("collabs:list");
    const list = raw ? JSON.parse(raw) : COLLABS;
    if (options.status) return list.filter(c => c.status === options.status);
    return list;
  } catch {
    return getCollabs(options);
  }
}
