import { PageContentLoader } from "@/components/loading/PageContentLoader";

export default function ProjectDetailLoading() {
  return (
    <main className="pt-[var(--nav-height)]">
      <section className="container-shell">
        <PageContentLoader className="min-h-[360px]" />
      </section>
    </main>
  );
}
