const fs = require('fs');
const PresentationService = require('./presentationService');
const getMediaItemsFromFolder = require('./prepareMediaInput');

async function runExample() {
  // Get media items from the ./media folder
  const mediaItems = getMediaItemsFromFolder('./media');
  const pptBuffer = await PresentationService.generateSlides(mediaItems);
  fs.writeFileSync('output.pptx', pptBuffer);
  console.log('Presentation generated as output.pptx');
}

runExample(); 