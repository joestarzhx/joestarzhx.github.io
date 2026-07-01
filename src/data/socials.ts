import { GitBranch, Music2, Play } from "lucide-react";

export const socials = [
  {
    label: "GitHub",
    href: "https://github.com/joestarzhx",
    icon: GitBranch,
    ariaLabel: "在新标签页打开张颢轩的 GitHub 主页",
  },
  {
    label: "Bilibili",
    href: "https://space.bilibili.com/432932431?spm_id_from=333.40164.0.0",
    icon: Play,
    ariaLabel: "在新标签页打开张颢轩的 Bilibili 主页",
  },
  {
    label: "抖音",
    href: "https://www.douyin.com/user/self?from_tab_name=main",
    icon: Music2,
    ariaLabel: "在新标签页打开张颢轩的抖音主页",
  },
] as const;

// TODO: 确认抖音 /user/self 是否为所有访客都能访问的公开主页链接。
