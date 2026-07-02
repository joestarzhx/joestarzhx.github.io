import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import type { Post, PostCategory, PostHeading } from "@/types/content";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export const postCategories = [
  "全部",
  "技术开发",
  "视觉设计",
  "物理与数学",
  "AI 创作",
  "项目复盘",
  "随笔思考",
] as const;

const allowedCategories = new Set<PostCategory>(
  postCategories.filter((item) => item !== "全部") as PostCategory[],
);

type Frontmatter = {
  title?: unknown;
  slug?: unknown;
  description?: unknown;
  date?: unknown;
  updated?: unknown;
  category?: unknown;
  tags?: unknown;
  cover?: unknown;
  featured?: unknown;
  draft?: unknown;
};

function assertString(value: unknown, field: string, file: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(
      `Post ${file} is missing required frontmatter field: ${field}`,
    );
  }
  return value.trim();
}

function assertBoolean(value: unknown, field: string, file: string) {
  if (typeof value !== "boolean") {
    throw new Error(
      `Post ${file} must use a boolean frontmatter field: ${field}`,
    );
  }
  return value;
}

function assertTags(value: unknown, file: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(
      `Post ${file} must use a string array for frontmatter field: tags`,
    );
  }
  return value as string[];
}

function extractText(markdownHeading: string) {
  return markdownHeading
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_~#]/g, "")
    .trim();
}

function extractHeadings(content: string): PostHeading[] {
  const slugger = new GithubSlugger();
  return [...content.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => {
    const text = extractText(match[2]);
    return {
      id: slugger.slug(text),
      text,
      depth: match[1].length as 2 | 3,
    };
  });
}

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(postsDirectory, file), "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as Frontmatter;
  const title = assertString(frontmatter.title, "title", file);
  const slug = assertString(frontmatter.slug, "slug", file);

  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error(
      `Post ${file} has an invalid slug. Use lowercase letters, numbers, and hyphens only.`,
    );
  }

  const category = assertString(
    frontmatter.category,
    "category",
    file,
  ) as PostCategory;
  if (!allowedCategories.has(category)) {
    throw new Error(`Post ${file} uses unsupported category: ${category}`);
  }

  return {
    title,
    slug,
    description: assertString(frontmatter.description, "description", file),
    date: assertString(frontmatter.date, "date", file),
    updated:
      typeof frontmatter.updated === "string" && frontmatter.updated.trim()
        ? frontmatter.updated.trim()
        : undefined,
    category,
    tags: assertTags(frontmatter.tags, file),
    cover: assertString(frontmatter.cover, "cover", file),
    featured: assertBoolean(frontmatter.featured, "featured", file),
    draft: assertBoolean(frontmatter.draft, "draft", file),
    content: content.trim(),
    headings: extractHeadings(content),
  };
}

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];
  const posts = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date));
  const slugs = new Set<string>();
  for (const post of posts) {
    if (slugs.has(post.slug))
      throw new Error(`Duplicate post slug found: ${post.slug}`);
    slugs.add(post.slug);
  }
  return posts;
}

export function getPublishedPosts() {
  const posts = getAllPosts();
  return process.env.NODE_ENV === "production"
    ? posts.filter((post) => !post.draft)
    : posts;
}

export function getPostBySlug(slug: string) {
  return getPublishedPosts().find((post) => post.slug === slug);
}

export function getAdjacentPosts(slug: string) {
  const posts = getPublishedPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  return {
    previous: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function getRelatedPosts(post: Post, limit = 2) {
  return getPublishedPosts()
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      post: item,
      score:
        (item.category === post.category ? 3 : 0) +
        item.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map((item) => item.post);
}

export function estimatePostReadingTime(post: Post) {
  const text = `${post.title}${post.description}${post.content}`.replace(
    /[#*_[\]()`~|>-]/g,
    "",
  );
  const minutes = Math.max(1, Math.ceil(text.length / 500));
  return `${minutes} min`;
}
