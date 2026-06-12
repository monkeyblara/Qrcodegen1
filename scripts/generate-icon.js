const Jimp = require('jimp');
const pngToIco = require('png-to-ico').default;
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const pngPath = path.join(outputDir, 'icon.png');
const icoPath = path.join(outputDir, 'icon.ico');

const size = 256;
const center = size / 2;

function blendColor(top, bottom, alpha) {
  return Math.round(top * alpha + bottom * (1 - alpha));
}

function createGradient(image) {
  const top = { r: 12, g: 61, b: 148 };
  const bottom = { r: 13, g: 22, b: 89 };

  for (let y = 0; y < size; y++) {
    const t = y / (size - 1);
    const r = blendColor(bottom.r, top.r, 1 - t);
    const g = blendColor(bottom.g, top.g, 1 - t);
    const b = blendColor(bottom.b, top.b, 1 - t);
    const color = Jimp.rgbaToInt(r, g, b, 255);
    for (let x = 0; x < size; x++) {
      image.setPixelColor(color, x, y);
    }
  }
}

function fillRect(image, x, y, w, h, color) {
  for (let iy = y; iy < y + h; iy++) {
    for (let ix = x; ix < x + w; ix++) {
      if (ix >= 0 && iy >= 0 && ix < size && iy < size) {
        image.setPixelColor(color, ix, iy);
      }
    }
  }
}

function fillCircle(image, cx, cy, radius, color) {
  const rSq = radius * radius;
  const startX = Math.max(0, Math.floor(cx - radius));
  const endX = Math.min(size - 1, Math.ceil(cx + radius));
  const startY = Math.max(0, Math.floor(cy - radius));
  const endY = Math.min(size - 1, Math.ceil(cy + radius));
  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= rSq) {
        image.setPixelColor(color, x, y);
      }
    }
  }
}

function drawDrop(image, x, y, sizeDrop, color) {
  const circleRadius = sizeDrop * 0.4;
  fillCircle(image, x, y + circleRadius * 0.2, circleRadius, color);
  fillCircle(image, x, y + circleRadius * 0.8, circleRadius * 0.9, color);
  fillRect(image, x - circleRadius * 0.5, y + circleRadius * 0.2, circleRadius, Math.round(circleRadius * 1.3), color);
}

(async () => {
  const icon = new Jimp(size, size, 0xffffffff);
  createGradient(icon);

  const white = Jimp.rgbaToInt(255, 255, 255, 255);
  const lightBlue = Jimp.rgbaToInt(194, 226, 255, 255);
  const yellow = Jimp.rgbaToInt(255, 199, 64, 255);
  const darkBlue = Jimp.rgbaToInt(22, 95, 176, 255);

  fillRect(icon, 36, 36, 184, 184, white);
  fillRect(icon, 44, 44, 168, 168, darkBlue);

  fillRect(icon, 56, 56, 40, 40, white);
  fillRect(icon, 56, 140, 40, 40, white);
  fillRect(icon, 140, 56, 40, 40, white);
  fillRect(icon, 140, 140, 40, 40, white);
  fillRect(icon, 104, 104, 48, 48, lightBlue);
  fillRect(icon, 80, 80, 24, 24, white);
  fillRect(icon, 140, 104, 24, 24, white);
  fillRect(icon, 104, 140, 24, 24, white);

  drawDrop(icon, 182, 122, 72, yellow);
  fillCircle(icon, 182, 100, 10, white);
  fillCircle(icon, 156, 112, 8, white);

  await icon.writeAsync(pngPath);
  console.log('Generated PNG icon at', pngPath);

  const icoBuffer = await pngToIco(pngPath);
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('Generated ICO icon at', icoPath);
})();