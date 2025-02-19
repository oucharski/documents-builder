// Example in plugins/importFiles.js

const fs = require("fs");
const path = require("path");

function process(content, options) {
  // Use test-specific source folder if test mode is active
  const baseFolder =
    options && options.test
      ? path.join(__dirname, "../../", "test", "src")
      : path.join(__dirname, "../../", "src");

  return content.replace(/@import:([^@]+)@/g, (match, filePath) => {
    const trimmedPath = filePath.trim();
    const fullPath = path.join(baseFolder, trimmedPath);

    if (fs.existsSync(fullPath)) {
      try {
        return fs.readFileSync(fullPath, "utf8");
      } catch (err) {
        console.error(`Error reading file ${fullPath}:`, err);
        return match;
      }
    } else {
      console.warn(`Warning: File ${fullPath} not found for import.`);
      return match;
    }
  });
}

module.exports = { process };
