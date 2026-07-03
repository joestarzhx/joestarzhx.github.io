import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const sourceCandidates = [
  process.env.BLOG_MATERIALS_DIR,
  path.join(root, "blog_materials_template"),
  path.join(root, "materials", "blog_materials_template"),
  path.join(root, "张颢轩博客_素材替换模板包", "blog_materials_template"),
  path.join(path.dirname(root), "blog_materials_template"),
].filter(Boolean);

const counters = {
  copied: [],
  unchanged: [],
  skippedPlaceholders: [],
  missingOptional: [],
  invalid: [],
  generated: [],
  postsPublished: [],
  postsSkipped: [],
  warnings: [],
};

const projectMappings = [
  {
    sourceDir: "next-generation-letter",
    slug: "next-generation-letter",
    targetDir: "next-generation-letter",
    files: [
      "project-next-letter-cover.webp",
      "project-next-letter-envelope.webp",
      "project-next-letter-timeline.webp",
      "project-next-letter-archive.webp",
      "project-next-letter-bridge.webp",
      "project-next-letter-mobile.webp",
      "project-next-letter-ending.webp",
      "project-next-letter-preview.webm",
      "project-next-letter-preview.mp4",
    ],
  },
  {
    sourceDir: "ink-personal-blog",
    slug: "ink-personal-blog",
    targetDir: "ink-personal-blog",
    files: [
      "project-ink-blog-cover.webp",
      "project-ink-blog-desktop.webp",
      "project-ink-blog-mobile.webp",
      "project-ink-blog-scroll.webp",
      "project-ink-blog-navigation.webp",
      "project-ink-blog-detail.webp",
      "project-ink-blog-preview.webm",
      "project-ink-blog-preview.mp4",
    ],
  },
  {
    sourceDir: "quantum-tunneling",
    slug: "quantum-tunneling-animation",
    targetDir: "quantum-tunneling",
    files: [
      "project-quantum-cover.webp",
      "project-quantum-wave.webp",
      "project-quantum-barrier.webp",
      "project-quantum-probability.webp",
      "project-quantum-fusion.webp",
      "project-quantum-chip.webp",
      "project-quantum-preview.webm",
      "project-quantum-preview.mp4",
    ],
  },
  {
    sourceDir: "live2d-character",
    slug: "live2d-character",
    targetDir: "live2d-character",
    files: [
      "project-live2d-cover.webp",
      "project-live2d-character.webp",
      "project-live2d-turnaround.webp",
      "project-live2d-layers.webp",
      "project-live2d-expressions.webp",
      "project-live2d-mouth.webp",
      "project-live2d-editor.webp",
      "project-live2d-runtime.webp",
      "project-live2d-preview.webm",
      "project-live2d-preview.mp4",
    ],
  },
  {
    sourceDir: "ai-visual-workflow",
    slug: "ai-visual-workflow",
    targetDir: "ai-visual-workflow",
    files: [
      "project-ai-visual-cover.webp",
      "project-ai-consistency.webp",
      "project-ai-before-after.webp",
      "project-ai-prompt-result.webp",
      "project-ai-workflow.webp",
      "project-ai-background.webp",
      "project-ai-retouch.webp",
      "project-ai-gallery.webp",
      "project-ai-preview.webm",
      "project-ai-preview.mp4",
    ],
  },
];

const labFileByTitle = {
  信封滚动动画: "lab-gsap-envelope.webp",
  信封滚动动效: "lab-gsap-envelope.webp",
  历史时间轴: "lab-gsap-timeline.webp",
  水墨转场: "lab-ink-transition.webp",
  量子隧穿片段: "lab-manim-quantum.webp",
  统计可视化: "lab-manim-statistics.webp",
  统计可视化片段: "lab-manim-statistics.webp",
  "Live2D 结构": "lab-live2d-character.webp",
  "Live2D 角色结构": "lab-live2d-character.webp",
  "AI 视觉筛选": "lab-ai-visual.webp",
  "品牌 Lottie": "lab-lottie-brand.webp",
};

