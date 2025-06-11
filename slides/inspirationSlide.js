const { basePath, inspirationText, fontFamily, headingFontSize, headingFontColor } = require('../constants');

module.exports = async (pptx, consolidatedAssets, labels = {}) => {
  try {
    const slide = pptx.addSlide();

    // Add title with reduced height to give more space for images
    slide.addText('Inspiration & References', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.7,
      fontSize: 44,
      bold: true,
      fontFace: 'Arial'
    });

    // Adjusted positions for 3x2 grid to fit within slide (in inches)
    // Standard 16:9 slide is 10 x 5.625 inches
    const positions = [
      // First row - y starts at 1.2 instead of 1.8
      { x: 0.5, y: 1.2, w: 2.8, h: 2 },
      { x: 3.6, y: 1.2, w: 2.8, h: 2 },
      { x: 6.7, y: 1.2, w: 2.8, h: 2 },
      // Second row - y at 3.4 to ensure visibility
      { x: 0.5, y: 3.4, w: 2.8, h: 2 },
      { x: 3.6, y: 3.4, w: 2.8, h: 2 },
      { x: 6.7, y: 3.4, w: 2.8, h: 2 }
    ];

    // Add each media item
    consolidatedAssets.forEach((asset, index) => {
      if (index >= positions.length) return;

      const pos = positions[index];

      if (asset.type === 'video') {
        slide.addMedia({
          type: 'video',
          x: pos.x,
          y: pos.y,
          w: pos.w,
          h: pos.h,
          data: asset.data,
          path: asset.originalPath
        });
      } else {
        // Add image with proper sizing
        slide.addImage({
          data: asset.data,
          x: pos.x,
          y: pos.y,
          w: pos.w,
          h: pos.h,
          sizing: {
            type: 'contain',
            w: pos.w,
            h: pos.h
          },
          fill: { color: 'FFFFFF' }
        });
      }
    });

    return slide;
  } catch (error) {
    console.error('Error creating inspiration slide:', error);
    throw error;
  }
}; 