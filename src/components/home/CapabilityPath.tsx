import { Reveal } from "@/components/animation/Reveal";
import { CapabilityPathMotion } from "@/components/home/CapabilityPathMotion";
import type { capabilities } from "@/data/skills";

type Capability = (typeof capabilities)[number];

export function CapabilityPath({ items }: { items: Capability[] }) {
  return (
    <CapabilityPathMotion>
      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div data-capability-card key={item.title}>
            <Reveal className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-6">
              <item.icon className="mb-8 text-[var(--accent)]" size={24} />
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 leading-7 text-[var(--text-secondary)]">{item.text}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </CapabilityPathMotion>
  );
}