const postMappings = [
  ["ink-blog.md", "ink-blog-design", "post-ink-blog-cover.webp"],
  ["next-generation-letter.md", "next-generation-letter-story", "post-next-letter-cover.webp"],
  ["quantum-tunneling.md", "quantum-tunneling-misconceptions", "post-quantum-cover.webp"],
  ["live2d-layering.md", "live2d-layering", "post-live2d-cover.webp"],
  ["ai-character-consistency.md", "ai-character-consistency", "post-ai-workflow-cover.webp"],
];

function findSourceDir() {
  return sourceCandidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isDirectory());
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function publicPath(file) {
  return `/${rel(file).replace(/^public\//, "")}`;
}

function ensureDir(dir) {
  if (!checkOnly) fs.mkdirSync(dir, { recursive: true });
}

function readUtf8(file) {
  if (!fs.existsSync(file)) return "";
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
}

function parseKeyValue(text) {
  const data = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes("：")) continue;
    const [key, ...rest] = trimmed.split("：");
    const value = rest.join("：").trim();
    if (key.trim() && value) data[key.trim()] = value;
  }
  return data;
}

function splitList(value) {
  if (!value) return [];
  return value
    .split(/[、,，;；\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}

function isPlaceholder(file) {
  return file.endsWith(".REPLACE.txt");
}

function recordPlaceholders(sourceDir) {
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
      } else if (entry.isFile() && isPlaceholder(entry.name)) {
        counters.skippedPlaceholders.push(path.relative(sourceDir, fullPath).replaceAll(path.sep, "/"));
      }
    }
  };
  visit(sourceDir);
}

function validateFile(file, kind) {
  if (!fs.existsSync(file)) return false;
  const stat = fs.statSync(file);
  if (stat.size <= 0) {
    counters.invalid.push(`${rel(file)} is empty`);
    return false;
  }
  const head = fs.readFileSync(file, { encoding: null, flag: "r" }).subarray(0, 16);
  if (kind === "pdf" && head.toString("utf8", 0, 4) !== "%PDF") {
    counters.invalid.push(`${rel(file)} is not a valid PDF`);
    return false;
  }
  return true;
}

function copyIfReal(source, target, kind = "asset") {
  if (isPlaceholder(source)) {
    counters.skippedPlaceholders.push(rel(source));
    return false;
  }
  if (!fs.existsSync(source)) {
    counters.missingOptional.push(rel(source));
    return false;
  }
  if (!validateFile(source, kind)) return false;
  ensureDir(path.dirname(target));
  if (fs.existsSync(target) && fs.readFileSync(source).equals(fs.readFileSync(target))) {
    counters.unchanged.push(rel(target));
    return true;
  }
  if (!checkOnly) fs.copyFileSync(source, target);
  counters.copied.push(rel(target));
  return true;
}

function writeIfChanged(file, content) {
  const normalized = content.endsWith("\n") ? content : `${content}\n`;
  ensureDir(path.dirname(file));
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === normalized) {
    counters.unchanged.push(rel(file));
    return;
  }
  if (!checkOnly) fs.writeFileSync(file, normalized, "utf8");
  counters.generated.push(rel(file));
}

function ts(value) {
  return JSON.stringify(value, null, 2).replace(/"([^"]+)":/g, "$1:");
}

function generateTs(file, typeBlock, exportBlock) {
  writeIfChanged(file, `// Generated by sync-blog-materials.mjs. Do not edit manually.\n\n${typeBlock}\n\n${exportBlock}`);
}

