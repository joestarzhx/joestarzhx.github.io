import { Reveal } from "@/components/animation/Reveal";
import { CapabilityPathMotion } from "@/components/home/CapabilityPathMotion";
import type { capabilities } from "@/data/skills";

type Capability = (typeof capabilities)[number];

export function CapabilityPath({ items }: { items: Capability[] }) {
  return (
    <CapabilityPathMotion>
      <div className="relative z-10 grid gap-3 min-[360px]:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div data-capability-card key={item.title}>
            <Reveal className="focus-ring rounded-[18px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 shadow-none transition-[border-color,box-shadow,transform] hover:-translate-y-[3px] hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)] active:scale-[0.985] motion-reduce:hover:translate-y-0 sm:p-5">
              <item.icon className="mb-5 text-[var(--accent)]" size={24} />
              <h3 className="text-lg font-semibold sm:text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-body)] sm:text-base sm:leading-7">{item.text}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </CapabilityPathMotion>
  );
}
