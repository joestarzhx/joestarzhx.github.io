import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectImage } from "@/components/project/ProjectImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLottieItem } from "@/data/lottie";
import { getPublishedPosts, postCategories } from "@/lib/posts";
import { estimateReadingTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "文章",
  description:
    "记录前端开发、交互动效、视觉设计、科普动画与数字创作中的方法、过程和判断。",
};

export default function BlogPage() {
  const posts = getPublishedPosts();
  const featured = posts.filter((post) => post.featured).slice(0, 3);
  const primaryFeatured = featured[0];
  const secondaryFeatured = featured.slice(1, 3);
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const articleWriting = getLottieItem("article-writing")!;

  return (
    <PageContainer>
      <section className="container-shell section-space-top">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
          <SectionHeading
            eyebrow="Blog"
            title="写下方法，也写下判断。"
            text="这里整理项目复盘、技术实践与创作思考；保留过程，也保留每次选择背后的理由。"
            spacing="none"
          />
          <ThemedLottie
            light={articleWriting.light}
            dark={articleWriting.dark}
            shared={articleWriting.shared}
            fallbackSrc={articleWriting.fallback}
            loop={false}
            speed={articleWriting.speed}
            className="pointer-events-none mx-auto h-[112px] w-[150px] lg:ml-auto lg:h-[200px] lg:w-[260px]"
            decorative
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-y border-[var(--border)] py-4 text-sm text-[var(--text-secondary)]">
          <p>精选文章 · {featured.length}</p>
          <p>全部文章 · {posts.length}</p>
          <p>标签索引 · {tags.length}</p>
        </div>
      </section>

      {primaryFeatured ? (
        <section className="container-shell section-space-compact">
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <Link
              className="focus-ring group flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)]"
              href={`/blog/${primaryFeatured.slug}`}
            >
              <ProjectImage
                src={primaryFeatured.cover}
                alt={`${primaryFeatured.title} 文章封面`}
                title={primaryFeatured.title}
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-muted)]"
                imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <span className="text-sm text-[var(--accent)]">
                  {primaryFeatured.category} · {estimateReadingTime(primaryFeatured)}
                </span>
                <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
                  {primaryFeatured.title}
                </h2>
                <p className="mt-3 line-clamp-3 leading-7 text-[var(--text-body)]">
                  {primaryFeatured.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                  阅读文章 <ArrowRight size={16} />
                </span>
              </div>
            </Link>

            <div className="grid gap-4">
              {secondaryFeatured.map((post) => (
                <Link
                  className="focus-ring group grid gap-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 sm:grid-cols-[160px_1fr]"
                  href={`/blog/${post.slug}`}
                  key={post.slug}
                >
                  <ProjectImage
                    src={post.cover}
                    alt={`${post.title} 文章封面`}
                    title={post.title}
                    sizes="(max-width: 640px) 100vw, 180px"
                    className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-[var(--surface-muted)]"
                    imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--accent)]">{post.category}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-body)]">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-shell section-space-bottom">
        <SectionHeading eyebrow="All Posts" title="全部文章" />
        <BlogExplorer
          posts={posts}
          categories={[...postCategories]}
          tags={tags}
        />
      </section>
    </PageContainer>
  );
}
