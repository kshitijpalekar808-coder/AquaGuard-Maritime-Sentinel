import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = process.cwd();
const outputDir = path.join(process.cwd(), 'public', 'sequence');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processFrames() {
  console.log('Beginning frame sampling and watermark elimination for 120 frames...');

  const totalTargetFrames = 160;
  const totalSourceFrames = 160;

  // Watermark parameters in 1280x720:
  // Watermark is centered around x: 1165, y: 615 (~50x50 area)
  // We extract a clean ocean water patch from x: 1060, y: 580 (width 80, height 80)
  // and composite it at x: 1130, y: 580 with feathered edges
  const patchWidth = 80;
  const patchHeight = 80;
  const patchSourceX = 1050;
  const patchSourceY = 580;
  const patchDestX = 1130;
  const patchDestY = 580;

  // Create an SVG feathered mask for seamless blending of the patch
  const maskSvg = `
    <svg width="${patchWidth}" height="${patchHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="feather" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stop-color="white" stop-opacity="1"/>
          <stop offset="95%" stop-color="white" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${patchWidth}" height="${patchHeight}" fill="url(#feather)"/>
    </svg>
  `;
  const maskBuffer = Buffer.from(maskSvg);

  for (let i = 0; i < totalTargetFrames; i++) {
    // Map index 0..119 to 1..160
    const sourceIndex = Math.round((i * (totalSourceFrames - 1)) / (totalTargetFrames - 1)) + 1;
    const inputFilename = `ezgif-frame-${String(sourceIndex).padStart(3, '0')}.jpg`;
    const inputPath = path.join(inputDir, inputFilename);
    const outputPath = path.join(outputDir, `frame_${i}.webp`);

    if (!fs.existsSync(inputPath)) {
      console.warn(`Source frame not found: ${inputPath}`);
      continue;
    }

    try {
      // 1. Extract the clean water patch
      const cleanPatch = await sharp(inputPath)
        .extract({ left: patchSourceX, top: patchSourceY, width: patchWidth, height: patchHeight })
        .toBuffer();

      // 2. Apply feather mask to the patch
      const featheredPatch = await sharp(cleanPatch)
        .composite([{ input: maskBuffer, blend: 'dest-in' }])
        .png()
        .toBuffer();

      // 3. Composite feathered patch over the watermark location and save as optimized WebP
      await sharp(inputPath)
        .composite([
          {
            input: featheredPatch,
            top: patchDestY,
            left: patchDestX,
            blend: 'over'
          }
        ])
        .webp({ quality: 90, effort: 4 })
        .toFile(outputPath);

      if (i % 25 === 0 || i === totalTargetFrames - 1) {
        console.log(`Processed frame_${i}.webp (${i + 1}/${totalTargetFrames}) from ${inputFilename}`);
      }
    } catch (err) {
      console.error(`Error processing frame ${i}:`, err);
    }
  }

  console.log('Sequence processing completed! 160 clean WebP frames generated in public/sequence/');
}

processFrames().catch(console.error);
