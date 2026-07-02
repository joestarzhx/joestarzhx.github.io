import { PageContentLoader } from "@/components/loading/PageContentLoader";

export default function Loading() {
  return (
    <main className="pt-[var(--nav-height)]">
      <section className="container-shell">
        <PageContentLoader className="min-h-[calc(100svh-var(--nav-height))]" />
      </section>
    </main>
  );
}