function syncProfile(sourceDir) {
  const profileDir = path.join(sourceDir, "profile");
  const targetDir = path.join(root, "public", "images", "profile");
  const photos = {};
  for (const name of ["profile-original.jpg", "profile-square.webp", "profile-portrait.webp", "profile-small.webp"]) {
    const target = path.join(targetDir, name);
    if (copyIfReal(path.join(profileDir, name), target)) {
      const key = name.replace("profile-", "").replace(/\.(jpg|webp)$/u, "");
      photos[key] = publicPath(target);
    }
  }

  const data = parseKeyValue(readUtf8(path.join(profileDir, "personal-info.txt")));
  const education = [data["学校"], data["学院"], data["专业"], data["当前年级"]].filter(Boolean).join(" / ");
  const generated = {
    photo: photos.portrait ?? photos.square ?? photos.small,
    photos,
    summary: data["一句话介绍"],
    bio: data["正式简介"],
    location: data["所在城市"],
    status: data["当前正在进行"],
    education: education || undefined,
    current: data["个人方向"],
    exchange: data["可交流方向"],
    principles: data["创作原则"],
  };

  generateTs(
    path.join(root, "src", "generated", "profile.generated.ts"),
    `export type GeneratedProfile = {
  photo?: string;
  photos?: {
    original?: string;
    square?: string;
    portrait?: string;
    small?: string;
  };
  summary?: string;
  bio?: string;
  location?: string;
  status?: string;
  education?: string;
  current?: string;
  exchange?: string;
  principles?: string;
};`,
    `export const generatedProfile: GeneratedProfile = ${ts(generated)};`,
  );
}

function syncBranding(sourceDir) {
  const brandingDir = path.join(sourceDir, "branding");
  const branding = {};
  const copies = [
    ["site-og-cover.webp", path.join(root, "public", "images", "branding", "site-og-cover.webp"), "ogCover"],
    ["profile-card.webp", path.join(root, "public", "images", "branding", "profile-card.webp"), "profileCard"],
    ["favicon-512.png", path.join(root, "public", "favicon-512.png"), "favicon512"],
    ["apple-touch-icon.png", path.join(root, "public", "apple-touch-icon.png"), "appleTouchIcon"],
  ];
  for (const [name, target, key] of copies) {
    if (copyIfReal(path.join(brandingDir, name), target)) branding[key] = publicPath(target);
  }

  const pdfTarget = path.join(root, "public", "resume", "haoxuan-zhang-resume.pdf");
  const resumePdf = copyIfReal(path.join(sourceDir, "resume", "haoxuan-zhang-resume.pdf"), pdfTarget, "pdf")
    ? publicPath(pdfTarget)
    : undefined;

  generateTs(
    path.join(root, "src", "generated", "materials.generated.ts"),
    `export type GeneratedMaterials = {
  resumePdf?: string;
  branding?: {
    ogCover?: string;
    profileCard?: string;
    favicon512?: string;
    appleTouchIcon?: string;
  };
};`,
    `export const generatedMaterials: GeneratedMaterials = ${ts({ resumePdf, branding })};`,
  );
}

function syncSocials(sourceDir) {
  const data = parseKeyValue(readUtf8(path.join(sourceDir, "contact", "social-links.txt")));
  const socials = [];
  const add = (label, raw) => {
    if (!raw) return;
    const href = label === "Email" && !raw.startsWith("mailto:") ? `mailto:${raw}` : raw;
    if (label === "抖音" && href.includes("/user/self")) {
      counters.warnings.push("抖音链接仍为 /user/self，已隐藏。");
      return;
    }
    if (isValidUrl(href)) socials.push({ label, href });
    else counters.invalid.push(`Invalid ${label} link`);
  };
  add("GitHub", data["GitHub"]);
  add("Bilibili", data["Bilibili"]);
  add("抖音", data["抖音公开主页"]);
  add("Email", data["公开邮箱"]);

  generateTs(
    path.join(root, "src", "generated", "socials.generated.ts"),
    `export type GeneratedSocial = {
  label: "GitHub" | "Bilibili" | "抖音" | "Email";
  href: string;
};

export type GeneratedContact = {
  acceptsCollaboration?: boolean;
  collaborationTypes?: string;
};`,
    `export const generatedSocials: GeneratedSocial[] = ${ts(socials)};
export const generatedContact: GeneratedContact = ${ts({
      acceptsCollaboration: data["是否接受合作"] === "是" ? true : undefined,
      collaborationTypes: data["合作类型"],
    })};`,
  );
}

