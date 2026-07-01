import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronUp } from "lucide-react";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ProjectImage } from "@/components/project/ProjectImage";
import { Badge } from "@/components/ui/Badge";
import { posts } from "@/data/posts";
import { profile } from "@/data/profile";
import { estimateReadingTime, formatArchiveDate, getAdjacentBySlug, getPost } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const adjacent = getAdjacentBySlug(posts, post.slug);
  const related = posts.filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 2);
  const headings = post.body.map((section) => section.heading);

  return (
    <main className="pt-[var(--nav-height)]">
      <ReadingProgress />
      <article className="container-shell section-space">
        <Link
          className="focus-ring mb-10 inline-flex items-center gap-2 rounded-full text-sm text-[var(--text-secondary)]"
          href="/blog"
        >
          <ArrowLeft size={16} /> 返回文章
        </Link>
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 flex justify-center gap-2">
            <Badge>{post.category}</Badge>
            <Badge>{estimateReadingTime(post)}</Badge>
          </div>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-6xl">{post.title}</h1>
          <p className="mt-6 text-xl leading-9 text-[var(--text-secondary)]">{post.description}</p>
          <p className="mt-6 text-sm text-[var(--text-tertiary)]">
            {post.date ? `${formatArchiveDate(post.date)} · ` : null}
            {profile.name}
          </p>
        </div>
        <ProjectImage
          src={post.cover}
          alt={`${post.title} 文章封面`}
          title={post.title}
          priority
          sizes="100vw"
          className="relative mt-12 aspect-[16/8] overflow-hidden rounded-[28px] bg-[var(--surface-muted)]"
          imageClassName="object-cover"
        />
      </article>

      <div className="container-shell grid gap-10 pb-24 xl:grid-cols-[1fr_minmax(0,720px)_1fr]">
        <div />
        <div className="prose-custom">
          {post.body.map((section) => (
            <section key={section.heading}>
              <h2 id={section.heading}>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
        <TableOfContents headings={headings} />
      </div>

      <section className="container-shell mb-20">
        <div className="grid gap-4 border-t border-[var(--border)] pt-8 md:grid-cols-2">
          {adjacent.previous ? (
            <Link
              className="focus-ring rounded-[20px] border border-[var(--border)] p-5"
              href={`/blog/${adjacent.previous.slug}`}
            >
              <span className="text-sm text-[var(--text-secondary)]">上一篇</span>
              <p className="mt-2 text-xl font-semibold">{adjacent.previous.title}</p>
            </Link>
          ) : (
            <div />
          )}
          {adjacent.next ? (
            <Link
              className="focus-ring rounded-[20px] border border-[var(--border)] p-5 text-right"
              href={`/blog/${adjacent.next.slug}`}
            >
              <span className="text-sm text-[var(--text-secondary)]">下一篇</span>
              <p className="mt-2 inline-flex items-center gap-2 text-xl font-semibold">
                {adjacent.next.title}
                <ArrowRight size={18} />
              </p>
            </Link>
          ) : null}
        </div>
        {related.length ? (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold">相关文章</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link
                  className="focus-ring rounded-[18px] border border-[var(--border)] p-5"
                  href={`/blog/${item.slug}`}
                  key={item.slug}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <a
          className="focus-ring mt-10 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm"
          href="#"
        >
          <ChevronUp size={16} /> 返回顶部
        </a>
      </section>
    </main>
  );
}
