const fs = require('fs');
const PresentationService = require('./services/presentationService');

async function generatePresentation() {
  try {
    // Sample input data
    const selectedBrandInfo = {
      slide6: {
        headingFontSize: 24,
        headingFontColor: '000000'
      }
    };

    const briefRequestBody = {
      BRAND_NAME: 'Sample Brand'
    };

    const labels = {
      INSPIRATION: 'Inspiration & References'
    };

    // Generate presentation
    const pptBuffer = await PresentationService.generateSlides(
      selectedBrandInfo,
      briefRequestBody,
      {},
      labels
    );

    // Save the presentation
    fs.writeFileSync('output.pptx', pptBuffer);
    console.log('Presentation generated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
generatePresentation(); 