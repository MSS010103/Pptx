function getFileExtension(filename) {
  return filename ? filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase() : '';
}

function getTypeFromBase64(base64) {
  if (!base64) return null;
  if (base64.startsWith('data:image/')) return 'image';
  if (base64.startsWith('data:video/')) return 'video';
  return null;
}

function isValidBase64(str) {
  return typeof str === 'string' && str.startsWith('data:') && str.includes(';base64,');
}

module.exports = {
  getFileExtension,
  getTypeFromBase64,
  isValidBase64,
}; 