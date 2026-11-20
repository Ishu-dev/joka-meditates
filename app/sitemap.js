import { SITE_URL } from "@/lib/site";
import { getSeedSlugs } from "@/lib/issues";

// Every public page. /admin is left out on purpose.
const pages = [
  ["", 1],
  ["/practice", 0.9],
  ["/practice/chakras", 0.7],
  ["/practice/yoga-poses", 0.7],
  ["/practice/mandala", 0.7],
  ["/events", 0.8],
  ["/issues", 0.8],
  ["/board", 0.6],
  ["/campus", 0.6],
  ["/support", 0.7],
  ["/beyond", 0.6],
  ["/team", 0.6],
  ["/about", 0.6],
  ["/join", 0.7],
];

export default function sitemap() {
  const now = new Date();
  const slugs = getSeedSlugs().map(({ slug }) => slug);
  return [
    ...pages.map(([path, priority]) => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency: "weekly", priority })),
    ...slugs.map((slug) => ({ url: `${SITE_URL}/issues/${slug}`, lastModified: now, changeFrequency: "yearly", priority: 0.5 })),
  ];
}
