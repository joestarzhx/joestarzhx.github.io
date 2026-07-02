import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemedLottie } from "@/components/animation/ThemedLottie";
import { Reveal } from "@/components/animation/Reveal";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProjectImage } from "@/components/project/ProjectImage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getLottieItem } from "@/data/lottie";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { capabilities } from "@/data/skills";
import { socials } from "@/data/socials";
import { getPublishedPosts } from "@/lib/posts";
import { estimateReadingTime } from "@/lib/utils";

export default function Home() {
  const featuredProjects = projects
    .filter((project) => project.featured)
    .slice(0, 4);
  const latestPosts = getPublishedPosts().slice(0, 4);
  const heroOrbit = getLottieItem("hero-orbit")!;
  const projectsStack = getLottieItem("projects-stack")!;
  const articleWriting = getLottieItem("article-writing")!;

  return (
    <PageContainer>
      <section className="container-shell grid min-h-[calc(100svh-var(--nav-height))] items-center gap-8 py-6 sm:py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <p className="mb-4 text-sm font-medium text-[var(--accent)]">
            {profile.role}
          </p>
          <h1 className="text-[clamp(2.6rem,13vw,4.5rem)] font-semibold leading-none tracking-normal lg:text-8xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-[clamp(1.75rem,8vw,3rem)] font-semibold leading-tight lg:text-5xl">
            {profile.chineseName}
          </p>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-[var(--text-secondary)] sm:text-2xl">
            {profile.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/projects">
              查看作品 <ArrowRight size={16} />
            </Button>
            <Button href="/resume" variant="secondary">
              查看简历
            </Button>
          </div>
        </Reveal>
        <Reveal className="relative">
          <div className="relative mx-auto max-w-[320px] rounded-[28px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-[var(--shadow-soft)] sm:max-w-[420px] sm:rounded-[32px] sm:p-5">
            <ThemedLottie
              className="pointer-events-none absolute -right-8 -top-8 aspect-square w-44 opacity-30 sm:-right-16 sm:-top-16 sm:w-72"
              light={heroOrbit.light}
              dark={heroOrbit.dark}
              shared={heroOrbit.shared}
              fallbackSrc={heroOrbit.fallback}
              loop
              speed={heroOrbit.speed}
              decorative
              hideWhenReducedMotion
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[var(--surface-muted)]">
              <Image
                src={profile.photo}
                alt="张颢轩个人照片"
                fill
                priority
                sizes="(max-width: 640px) 320px, 420px"
                className="object-contain object-center"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 backdrop-blur sm:bottom-5 sm:left-5 sm:right-5">
              <p className="text-sm text-[var(--text-secondary)]">
                {profile.status}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-space container-shell">
        <div className="flex items-start justify-between gap-6">
          <SectionHeading
            eyebrow="精选项目"
            title="把想法做成可以被触摸的界面。"
            text="这里记录我完成或持续迭代的网页、动画与视觉项目。每个项目都包含设计目标、实现过程与最终成果。"
          />
          <ThemedLottie
            light={projectsStack.light}
            dark={projectsStack.dark}
            shared={projectsStack.shared}
            fallbackSrc={projectsStack.fallback}
            loop={false}
            speed={projectsStack.speed}
            className="pointer-events-none hidden aspect-square w-28 shrink-0 md:block"
            decorative
          />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <Link
              className="group focus-ring surface block overflow-hidden rounded-[22px]"
              href={`/projects/${project.slug}`}
              key={project.slug}
            >
              <ProjectImage
                src={project.cover}
                alt={`${project.title} 项目封面`}
                title={project.title}
                priority={index < 2}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-muted)]"
                imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
              />
              <div className="p-6">
                <div className="flex items-center justify-between gap-3 text-sm text-[var(--text-secondary)]">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <h3 className="mt-3 flex items-center gap-2 text-2xl font-semibold">
                  {project.title}
                  <ArrowRight
                    className="transition-transform group-hover:translate-x-1"
                    size={18}
                  />
                </h3>
                <p className="mt-3 leading-7 text-[var(--text-secondary)]">
                  {project.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-space bg-[var(--surface-solid)]">
        <div className="container-shell">
          <SectionHeading
            eyebrow="能力方向"
            title="工程、审美和叙事放在同一张桌上。"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <Reveal
                className="rounded-[20px] border border-[var(--border)] p-6"
                key={item.title}
              >
                <item.icon className="mb-8 text-[var(--accent)]" size={24} />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-7 text-[var(--text-secondary)]">
                  {item.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space container-shell">
        <div className="flex items-start justify-between gap-6">
          <SectionHeading eyebrow="最新文章" title="记录每次取舍背后的判断。" />
          <ThemedLottie
            light={articleWriting.light}
            dark={articleWriting.dark}
            shared={articleWriting.shared}
            fallbackSrc={articleWriting.fallback}
            loop={false}
            speed={articleWriting.speed}
            className="pointer-events-none hidden aspect-square w-28 shrink-0 md:block"
            decorative
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              className="focus-ring group overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface-solid)] transition-transform hover:-translate-y-1"
              href={`/blog/${post.slug}`}
              key={post.slug}
            >
              <ProjectImage
                src={post.cover}
                alt={`${post.title} ????`}
                title={post.title}
                sizes="(max-width: 1024px) 100vw, 360px"
                className="relative aspect-[2/1] overflow-hidden bg-[var(--surface-muted)]"
                imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
              />
              <div className="p-5">
                <p className="text-sm text-[var(--text-secondary)]">
                  {post.category} ? {estimateReadingTime(post)}
                </p>
                <h3 className="mt-4 text-xl font-semibold leading-7">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--text-secondary)]">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-space container-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="rounded-[28px] bg-[var(--text-primary)] p-8 text-[var(--background)]">
          <Download className="mb-10" size={28} />
          <h2 className="text-3xl font-semibold">简历摘要</h2>
          <p className="mt-4 leading-8 opacity-80">
            {profile.current}。教育方向：{profile.education}
            。主要关注前端工程、交互动效、AI 视觉创作与科普动画。
          </p>
          <div className="mt-8">
            <Button href="/resume" variant="secondary">
              查看完整简历
            </Button>
          </div>
        </Reveal>
        <Reveal className="rounded-[28px] border border-[var(--border)] p-8">
          <h2 className="text-3xl font-semibold">保持联系</h2>
          <p className="mt-4 max-w-2xl leading-8 text-[var(--text-secondary)]">
            如果你对前端、视觉叙事、动画解释或虚拟角色项目感兴趣，可以从这些入口找到我。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {socials.map((social) => (
              <Button
                href={social.href}
                variant="secondary"
                key={social.label}
                ariaLabel={social.ariaLabel}
              >
                <social.icon size={16} />
                {social.label}
              </Button>
            ))}
          </div>
        </Reveal>
      </section>
    </PageContainer>
  );
}
