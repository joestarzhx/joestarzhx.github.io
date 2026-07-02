import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

export default function ResumePage() {
  return (
    <PageContainer>
      <section className="container-shell section-space">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <SectionHeading
            eyebrow="Resume"
            title="在线简历，像作品一样说明能力。"
            text={profile.bio}
          />
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-4">
              <div className="relative h-[116px] w-[88px] overflow-hidden rounded-[20px] bg-[var(--surface-muted)] sm:h-[132px] sm:w-[104px]">
                <Image
                  src={profile.photo}
                  alt="张颢轩个人照片"
                  fill
                  sizes="(max-width: 640px) 88px, 104px"
                  className="object-contain object-center"
                />
              </div>
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <Image
                  src="/images/lottie-fallbacks/brand-intro-static.svg"
                  alt=""
                  width={44}
                  height={44}
                  aria-hidden="true"
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">当前身份</p>
            <h2 className="mt-2 text-2xl font-semibold">{profile.current}</h2>
            <p className="mt-4 leading-7 text-[var(--text-secondary)]">
              教育方向：{profile.education}
            </p>
            <div className="mt-6">
              <ResumeDownload />
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell section-space-bottom">
        <SectionHeading eyebrow="Timeline" title="经历以时间轴展开。" />
        <ExperienceTimeline />
      </section>

      <section className="container-shell section-space grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Projects" title="项目经历" />
          <div className="grid gap-4">
            {projects.slice(0, 4).map((project) => (
              <Link
                className="focus-ring rounded-[20px] border border-[var(--border)] p-5"
                href={`/projects/${project.slug}`}
                key={project.slug}
              >
                <p className="text-sm text-[var(--text-secondary)]">
                  {project.category} · {project.year}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
                <p className="mt-2 text-[var(--text-secondary)]">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Skills" title="技能与工具" />
          <div className="grid gap-4">
            {skillGroups.map((group) => (
              <div
                className="rounded-[20px] border border-[var(--border)] p-5"
                key={group.title}
              >
                <h3 className="text-xl font-semibold">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell section-space-bottom">
        <div className="grid gap-6 rounded-[28px] bg-[var(--text-primary)] p-8 text-[var(--background)] lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold">个人优势</h2>
            <ul className="mt-5 grid gap-3 opacity-80">
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
                  className="rounded-full border border-current/20 px-4 py-2 text-sm opacity-85"
                  href={social.href}
                  key={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                >
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
