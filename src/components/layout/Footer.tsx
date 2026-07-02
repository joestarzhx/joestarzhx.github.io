import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

export function Footer() {
  const validSocials = socials.filter(
    (social) => social.href?.trim() && social.label?.trim(),
  );

  return (
    <footer className="border-t border-[var(--border)] py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="container-shell flex min-w-0 flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="min-w-0">
          <p className="text-lg font-semibold">{profile.displayName}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-body)]">
            用代码、动画和视觉设计，记录持续生长的数字作品。
          </p>
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            © 2026 Haoxuan Zhang. 保留所有权利。
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap gap-3">
          {validSocials.map((social) => (
            <a
              className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
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
    </footer>
  );
}
