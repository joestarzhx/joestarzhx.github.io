import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExperienceTimeline } from "@/components/resume/ExperienceTimeline";
import { ResumeDownload } from "@/components/resume/ResumeDownload";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { socials } from "@/data/socials";

export const metadata: Metadata = {
  title: "简历",
  description: "Haoxuan Zhang（张颢轩）的在线个人简历。",
};

const resumeProjects = [
  "next-generation-letter",
  "ink-personal-blog",
  "quantum-tunneling-animation",
  "live2d-character",
];

export default function ResumePage() {
  const selectedProjects = resumeProjects
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof projects)[number] =>
      Boolean(project),
    );

  return (
    <PageContainer>
      <section className="container-shell section-space-top">
        <div className="grid grid-cols-1 gap-10 min-[1188px]:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] min-[1188px]:items-center">
          <div className="min-w-0">
            <SectionHeading
              eyebrow="Resume"
              title="在线简历，用项目和技能说明能力。"
              text="这里整理当前身份、创作轨迹、项目经历和工具栈，尽量用事实和作品呈现能力边界。"
              level={1}
            />
          </div>
          <article className="min-w-0 rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 sm:p-6">
            <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-6 min-[1188px]:grid-cols-[136px_minmax(0,1fr)]">
              <div className="relative aspect-[13/16] w-24 overflow-hidden rounded-2xl bg-[var(--surface-muted)] sm:w-28 min-[1188px]:w-[136px]">
                <Image
                  src={profile.photo}
                  alt="张颢轩的个人照片"
                  fill
                  sizes="(max-width: 639px) 96px, (max-width: 1187px) 112px, 136px"
                  className="object-cover object-top"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--text-secondary)] sm:text-sm">
                  当前身份
                </p>
                <h2 className="mt-2 text-[clamp(1.2rem,1.7vw,1.45rem)] font-semibold leading-[1.3] tracking-[-0.02em] [overflow-wrap:break-word]">
                  {profile.current}
                </h2>
                <p className="mt-3 text-[0.95rem] leading-[1.6] text-[var(--text-body)] sm:text-base">
                  教育方向：{profile.education}
                </p>
              </div>
            </div>
            <div className="mt-6 sm:mt-7">
              <ResumeDownload />
            </div>
          </article>
        </div>
      </section>

      <section className="container-shell section-space-compact">
        <SectionHeading eyebrow="Trajectory" title="创作轨迹" />
        <ExperienceTimeline />
      </section>

      <section className="container-shell section-space-compact">
        <SectionHeading eyebrow="Projects" title="项目经历" />
        <div className="grid gap-4 md:grid-cols-2">
          {selectedProjects.map((project) => (
            <Link
              className="focus-ring group rounded-[20px] border border-[var(--border)] p-5 transition-[border-color,box-shadow,transform] hover:-translate-y-[3px] hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)] active:scale-[0.985] motion-reduce:hover:translate-y-0"
              href={`/projects/${project.slug}`}
              key={project.slug}
            >
              <p className="text-sm text-[var(--text-secondary)]">
                {project.category} · {project.year}
              </p>
              <h3 className="mt-2 flex items-center justify-between gap-3 text-xl font-semibold">
                {project.title}
                <ArrowRight
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                  size={18}
                />
              </h3>
              <p className="mt-2 line-clamp-3 leading-7 text-[var(--text-body)]">
                {project.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell section-space-compact">
        <SectionHeading eyebrow="Skills" title="技能与工具" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-solid)] p-4"
              key={group.title}
            >
              <h3 className="text-lg font-semibold">{group.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell section-space-bottom">
        <div className="grid gap-6 rounded-[24px] bg-[var(--text-primary)] p-6 text-[var(--background)] sm:p-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold">个人优势</h2>
            <ul className="mt-5 grid gap-3 opacity-85">
              {profile.advantages.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-semibold">联系</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full border border-current/25 px-4 py-2 text-sm opacity-90"
                  href={social.href}
                  key={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                >
                  <social.icon size={16} />
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
