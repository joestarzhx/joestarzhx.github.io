import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");
const failures = [];

function exists(...parts) {
  return fs.existsSync(path.join(outDir, ...parts));
}

function readFirst(paths) {
  for (const parts of paths) {
    const file = path.join(outDir, ...parts);
    if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  }
  failures.push(`Missing expected file: ${paths.map((parts) => parts.join("/")).join(" or ")}`);
  return "";
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

const index = readFirst([["index.html"]]);
const blog = readFirst([["blog.html"], ["blog", "index.html"]]);
const lab = readFirst([["lab.html"], ["lab", "index.html"]]);
const resume = readFirst([["resume.html"], ["resume", "index.html"]]);
const projectDetail = readFirst([["projects", "next-generation-letter.html"], ["projects", "next-generation-letter", "index.html"]]);
const brandLightPath = path.join(outDir, "lottie", "light", "brand-intro.json");
const brandDarkPath = path.join(outDir, "lottie", "dark", "brand-intro.json");
const brandLight = fs.existsSync(brandLightPath) ? fs.readFileSync(brandLightPath, "utf8") : "";
const brandDark = fs.existsSync(brandDarkPath) ? fs.readFileSync(brandDarkPath, "utf8") : "";

expect(exists("index.html"), "out/index.html is missing.");
expect(exists("blog.html") || exists("blog", "index.html"), "Blog export is missing.");
expect(exists("lab.html") || exists("lab", "index.html"), "Lab export is missing.");
expect(index.includes("© 2026 Haoxuan Zhang. 保留所有权利。"), "Home footer copyright is not the new text.");
expect(index.includes("用代码、动画和视觉设计，记录持续生长的数字作品。"), "Home footer intro is not the new text.");
expect(!index.includes("用代码和视觉系统整理想法"), "Home still contains old footer intro.");
expect(!index.includes("All rights reserved"), "Home still contains old English copyright.");
expect(!blog.includes("#全部标签"), "Blog still contains #全部标签.");
expect(blog.includes("全部标签"), "Blog does not contain 全部标签.");
expect(lab.includes("实验轨道"), "Lab does not contain 实验轨道.");
expect(lab.includes("08"), "Lab does not contain 08.");
expect(lab.includes('data-progress-label="01 / 08"'), "Lab does not contain stable 01 / 08 progress label.");
expect(!resume.includes("resume-timeline"), "Resume export still references resume-timeline.");
expect(brandLight.includes("HZ Monogram"), "Light Brand Intro does not contain HZ Monogram.");
expect(brandDark.includes("HZ Monogram"), "Dark Brand Intro does not contain HZ Monogram.");
expect(!brandLight.includes('"nm":"J"') && !brandLight.includes('"nm": "J"'), "Light Brand Intro still contains old J layer.");
expect(!brandDark.includes('"nm":"J"') && !brandDark.includes('"nm": "J"'), "Dark Brand Intro still contains old J layer.");
expect(!exists("lottie", "shared"), "out/lottie/shared still exists.");
expect(projectDetail.includes("data-project-story"), "Project detail export does not contain data-project-story.");
expect(index.includes("data-capability-card"), "Home export does not contain data-capability-card.");
expect(lab.includes("data-lab-card"), "Lab export does not contain data-lab-card.");

if (failures.length) {
  console.error("Static build verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const fileCount = fs.readdirSync(outDir, { recursive: true }).filter((entry) => {
    const fullPath = path.join(outDir, entry.toString());
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
  }).length;
  console.log(`Static build verification passed. out files: ${fileCount}`);
}
