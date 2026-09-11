import fs from "fs";
import { execSync } from "child_process";
import path from "path";

const presets = ["00001", "00148", "00058", "clean_00007"];
const py = "C:\\Users\\Kshitij Palekar\\AppData\\Local\\Programs\\Python\\Python313\\python.exe";

for (const p of presets) {
  const input = path.resolve(`public/benchmarks/${p}.webp`);
  const outDir = path.resolve(`public/processed/${p}`);
  if (fs.existsSync(input)) {
    console.log(`Processing preset ${p}...`);
    try {
      execSync(`"${py}" scripts/maritime_sentinel_pipeline.py --input "${input}" --output-dir "${outDir}"`, { stdio: "inherit" });
      console.log(`✓ Completed preset ${p}`);
    } catch (e) {
      console.error(`Failed ${p}:`, e.message);
    }
  }
}
