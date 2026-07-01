import { posts } from "@/data/posts";
import { projects } from "@/data/projects";
import type { Post } from "@/types/content";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getAdjacentBySlug<T extends { slug: string }>(items: T[], slug: string) {
  const index = items.findIndex((item) => item.slug === slug);
  return {
    previous: index > 0 ? items[index - 1] : undefined,
    next: index >= 0 && index < items.length - 1 ? items[index + 1] : undefined,
  };
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function estimateReadingTime(post: Post) {
  const text = post.body.flatMap((section) => [section.heading, ...section.paragraphs]).join("");
  const minutes = Math.max(1, Math.ceil(text.length / 500));
  return `${minutes} min`;
}

export function formatArchiveDate(date: string) {
  return date.replaceAll("-", ".");
}
