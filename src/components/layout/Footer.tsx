import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-12">
      <div className="container-shell flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="text-lg font-semibold">{profile.displayName}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
            用代码、动画和视觉设计，记录持续生长的数字作品。
          </p>
          <p className="mt-4 text-xs text-[var(--text-tertiary)]">
            © 2026 Haoxuan Zhang. 保留所有权利。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {socials.map((social) => (
            <a
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-secondary)]"
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
