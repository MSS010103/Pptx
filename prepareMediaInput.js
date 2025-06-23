const fs = require('fs');
const path = require('path');
const { getTypeFromBase64 } = require('./mediaUtils');

// Helper to convert file to base64
function convertToBase64(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  let mimeType;
  switch (ext) {
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

// Prepare media array from media folder
function getMediaItemsFromFolder(mediaDir = './media') {
  if (!fs.existsSync(mediaDir)) return [];
  const files = fs.readdirSync(mediaDir).filter(f =>
    /\.(jpg|jpeg|png|gif|bmp|webp|mp4|webm)$/i.test(f)
  );
  return files.map(f => {
    const base64 = convertToBase64(path.join(mediaDir, f));
    const type = getTypeFromBase64(base64);
    return { base64, type, filename: f };
  });
}

module.exports = getMediaItemsFromFolder; 