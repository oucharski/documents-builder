// scripts/compile.js
const fs = require("fs");
const path = require("path");

// Determine if we're running in test mode by checking process.argv
const isTest = process.argv.includes("test");

// Clean the output folder before compiling
function cleanOutput(outFolder) {
  if (fs.existsSync(outFolder)) {
    fs.rmSync(outFolder, { recursive: true, force: true });
    console.log(`Cleaned directory: ${outFolder}`);
  }
}

// Recursively read all files from a directory,
// skipping any file or folder whose name includes ".skip"
function readFiles(dir) {
  let filesList = [];
  fs.readdirSync(dir).forEach((file) => {
    if (file.includes(".skip")) return; // skip files/folders with ".skip" in their name
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      filesList = filesList.concat(readFiles(fullPath));
    } else if (stats.isFile()) {
      filesList.push(fullPath);
    }
  });
  return filesList;
}

// Check if a file's content starts with a skip marker (@skip)
function shouldSkipContent(content) {
  const lines = content.split(/\r?\n/);
  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;
    return trimmed.startsWith("@skip");
  }
  return false;
}

// Explicitly define the plugins folder (relative to the current directory)
const PLUGINS_FOLDER = path.join(__dirname, ".", "plugins");

// Explicitly require and order your plugins.
// They will receive an options parameter that includes { test: true/false }.
const plugins = [
  require(path.join(PLUGINS_FOLDER, "importFiles")),
  require(path.join(PLUGINS_FOLDER, "parseDictVars")),
  require(path.join(PLUGINS_FOLDER, "generateTOC")),
];

// Parse the content of a file using all plugins in order.
// Each plugin receives the current content and an options object.
function parse(content, plugins, options) {
  return plugins.reduce((result, plugin) => {
    if (typeof plugin.process === "function") {
      return plugin.process(result, options);
    }
    return result;
  }, content);
}

// Main compile function
function compile() {
  // Determine base directory (one level up from scripts/)
  const baseDir = path.join(__dirname, "..");

  // Set source and output directories based on test mode.
  const srcDir = isTest
    ? path.join(baseDir, "test", "src")
    : path.join(baseDir, "src");
  const outDir = isTest
    ? path.join(baseDir, "test", "build")
    : path.join(baseDir, "dist");

  // Clean output folder before starting
  cleanOutput(outDir);

  // Get list of files (recursively) from the source directory.
  const files = readFiles(srcDir);

  files.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");

    // Skip processing if the file's content starts with the skip marker (@skip)
    if (shouldSkipContent(content)) {
      console.log(`Skipped ${file} because it starts with a skip marker.`);
      return;
    }

    // Options to be passed to plugins (includes test mode info)
    const options = { test: isTest };

    // Process content through plugins in the specified order
    const compiledContent = parse(content, plugins, options);

    // Determine the relative path of the file in the source directory.
    const relativePath = path.relative(srcDir, file);
    // Build the corresponding output path in the output directory.
    const outputPath = path.join(outDir, relativePath);

    // Ensure the output directory exists.
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, compiledContent, "utf8");
    console.log(`Compiled ${file} to ${outputPath}`);
  });
}

compile();
