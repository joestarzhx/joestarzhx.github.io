import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSanitize,
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
      ]}
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => {
          if (typeof src !== "string" || !src) return null;
          return (
            <span className="relative my-8 block aspect-[2/1] overflow-hidden rounded-[18px] bg-[var(--surface-muted)]">
              <Image
                src={src}
                alt={alt ?? ""}
                fill
                sizes="(max-width: 900px) 100vw, 720px"
                className="object-cover"
              />
            </span>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
