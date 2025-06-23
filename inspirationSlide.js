const constants = require('./constants');

module.exports = (pptx, mediaItems) => {
  const slide = pptx.addSlide();

  // Add title
  slide.addText(constants.TITLE_TEXT, {
    x: constants.TITLE_X,
    y: constants.TITLE_Y,
    w: constants.TITLE_W,
    h: constants.TITLE_H,
    fontSize: constants.TITLE_FONT_SIZE,
    bold: true,
    fontFace: constants.TITLE_FONT_FACE,
  });

  // Add media in grid
  mediaItems.slice(0, constants.GRID_POSITIONS.length).forEach((item, idx) => {
    const pos = constants.GRID_POSITIONS[idx];
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
        sizing: { type: 'contain', w: pos.w, h: pos.h },
        fill: { color: 'FFFFFF' },
      });
    }
  });

  return slide;
}; 