const fs = require('fs');
const path = require('path');

/**
 * File Storage abstraction service.
 * Swapping to S3 or Cloudinary in the future only requires updating this file.
 */
const saveFile = async (tempFile, category, userId) => {
  const targetDir = path.join(__dirname, `../uploads/${category}/${userId}`);
  
  // Ensure the directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fileExtension = path.extname(tempFile.originalname);
  const fileName = `${tempFile.fieldname}-${Date.now()}${fileExtension}`;
  const targetPath = path.join(targetDir, fileName);

  // Move the file from temp path to destination path
  fs.renameSync(tempFile.path, targetPath);

  // Return the web-accessible path format
  return `uploads/${category}/${userId}/${fileName}`;
};

module.exports = {
  saveFile
};
