import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts();
  return [
    "",
    "/projects",
    "/blog",
    "/resume",
    "/lab",
    "/about",
    ...projects.map((project) => `/projects/${project.slug}`),
    ...posts.map((post) => `/blog/${post.slug}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date("2026-07-01"),
  }));
}
