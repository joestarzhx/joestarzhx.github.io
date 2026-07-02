import type { Metadata } from "next";
import Link from "next/link";
import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectImage } from "@/components/project/ProjectImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLottieItem } from "@/data/lottie";
import { getPublishedPosts, postCategories } from "@/lib/posts";
import { estimateReadingTime, formatArchiveDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "文章",
  description:
    "记录前端开发、交互动效、视觉设计、科普动画与数字创作中的方法、过程和判断。",
};

export default function BlogPage() {
  const posts = getPublishedPosts();
  const featured = posts.filter((post) => post.featured).slice(0, 3);
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)));
  const articleWriting = getLottieItem("article-writing")!;

  return (
    <PageContainer>
      <section className="container-shell section-space">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-center">
          <SectionHeading
            eyebrow="Blog"
            title="写下方法，也写下判断。"
            text="记录前端开发、交互动效、视觉设计、科普动画与数字创作中的方法、过程和判断。"
            spacing="none"
          />
          <ThemedLottie
            light={articleWriting.light}
            dark={articleWriting.dark}
            shared={articleWriting.shared}
            fallbackSrc={articleWriting.fallback}
            loop={false}
            speed={articleWriting.speed}
            className="pointer-events-none mx-auto aspect-square w-[130px] lg:ml-auto lg:w-72"
            decorative
          />
        </div>
        <div className="my-12 grid gap-4 lg:grid-cols-2">
          {featured.map((post, index) => (
            <Link
              className={`focus-ring group overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface-solid)] ${
                index === 0 ? "lg:row-span-2" : ""
              }`}
              href={`/blog/${post.slug}`}
              key={post.slug}
            >
              <ProjectImage
                src={post.cover}
                alt={`${post.title} 文章封面`}
                title={post.title}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`relative overflow-hidden bg-[var(--surface-muted)] ${index === 0 ? "aspect-[16/10] lg:aspect-[16/13]" : "aspect-[2/1]"}`}
                imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
              />
              <div className="p-6">
                <span className="text-sm text-[var(--accent)]">
                  {post.category}
                </span>
                <h2 className="mt-5 text-2xl font-semibold leading-tight">
                  {post.title}
                </h2>
                <p className="mt-3 leading-7 text-[var(--text-secondary)]">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <BlogExplorer
          posts={posts}
          categories={[...postCategories]}
          tags={tags}
        />
        <div
          id="archive"
          className="mt-16 rounded-[22px] border border-[var(--border)] p-6"
        >
          <h2 className="text-2xl font-semibold">文章归档</h2>
          <div className="mt-5 grid gap-3">
            {posts.map((post) => (
              <Link
                className="focus-ring flex flex-col justify-between gap-2 rounded-2xl py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:flex-row"
                href={`/blog/${post.slug}`}
                key={post.slug}
              >
                <span>{post.title}</span>
                <span>
                  {post.date
                    ? formatArchiveDate(post.date)
                    : estimateReadingTime(post)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
