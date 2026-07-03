import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");
const repoRoot = process.cwd();
const failures = [];
const verifyDeploymentRoot = process.env.VERIFY_DEPLOY_ROOT === "1";

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

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function extractScriptSources(html) {
  return [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]);
}

function resolveExportPath(baseDir, src) {
  const cleanSrc = src.split("?")[0];
  const relativeSrc = cleanSrc.startsWith("/") ? cleanSrc.slice(1) : cleanSrc;
  return path.join(baseDir, relativeSrc);
}

function readReferencedScripts(baseDir, html, label) {
  const sources = extractScriptSources(html);
  const chunks = [];

  for (const src of sources) {
    if (!src.includes("/_next/")) continue;
    const file = resolveExportPath(baseDir, src);
    expect(fs.existsSync(file), `${label} references missing Next.js chunk: ${src}`);
    const text = readIfExists(file);
    if (text) chunks.push({ src, file, text });
  }

  return chunks;
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
const outChunks = readReferencedScripts(outDir, index, "out/index.html");
const rootIndexPath = path.join(repoRoot, "index.html");
const rootIndex = verifyDeploymentRoot ? readIfExists(rootIndexPath) : "";
const rootChunks = rootIndex ? readReferencedScripts(repoRoot, rootIndex, "root index.html") : [];
const exportedChunkText = outChunks.map((chunk) => chunk.text).join("\n");
const brandIntroChunk = outChunks.find((chunk) => chunk.text.includes("haoxuan-blog-brand-intro-played"));
const deployedBrandIntroChunk = rootChunks.find((chunk) => chunk.text.includes("haoxuan-blog-brand-intro-played"));
const brandIntroChunkText = brandIntroChunk?.text ?? "";
const deployedBrandIntroChunkText = deployedBrandIntroChunk?.text ?? "";

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
expect(outChunks.length > 0, "out/index.html does not reference any Next.js chunks.");
expect(Boolean(brandIntroChunk), "Exported chunks do not contain haoxuan-blog-brand-intro-played.");
expect(exportedChunkText.includes("haoxuan-brand-intro-played"), "Exported chunks do not retain the legacy Brand Intro session key.");
expect(brandIntroChunkText.includes("checking"), "Exported Brand Intro chunk does not contain the checking intro phase.");
expect(brandIntroChunkText.includes("loading"), "Exported Brand Intro chunk does not contain the loading intro phase.");
expect(brandIntroChunkText.includes("playing"), "Exported Brand Intro chunk does not contain the playing intro phase.");
expect(brandIntroChunkText.includes("exiting"), "Exported Brand Intro chunk does not contain the exiting intro phase.");
expect(brandIntroChunkText.includes("removed"), "Exported Brand Intro chunk does not contain the removed intro phase.");
expect(brandIntroChunkText.includes("timeout"), "Exported Brand Intro chunk does not contain the timeout close reason.");
expect(brandIntroChunkText.includes("route-change"), "Exported Brand Intro chunk does not contain the route-change close reason.");
expect(brandIntroChunkText.includes("load-error"), "Exported Brand Intro chunk does not contain the load-error close reason.");
expect(!brandIntroChunkText.includes("onAnimationComplete"), "Exported Brand Intro code still references onAnimationComplete.");
expect(!brandIntroChunkText.includes('"idle"'), "Exported Brand Intro chunk still contains the old idle intro state.");
expect(!brandIntroChunkText.includes('"closed"'), "Exported Brand Intro chunk still contains the old closed intro state.");
expect(
  (brandIntroChunkText.includes("3000") || brandIntroChunkText.includes("3e3")) && brandIntroChunkText.includes("340"),
  "Exported chunks do not contain the 3000ms max duration and exit failsafe timing.",
);

if (verifyDeploymentRoot) {
  expect(Boolean(rootIndex), "root index.html is missing.");
  expect(rootChunks.length > 0, "root index.html does not reference any Next.js chunks.");
  expect(Boolean(deployedBrandIntroChunk), "Root deployment chunks do not contain haoxuan-blog-brand-intro-played.");
  expect(deployedBrandIntroChunkText.includes("timeout"), "Root deployment Brand Intro chunk does not contain the timeout close reason.");
  expect(
    !deployedBrandIntroChunkText.includes("onAnimationComplete"),
    "Root deployment Brand Intro chunk still references onAnimationComplete.",
  );
  expect(rootIndex === index, "Root index.html differs from out/index.html after deployment.");
}

if (failures.length) {
  console.error("Static build verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const fileCount = fs.readdirSync(outDir, { recursive: true }).filter((entry) => {
    const fullPath = path.join(outDir, entry.toString());
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
  }).length;
  const brandChunkName = brandIntroChunk ? path.relative(outDir, brandIntroChunk.file).replaceAll(path.sep, "/") : "unknown";
  console.log(`Static build verification passed. out files: ${fileCount}`);
  console.log(`Brand Intro chunk: ${brandChunkName}`);
}
