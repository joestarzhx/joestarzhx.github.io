import { GitBranch, Mail, Music2, Play } from "lucide-react";
import { generatedContact, generatedSocials, type GeneratedSocial } from "@/generated/socials.generated";

const iconByLabel = {
  GitHub: GitBranch,
  Bilibili: Play,
  抖音: Music2,
  Email: Mail,
} satisfies Record<GeneratedSocial["label"], typeof GitBranch>;

const defaultSocials = [
  {
    label: "GitHub",
    href: "https://github.com/joestarzhx",
  },
  {
    label: "Bilibili",
    href: "https://space.bilibili.com/432932431?spm_id_from=333.40164.0.0",
  },
] satisfies Array<Pick<GeneratedSocial, "label" | "href">>;

const sourceSocials = generatedSocials.length > 0 ? generatedSocials : defaultSocials;

export const socials = sourceSocials.map((social) => ({
  ...social,
  icon: iconByLabel[social.label],
  ariaLabel:
    social.label === "Email"
      ? "向张颢轩发送邮件"
      : `在新标签页打开张颢轩的 ${social.label} 主页`,
}));

export const contact = generatedContact;
