const PptxGenJS = require('pptxgenjs');
const inspirationSlide = require('./inspirationSlide');
const constants = require('./constants');

class PresentationService {
  static async generateSlides(mediaItems) {
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'FIXED_16x9', width: constants.SLIDE_WIDTH, height: constants.SLIDE_HEIGHT });
    pptx.layout = 'FIXED_16x9';
    inspirationSlide(pptx, mediaItems);
    return await pptx.write('nodebuffer');
  }
}

module.exports = PresentationService; 