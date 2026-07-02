import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { ProjectImage } from "@/components/project/ProjectImage";
import { ProjectStoryMotion } from "@/components/project/ProjectStoryMotion";
import {
  ProjectStoryNavigation,
  type ProjectStorySection,
} from "@/components/project/ProjectStoryNavigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { projects } from "@/data/projects";
import { getAdjacentBySlug, getProject } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const adjacent = getAdjacentBySlug(projects, project.slug);
  const storySections: ProjectStorySection[] = [
    { id: "project-background", label: "项目背景" },
    { id: "design-goals", label: "设计目标" },
    { id: "process", label: "实现过程" },
    { id: "challenges", label: "遇到的问题" },
    { id: "results", label: "最终成果" },
  ];

  return (
    <ProjectStoryMotion>
      <main id="top" className="pt-[var(--nav-height)]">
        <section className="container-shell pb-10 pt-10 sm:pt-16">
          <Link
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-[14px] px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
            href="/projects"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            返回项目
          </Link>

          <div className="mt-12 max-w-[880px]">
            <p className="text-sm font-medium text-[var(--accent)]">
              {project.category} · {project.year}
            </p>
            <h1 className="mt-4 max-w-[12ch] text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.05] tracking-normal">
              {project.title}
            </h1>
            <p className="mt-5 max-w-[680px] text-lg leading-8 text-[var(--text-secondary)] sm:text-xl sm:leading-9">
              {project.subtitle}
            </p>
          </div>

          <div
            data-story-hero
            className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface-muted)] shadow-[var(--shadow-soft)] sm:rounded-[32px]"
          >
            <div data-story-hero-media className="absolute inset-0">
              <ProjectImage
                src={project.cover}
                alt={`${project.title} 主视觉界面`}
                title={project.title}
                priority
                sizes="100vw"
                className="relative size-full"
                imageClassName="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="container-shell grid gap-10 pb-20 pt-8 lg:grid-cols-[minmax(260px,0.34fr)_minmax(0,0.66fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-[calc(var(--nav-height)+28px)] lg:self-start">
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 shadow-sm">
              <h2 className="text-lg font-semibold">项目概览</h2>
              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="text-[var(--text-tertiary)]">我的职责</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {project.responsibilities.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
                  <div>
                    <dt className="text-[var(--text-tertiary)]">年份</dt>
                    <dd className="mt-1 font-medium text-[var(--text-primary)]">
                      {project.year}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-tertiary)]">类型</dt>
                    <dd className="mt-1 font-medium text-[var(--text-primary)]">
                      {project.category}
                    </dd>
                  </div>
                </div>
              </dl>

              {project.demo ? (
                <div className="mt-6">
                  <Button
                    href={project.demo}
                    ariaLabel={`在新标签页打开${project.title}`}
                    className="w-full rounded-[14px]"
                  >
                    <ExternalLink size={16} aria-hidden="true" />
                    访问项目
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="mt-8">
              <ProjectStoryNavigation sections={storySections} />
            </div>
          </aside>

          <div className="prose-custom" data-project-story>
            <h2 id="project-background" data-story-section>
              项目背景
            </h2>
            <p>{project.background}</p>
            <h2 id="design-goals" data-story-section>
              设计目标
            </h2>
            <ul>
              {project.goals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h2 id="process" data-story-section>
              实现过程
            </h2>
            <ul>
              {project.process.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h2 id="challenges" data-story-section>
              遇到的问题
            </h2>
            <ul>
              {project.challenges.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h2 id="results" data-story-section>
              最终成果
            </h2>
            <ul>
              {project.results.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container-shell pb-20" data-story-gallery>
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {project.gallery.map((image, index) => (
              <div
                data-story-image
                className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface-muted)]"
                key={image}
              >
                <ProjectImage
                  src={image}
                  alt={`${project.title} 展示画面 ${index + 1}`}
                  title={project.title}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="relative size-full"
                  imageClassName="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {(adjacent.previous || adjacent.next) ? (
          <nav
            className="container-shell mb-20 grid gap-4 border-t border-[var(--border)] pt-8 md:grid-cols-2"
            aria-label="项目导航"
          >
            {adjacent.previous ? (
              <Link
                className="focus-ring rounded-[20px] border border-[var(--border)] p-5 transition-colors hover:bg-[var(--surface-muted)]"
                href={`/projects/${adjacent.previous.slug}`}
              >
                <span className="text-sm text-[var(--text-secondary)]">上一个项目</span>
                <p className="mt-2 text-xl font-semibold">{adjacent.previous.title}</p>
              </Link>
            ) : null}
            {adjacent.next ? (
              <Link
                className="focus-ring rounded-[20px] border border-[var(--border)] p-5 text-left transition-colors hover:bg-[var(--surface-muted)] md:text-right"
                href={`/projects/${adjacent.next.slug}`}
              >
                <span className="text-sm text-[var(--text-secondary)]">下一个项目</span>
                <p className="mt-2 inline-flex items-center gap-2 text-xl font-semibold">
                  {adjacent.next.title}
                  <ArrowRight size={18} aria-hidden="true" />
                </p>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </main>
    </ProjectStoryMotion>
  );
}