function syncProjects(sourceDir) {
  const patches = [];
  for (const mapping of projectMappings) {
    const sourceProjectDir = path.join(sourceDir, "projects", mapping.sourceDir);
    const targetDir = path.join(root, "public", "images", "projects", mapping.targetDir);
    const gallery = [];
    const video = {};
    let cover;

    for (const file of mapping.files) {
      const target = path.join(targetDir, file);
      if (!copyIfReal(path.join(sourceProjectDir, file), target)) continue;
      if (file.endsWith(".webm")) video.webm = publicPath(target);
      else if (file.endsWith(".mp4")) video.mp4 = publicPath(target);
      else if (file.includes("cover")) cover = publicPath(target);
      else gallery.push(publicPath(target));
    }

    const data = parseKeyValue(readUtf8(path.join(sourceProjectDir, "project-info.txt")));
    const patch = {
      slug: mapping.slug,
      title: data["项目名称"],
      year: data["项目时间"],
      description: data["项目背景"],
      subtitle: data["为什么制作"],
      responsibilities: splitList(data["个人职责"]),
      tags: splitList(data["使用技术"]),
      background: data["项目背景"],
      goals: splitList(data["为什么制作"]),
      process: splitList(data["解决方法"]),
      challenges: splitList(data["主要问题"]),
      results: splitList(data["最终成果"]),
      demo: isValidUrl(data["在线地址"] ?? "") ? data["在线地址"] : undefined,
      github: isValidUrl(data["GitHub"] ?? "") ? data["GitHub"] : undefined,
      cover,
      gallery,
      video: Object.keys(video).length ? { ...video, poster: cover } : undefined,
    };
    patches.push(patch);
  }

  generateTs(
    path.join(root, "src", "generated", "projects.generated.ts"),
    `export type GeneratedProjectPatch = {
  slug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  year?: string;
  status?: string;
  cover?: string;
  tags?: string[];
  responsibilities?: string[];
  background?: string;
  goals?: string[];
  process?: string[];
  challenges?: string[];
  results?: string[];
  gallery?: string[];
  demo?: string;
  github?: string;
  video?: {
    webm?: string;
    mp4?: string;
    poster?: string;
  };
};`,
    `export const generatedProjectPatches: GeneratedProjectPatch[] = ${ts(patches)};`,
  );
}

function syncLab(sourceDir) {
  const labDir = path.join(sourceDir, "lab");
  const patches = [];
  for (const [title, file] of Object.entries(labFileByTitle)) {
    const target = path.join(root, "public", "images", "lab", file);
    if (copyIfReal(path.join(labDir, file), target)) patches.push({ title, preview: publicPath(target) });
  }

  generateTs(
    path.join(root, "src", "generated", "lab.generated.ts"),
    `export type GeneratedLabPatch = {
  title: string;
  type?: string;
  year?: string;
  description?: string;
  preview?: string;
  demo?: string;
  github?: string;
  video?: string;
  technologies?: string[];
};`,
    `export const generatedLabPatches: GeneratedLabPatch[] = ${ts(patches)};`,
  );
}

