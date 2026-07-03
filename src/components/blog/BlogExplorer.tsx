"use client";

import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterScroller } from "@/components/ui/FilterScroller";
import type { Post, PostCategory } from "@/types/content";
import { cn } from "@/lib/utils";
import { PostCard } from "./PostCard";

type BlogExplorerProps = {
  posts: Post[];
  categories: Array<string | PostCategory>;
  tags: string[];
};

const allTagsLabel = "全部标签";

export function BlogExplorer({ posts, categories, tags }: BlogExplorerProps) {
  const allCategoriesLabel = categories[0];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(allCategoriesLabel);
  const [tag, setTag] = useState(allTagsLabel);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setQuery("");
      setFocused(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return posts.filter((post) => {
      const categoryMatch =
        category === allCategoriesLabel || post.category === category;
      const tagMatch = tag === allTagsLabel || post.tags.includes(tag);
      const queryMatch =
        !term ||
        [post.title, post.description, post.category, ...post.tags]
          .join(" ")
          .toLowerCase()
          .includes(term);
      return categoryMatch && tagMatch && queryMatch;
    });
  }, [allCategoriesLabel, category, posts, query, tag]);

  return (
    <div>
      <div className="mb-6 grid gap-4">
        <motion.div
          animate={{ scale: focused ? 1.01 : 1 }}
          className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-4 py-3"
        >
          <Search
            className={cn(
              "text-[var(--text-tertiary)] transition-transform",
              focused && "translate-x-1",
            )}
            size={18}
          />
          <input
            aria-label="搜索文章"
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--text-muted)]"
            placeholder="搜索标题、分类或标签"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {query ? (
            <button
              aria-label="清空搜索"
              className="focus-ring grid size-8 place-items-center rounded-full"
              type="button"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          ) : null}
        </motion.div>
      </div>

      <FilterScroller
        className="mb-4"
        items={categories}
        active={category}
        onChange={setCategory}
        ariaLabel="文章分类筛选"
      />
      <FilterScroller
        className="mb-8"
        items={[allTagsLabel, ...tags]}
        active={tag}
        onChange={setTag}
        getLabel={(item) => (item === allTagsLabel ? item : `#${item}`)}
        subtle
        ariaLabel="文章标签筛选"
      />

      <AnimatePresence mode="popLayout">
        {filtered.length ? (
          <motion.div layout className="grid gap-4">
            {filtered.map((post) => (
              <motion.div
                layout
                key={post.slug}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.985 }}
                transition={{ duration: 0.22 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="没有找到文章"
            text="换一个关键词、分类或标签再试试。"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
