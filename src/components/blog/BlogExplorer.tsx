"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
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
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (filtersOpen) {
        setFiltersOpen(false);
        return;
      }
      setQuery("");
      setFocused(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  useEffect(() => {
    if (!filtersOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [filtersOpen]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return posts.filter((post) => {
      const categoryMatch = category === allCategoriesLabel || post.category === category;
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
      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
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
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--text-tertiary)]"
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
        <a
          className="focus-ring hidden min-h-12 items-center justify-center rounded-full border border-[var(--border)] px-5 text-sm text-[var(--text-secondary)] lg:inline-flex"
          href="#archive"
        >
          文章归档
        </a>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3 md:hidden">
        <p className="min-w-0 truncate text-sm text-[var(--text-secondary)]">
          {category} / {tag}
        </p>
        <button
          type="button"
          className="focus-ring inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal size={16} />
          筛选
        </button>
      </div>

      <div className="mb-5 hidden gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:flex [&::-webkit-scrollbar]:hidden">
        {categories.map((item) => (
          <FilterButton
            active={category === item}
            key={item}
            onClick={() => setCategory(item)}
          >
            {item}
          </FilterButton>
        ))}
      </div>
      <div className="mb-8 hidden gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:flex [&::-webkit-scrollbar]:hidden">
        {[allTagsLabel, ...tags].map((item) => (
          <FilterButton
            active={tag === item}
            key={item}
            onClick={() => setTag(item)}
            subtle
          >
            {item === allTagsLabel ? item : `#${item}`}
          </FilterButton>
        ))}
      </div>

      <AnimatePresence>
        {filtersOpen ? (
          <FilterSheet
            categories={categories}
            category={category}
            tags={tags}
            tag={tag}
            onCategoryChange={setCategory}
            onTagChange={setTag}
            onClose={() => setFiltersOpen(false)}
          />
        ) : null}
      </AnimatePresence>

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
            text="文章正在整理中。这里会记录项目复盘、技术实践与创作思考。"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
  subtle = false,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  subtle?: boolean;
}) {
  return (
    <button
      className={cn(
        "focus-ring min-h-9 shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm",
        !subtle && "border border-[var(--border)]",
        active && !subtle
          ? "bg-[var(--text-primary)] text-[var(--background)]"
          : active
            ? "bg-[var(--accent-soft)] text-[var(--accent)]"
            : "text-[var(--text-secondary)]",
      )}
      type="button"
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function FilterSheet({
  categories,
  category,
  tags,
  tag,
  onCategoryChange,
  onTagChange,
  onClose,
}: {
  categories: BlogExplorerProps["categories"];
  category: string;
  tags: string[];
  tag: string;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[var(--z-modal)] md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="关闭筛选"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
      />
      <motion.div
        className="glass absolute inset-x-0 bottom-0 max-h-[100dvh] overflow-y-auto overscroll-contain rounded-t-[24px] p-5 shadow-[var(--shadow-soft)]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        role="dialog"
        aria-modal="true"
        aria-label="文章筛选"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">筛选文章</h2>
          <button
            type="button"
            className="focus-ring grid size-9 place-items-center rounded-full"
            aria-label="关闭筛选"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-medium">分类</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <FilterButton
                  active={category === item}
                  key={item}
                  onClick={() => onCategoryChange(item)}
                >
                  {item}
                </FilterButton>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium">标签</p>
            <div className="flex flex-wrap gap-2">
              {[allTagsLabel, ...tags].map((item) => (
                <FilterButton
                  active={tag === item}
                  key={item}
                  onClick={() => onTagChange(item)}
                  subtle
                >
                  {item === allTagsLabel ? item : `#${item}`}
                </FilterButton>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="focus-ring min-h-11 flex-1 rounded-full border border-[var(--border)] px-4 text-sm"
            onClick={() => {
              onCategoryChange(categories[0]);
              onTagChange(allTagsLabel);
            }}
          >
            重置
          </button>
          <button
            type="button"
            className="focus-ring min-h-11 flex-1 rounded-full bg-[var(--text-primary)] px-4 text-sm text-[var(--background)]"
            onClick={onClose}
          >
            应用
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
