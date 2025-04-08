const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagePaths = [
  'android/app/src/main/res/drawable/launch_screen.png',
  'android/app/src/main/res/drawable-hdpi/poodle_run.png',
  'android/app/src/main/res/drawable-xhdpi/poodle_run.png',
  'android/app/src/main/res/drawable-xxhdpi/poodle_run.png',
  'android/app/src/main/res/drawable-xxxhdpi/poodle_run.png',
  'android/app/src/main/res/drawable-mdpi/poodle_run.png',
];

async function optimizeImage(imagePath) {
  try {
    const inputPath = path.join(__dirname, '..', imagePath);
    const outputPath = path.join(__dirname, '..', imagePath + '.optimized');

    // Read the image
    const imageBuffer = await sharp(inputPath)
      .png() // Convert to PNG
      .toBuffer();

    // Write the optimized image
    await sharp(imageBuffer).png({ quality: 90, compressionLevel: 9 }).toFile(outputPath);

    // Replace the original with the optimized version
    fs.unlinkSync(inputPath);
    fs.renameSync(outputPath, inputPath);

    console.log(`Optimized: ${imagePath}`);
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

async function main() {
  for (const imagePath of imagePaths) {
    await optimizeImage(imagePath);
  }
}

main().catch(console.error);
