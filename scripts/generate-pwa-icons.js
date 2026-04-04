const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const outputDir = path.join(__dirname, '../apps/web/public/icons')
fs.mkdirSync(outputDir, { recursive: true })

// Source: high-res BFF logo
const sourceLogo = path.join(
  __dirname,
  '../../first draft website/public/Photos/BFF-Logo-1024.jpg'
)

const logoExists = fs.existsSync(sourceLogo)
console.log(logoExists ? `Using source logo: ${sourceLogo}` : 'No source logo found — generating branded placeholder')

async function fromLogo(size, filename) {
  await sharp(sourceLogo)
    .resize(size, size, { fit: 'contain', background: { r: 13, g: 43, b: 62, alpha: 1 } })
    .png()
    .toFile(path.join(outputDir, filename))
  console.log(`Generated: ${filename} (from logo)`)
}

async function fromSvg(size, filename) {
  const rx = Math.round(size * 0.12)
  const svgBuffer = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#0d2b3e" rx="${rx}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${Math.round(size * 0.32)}" fill="#e8923a" opacity="0.9"/>
      <text
        x="${size / 2}" y="${size / 2 + Math.round(size * 0.07)}"
        font-family="Georgia, serif"
        font-size="${Math.round(size * 0.2)}"
        font-weight="bold"
        fill="#eef6fb"
        text-anchor="middle"
        dominant-baseline="middle"
      >BFF</text>
    </svg>
  `)
  await sharp(svgBuffer).png().toFile(path.join(outputDir, filename))
  console.log(`Generated: ${filename} (placeholder)`)
}

async function generateIcon(size, filename) {
  if (logoExists) {
    await fromLogo(size, filename)
  } else {
    await fromSvg(size, filename)
  }
}

async function run() {
  await generateIcon(192, 'icon-192x192.png')
  await generateIcon(512, 'icon-512x512.png')
  await generateIcon(512, 'icon-maskable-512x512.png')
  await generateIcon(180, 'apple-touch-icon.png')
  await generateIcon(32, 'favicon-32x32.png')
  console.log('All icons generated.')
}

run().catch(console.error)
