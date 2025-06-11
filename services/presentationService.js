const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { convertFileToBase64 } = require('../utils/mediaUtils');
const inspirationSlide = require('../slides/inspirationSlide');

class PresentationService {
  static async processMedia(filePath) {
    try {
      const ext = path.extname(filePath).toLowerCase();
      const isVideo = ['.mp4', '.mov', '.avi', '.wmv'].includes(ext);

      if (isVideo) {
        return {
          type: 'video',
          data: convertFileToBase64(filePath)
        };
      } else {
        // Process images with fixed dimensions
        const imageBuffer = await sharp(filePath)
          .resize(800, 600, {
            fit: 'inside',
            withoutEnlargement: true,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .toBuffer();

        return {
          type: 'image',
          data: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
        };
      }
    } catch (error) {
      console.error('Error processing media:', error);
      throw error;
    }
  }

  static async getActualAssets(mediaDirectory = './media') {
    try {
      if (!fs.existsSync(mediaDirectory)) {
        fs.mkdirSync(mediaDirectory, { recursive: true });
      }

      const supportedFormats = {
        image: ['.jpg', '.jpeg', '.png', '.webp'],
        video: ['.mp4', '.mov', '.avi', '.wmv']
      };

      const assets = [];

      const files = fs.readdirSync(mediaDirectory)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return [...supportedFormats.image, ...supportedFormats.video].includes(ext) && 
                 !file.startsWith('.');
        })
        .sort((a, b) => a.localeCompare(b));

      for (const file of files) {
        const filePath = path.join(mediaDirectory, file);
        if (!fs.statSync(filePath).isFile()) continue;

        try {
          const mediaData = await this.processMedia(filePath);
          assets.push({
            ...mediaData,
            originalPath: filePath,
            fileName: file
          });
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
          continue;
        }
      }

      return assets;
    } catch (error) {
      console.error('Error getting actual assets:', error);
      throw error;
    }
  }

  static async generateSlides(selectedBrandInfo, briefRequestBody, payload, labels) {
    try {
      const pptx = new PptxGenJS();

      // Set fixed dimensions for 16:9 layout
      pptx.defineLayout({
        name: 'FIXED_16x9',
        width: 10,
        height: 5.625
      });
      pptx.layout = 'FIXED_16x9';

      const consolidatedAssets = await this.getActualAssets();
      await inspirationSlide(pptx, consolidatedAssets, labels);
      return await pptx.write('nodebuffer');
    } catch (error) {
      console.error('Error generating slides:', error.message);
      throw error;
    }
  }
}

module.exports = PresentationService; 