function normalizePostMarkdown(raw, fallbackSlug, fallbackCover) {
  const hasFrontmatter = raw.startsWith("---");
  if (!hasFrontmatter) return "";
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return "";
  let frontmatter = raw.slice(0, end + 4);
  const body = raw.slice(end + 4).trim();
  if (body.length < 300 || /待补充|TODO|模板/.test(body)) return "";
  if (/\ndate:\s*""/m.test(frontmatter) || !/\ndate:\s*["']?\d{4}-\d{2}-\d{2}/m.test(frontmatter)) {
    return "";
  }
  if (!/^slug:/m.test(frontmatter)) frontmatter = frontmatter.replace("---\n", `---\nslug: "${fallbackSlug}"\n`);
  if (!/^featured:/m.test(frontmatter)) frontmatter += "\nfeatured: false";
  if (!/^draft:/m.test(frontmatter)) frontmatter += "\ndraft: false";
  frontmatter = frontmatter.replace(/cover:\s*"[^"]*"/m, `cover: "${fallbackCover}"`);
  return `${frontmatter}\n\n${body}\n`;
}

function syncPosts(sourceDir) {
  const coversDir = path.join(sourceDir, "posts", "covers");
  for (const [, , cover] of postMappings) {
    copyIfReal(path.join(coversDir, cover), path.join(root, "public", "images", "posts", cover));
  }

  for (const [file, slug, cover] of postMappings) {
    const normalized = normalizePostMarkdown(
      readUtf8(path.join(sourceDir, "posts", file)),
      slug,
      `/images/posts/${cover}`,
    );
    if (!normalized) {
      counters.postsSkipped.push(file);
      continue;
    }
    const target = path.join(root, "content", "posts", file);
    writeIfChanged(target, normalized);
    counters.postsPublished.push(file);
  }
}

function writeReport(sourceDir) {
  const report = [
    "# Material Integration Report",
    "",
    `- Source directory: ${path.basename(sourceDir)}`,
    `- Mode: ${checkOnly ? "check" : "sync"}`,
    `- Copied: ${counters.copied.length}`,
    `- Unchanged: ${counters.unchanged.length}`,
    `- Skipped placeholders: ${counters.skippedPlaceholders.length}`,
    `- Missing optional: ${counters.missingOptional.length}`,
    `- Invalid: ${counters.invalid.length}`,
    "",
    "## Copied",
    ...counters.copied.map((item) => `- ${item}`),
    "",
    "## Generated",
    ...counters.generated.map((item) => `- ${item}`),
    "",
    "## Posts",
    ...counters.postsPublished.map((item) => `- synced ${item}`),
    ...counters.postsSkipped.map((item) => `- skipped ${item}`),
    "",
    "## Missing Optional",
    ...counters.missingOptional.map((item) => `- ${item}`),
    "",
    "## Warnings",
    ...counters.warnings.map((item) => `- ${item}`),
    "",
    "## Invalid",
    ...counters.invalid.map((item) => `- ${item}`),
  ].join("\n");
  if (!checkOnly) writeIfChanged(path.join(root, "docs", "material-integration-report.md"), report);
}

const sourceDir = findSourceDir();
if (!sourceDir) {
  console.error("[materials] source directory not found.");
  console.error("[materials] Put blog_materials_template at project root, materials/blog_materials_template, or set BLOG_MATERIALS_DIR.");
  process.exit(1);
}

recordPlaceholders(sourceDir);
syncProfile(sourceDir);
syncBranding(sourceDir);
syncSocials(sourceDir);
syncProjects(sourceDir);
syncLab(sourceDir);
syncPosts(sourceDir);
writeReport(sourceDir);

console.log(`[materials] source directory: ${path.basename(sourceDir)}`);
console.log(`[materials] copied: ${counters.copied.length}`);
console.log(`[materials] unchanged: ${counters.unchanged.length}`);
console.log(`[materials] skipped placeholders: ${counters.skippedPlaceholders.length}`);
console.log(`[materials] missing optional: ${counters.missingOptional.length}`);
console.log(`[materials] invalid: ${counters.invalid.length}`);
console.log(`[materials] generated data: ${counters.generated.length}`);
if (counters.warnings.length) {
  console.log(`[materials] warnings: ${counters.warnings.length}`);
}

if (counters.invalid.length) process.exit(1);
