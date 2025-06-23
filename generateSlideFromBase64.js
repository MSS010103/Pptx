const PptxGenJS = require('pptxgenjs');

/**
 * Generate a PowerPoint presentation with up to 6 media items (images/videos) in a 3x2 grid, using base64 input.
 * @param {Array} mediaItems - Array of media objects: { base64, type ('image'|'video'), filename }
 * @param {string} outputPath - Path to save the generated PPTX file
 */
async function generateSlideFromBase64(mediaItems, outputPath) {
  const pptx = new PptxGenJS();
  // Set fixed 16:9 layout as in the working version
  pptx.defineLayout({ name: 'FIXED_16x9', width: 10, height: 5.625 });
  pptx.layout = 'FIXED_16x9';
  const slide = pptx.addSlide();

  // Add title as in the working version
  slide.addText('Inspiration & References', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.7,
    fontSize: 44,
    bold: true,
    fontFace: 'Arial',
  });

  // 3x2 grid positions (from inspirationSlide.js)
  const positions = [
    { x: 0.5, y: 1.2, w: 2.8, h: 2 },
    { x: 3.6, y: 1.2, w: 2.8, h: 2 },
    { x: 6.7, y: 1.2, w: 2.8, h: 2 },
    { x: 0.5, y: 3.4, w: 2.8, h: 2 },
    { x: 3.6, y: 3.4, w: 2.8, h: 2 },
    { x: 6.7, y: 3.4, w: 2.8, h: 2 },
  ];

  // Only take up to 6 items
  const items = mediaItems.slice(0, 6);

  items.forEach((item, index) => {
    if (index >= positions.length) return;
    const pos = positions[index];
    if (item.type === 'video') {
      slide.addMedia({
        type: 'video',
        x: pos.x,
        y: pos.y,
        w: pos.w,
        h: pos.h,
        data: item.base64,
      });
    } else {
      slide.addImage({
        data: item.base64,
        x: pos.x,
        y: pos.y,
        w: pos.w,
        h: pos.h,
        sizing: {
          type: 'contain',
          w: pos.w,
          h: pos.h,
        },
        fill: { color: 'FFFFFF' },
      });
    }
  });

  await pptx.writeFile({ fileName: outputPath });
  console.log(`Presentation saved to ${outputPath}`);
}

// Example usage:
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');

  // Helper to convert file to base64 (reference from your code)
  function convertToBase64(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();
    let mimeType;
    switch (fileExtension) {
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg';
        break;
      case '.png':
        mimeType = 'image/png';
        break;
      case '.gif':
        mimeType = 'image/gif';
        break;
      case '.bmp':
        mimeType = 'image/bmp';
        break;
      case '.webp':
        mimeType = 'image/webp';
        break;
      case '.mp4':
        mimeType = 'video/mp4';
        break;
      case '.webm':
        mimeType = 'video/webm';
        break;
      default:
        mimeType = 'application/octet-stream';
    }
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  }

  // Example: load up to 6 media files from a 'media' folder
  const mediaDir = path.join(__dirname, 'media');
  const files = fs.readdirSync(mediaDir).filter(f => /\.(jpg|jpeg|png|gif|bmp|webp|mp4|webm)$/i.test(f));
  const mediaItems = files.slice(0, 6).map(f => {
    const ext = path.extname(f).toLowerCase();
    const type = ['.mp4', '.webm'].includes(ext) ? 'video' : 'image';
    return {
      base64: convertToBase64(path.join(mediaDir, f)),
      type,
      filename: f,
    };
  });

  generateSlideFromBase64(mediaItems, path.join(__dirname, 'output.pptx'));
}

module.exports = generateSlideFromBase64; 