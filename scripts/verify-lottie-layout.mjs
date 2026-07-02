import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function readJson(file) {
  expect(fs.existsSync(file), `${file} is missing.`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function hash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const lightPath = path.resolve("public/lottie/light/lab-modules.json");
const darkPath = path.resolve("public/lottie/dark/lab-modules.json");
const outLightPath = path.resolve("out/lottie/light/lab-modules.json");
const outDarkPath = path.resolve("out/lottie/dark/lab-modules.json");
const light = readJson(lightPath);
const dark = readJson(darkPath);

expect(light.w === dark.w && light.h === dark.h, "Light and dark Lab Modules dimensions differ.");
expect(light.fr === dark.fr && light.op === dark.op && light.ip === dark.ip, "Light and dark Lab Modules timing differs.");
expect(light.layers.length === dark.layers.length, "Light and dark Lab Modules layer counts differ.");
expect(light.w === 512 && light.h === 512, "Lab Modules canvas is not 512x512.");

const labPage = fs.readFileSync(path.resolve("src/app/lab/page.tsx"), "utf8");
const lottieDemo = fs.readFileSync(path.resolve("src/components/lab/LottieDemo.tsx"), "utf8");
expect((labPage.match(/lab-modules/g) ?? []).length === 0, "Lab page should not render lab-modules directly.");
expect((lottieDemo.match(/lab-modules/g) ?? []).length === 1, "LottieDemo should be the only Lab Modules source usage.");
expect(!/className=.*overflow-hidden/.test(lottieDemo), "LottieDemo still has player-level overflow-hidden.");
expect(lottieDemo.includes('fit="contain"'), "Lab Modules does not use fit=\"contain\".");

const outLab = fs.existsSync(path.resolve("out/lab.html"))
  ? fs.readFileSync(path.resolve("out/lab.html"), "utf8")
  : fs.existsSync(path.resolve("out/lab/index.html"))
    ? fs.readFileSync(path.resolve("out/lab/index.html"), "utf8")
    : "";
expect(Boolean(outLab), "Latest Lab export is missing.");
expect(outLab.includes("data-lab-card"), "Latest Lab export does not contain data-lab-card.");
expect(fs.existsSync(outLightPath), "Exported light Lab Modules is missing.");
expect(fs.existsSync(outDarkPath), "Exported dark Lab Modules is missing.");
if (fs.existsSync(outLightPath)) expect(hash(lightPath) === hash(outLightPath), "Exported light Lab Modules differs from public source.");
if (fs.existsSync(outDarkPath)) expect(hash(darkPath) === hash(outDarkPath), "Exported dark Lab Modules differs from public source.");

if (failures.length) {
  console.error("Lottie layout verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Lottie layout verification passed. Geometry is consistent; visual clipping still requires browser review.");
}
