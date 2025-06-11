const fs = require('fs');
const path = require('path');

function getFileExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

function getMimeType(extension) {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.wmv': 'video/x-ms-wmv',
    '.flv': 'video/x-flv',
    '.webm': 'video/webm'
  };
  return mimeTypes[extension] || 'application/octet-stream';
}

function convertFileToBase64(filePath) {
  try {
    const fileData = fs.readFileSync(filePath);
    const extension = getFileExtension(filePath);
    const mimeType = getMimeType(extension);
    const base64Data = fileData.toString('base64');
    return `data:${mimeType};base64,${base64Data}`;
  } catch (error) {
    console.error(`Error converting file to base64: ${filePath}`, error);
    throw error;
  }
}

module.exports = {
  convertFileToBase64,
  getFileExtension,
  getMimeType
}; 