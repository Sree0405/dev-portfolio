import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const brandingDir = path.join(root, "public", "branding");

await mkdir(brandingDir, { recursive: true });

// --- Brand logo: trim top/bottom padding so CSS width sizing shows full lockup ---
const brandSource = path.join(brandingDir, "sreeBrandLogo.png");
const brandMeta = await sharp(brandSource).metadata();
const brandTrimmed = await sharp(brandSource).trim().png().toBuffer();
const brandTrimmedMeta = await sharp(brandTrimmed).metadata();

await sharp(brandTrimmed).toFile(brandSource);

console.log(
  `Brand logo trimmed: ${brandMeta.width}x${brandMeta.height} → ${brandTrimmedMeta.width}x${brandTrimmedMeta.height}`,
);

// --- Favicons: trim, square, and export standard sizes ---
const iconSource = path.join(brandingDir, "sreefolio-siteIcon.png");
const trimmed = await sharp(iconSource).trim().toBuffer();
const meta = await sharp(trimmed).metadata();
const maxDim = Math.max(meta.width ?? 0, meta.height ?? 0);

const squared = await sharp(trimmed)
  .extend({
    top: Math.floor((maxDim - (meta.height ?? 0)) / 2),
    bottom: Math.ceil((maxDim - (meta.height ?? 0)) / 2),
    left: Math.floor((maxDim - (meta.width ?? 0)) / 2),
    right: Math.ceil((maxDim - (meta.width ?? 0)) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 1 },
  })
  .toBuffer();

const sizes = [16, 32, 48, 180, 192, 512];

for (const size of sizes) {
  const logoSize = Math.round(size * 0.94);

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(squared)
          .resize(logoSize, logoSize, { fit: "contain" })
          .toBuffer(),
        gravity: "centre",
      },
    ])
    .png()
    .toFile(path.join(brandingDir, `favicon-${size}.png`));
}

await sharp(path.join(brandingDir, "favicon-32.png")).toFile(
  path.join(brandingDir, "favicon.png"),
);

console.log(
  `Favicons generated from ${meta.width}x${meta.height} trimmed source → ${sizes.join(", ")}px`,
);
