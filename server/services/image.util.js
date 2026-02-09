// server/services/image.util.js
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const fsAccess = promisify(fs.access);
const fsWriteFile = promisify(fs.writeFile);

/**
 * Check if a string is a valid URL
 * @param {string} str - String to check
 * @returns {boolean} - True if it's a URL
 */
function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Download an image from URL to a local temporary file
 * @param {string} imageUrl - URL of the image to download
 * @returns {Promise<string>} - Path to the downloaded temporary file
 */
async function downloadImageFromUrl(imageUrl) {
  if (!isUrl(imageUrl)) {
    // If it's not a URL, assume it's already a local file path
    return imageUrl;
  }

  // Create a temporary filename
  const urlObj = new URL(imageUrl);
  const ext = path.extname(urlObj.pathname) || '.jpg';
  const tempFileName = `temp_image_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${ext}`;
  const tempFilePath = path.join(__dirname, '..', 'temp', tempFileName);

  // Ensure temp directory exists
  const tempDir = path.dirname(tempFilePath);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const request = protocol.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fsWriteFile(tempFilePath, buffer)
          .then(() => resolve(tempFilePath))
          .catch(reject);
      });
    });

    request.on('error', (err) => {
      reject(new Error(`Error downloading image: ${err.message}`));
    });

    request.setTimeout(30000, () => { // 30 second timeout
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

/**
 * Process image paths - convert URLs to local files if needed
 * @param {Array<string>} imagePaths - Array of image paths or URLs
 * @returns {Promise<Array<string>>} - Array of local file paths
 */
async function processImagePaths(imagePaths) {
  if (!imagePaths || !Array.isArray(imagePaths)) {
    console.log('Image paths not an array, converting:', imagePaths);
    // If it's a single string, convert to array
    if (typeof imagePaths === 'string') {
      imagePaths = [imagePaths];
    } else {
      imagePaths = [];
    }
  }

  const processedPaths = [];
  
  for (const imagePath of imagePaths) {
    if (isUrl(imagePath)) {
      try {
        const localPath = await downloadImageFromUrl(imagePath);
        processedPaths.push(localPath);
      } catch (error) {
        console.error(`Failed to download image from URL: ${imagePath}`, error.message);
        // Skip this image and continue with others
        continue;
      }
    } else {
      // Check if local file exists
      try {
        await fsAccess(imagePath);
        processedPaths.push(imagePath);
      } catch (error) {
        console.error(`Local image file does not exist: ${imagePath}`, error.message);
        // Skip this image and continue with others
        continue;
      }
    }
  }

  if (processedPaths.length === 0) {
    console.log('No valid images found to upload, returning placeholder');
    // Return a placeholder if no valid images found
    return ['placeholder-image.jpg'];
  }

  return processedPaths;
}

/**
 * Clean up temporary image files
 * @param {Array<string>} tempFiles - Array of temporary file paths to delete
 */
function cleanupTempImages(tempFiles) {
  if (!Array.isArray(tempFiles)) {
    return;
  }

  tempFiles.forEach(filePath => {
    try {
      // Don't delete placeholder images
      if (filePath !== 'placeholder-image.jpg' && filePath.startsWith(path.join(__dirname, '..', 'temp'))) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Failed to delete temporary file: ${filePath}`, error.message);
    }
  });
}

module.exports = {
  isUrl,
  downloadImageFromUrl,
  processImagePaths,
  cleanupTempImages
};