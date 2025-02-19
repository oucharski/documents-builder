# Documents Builder

A simple documentation compilator that processes markdown files using plugins. It supports file imports, variable substitution, and generating a table of contents (TOC). The compilator can run in both production and test modes.

## Table of Contents

- [Documents Builder](#documents-builder)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
    - [Running in Production Mode](#running-in-production-mode)
    - [Running in Test Mode](#running-in-test-mode)
  - [Creating Documents](#creating-documents)
  - [Testing](#testing)
  - [Creating Plugins](#creating-plugins)
    - [Example Plugin Template](#example-plugin-template)
    - [Plugin Order](#plugin-order)
  - [Project Structure](#project-structure)
  - [License](#license)



## Usage

### Running in Production Mode

To compile documentation files from the `src` folder to the `dist` folder, run:

```bash
npm run build
```

### Running in Test Mode

In test mode, the compilator will process files from the `test/src` folder and output them to the `test/build` folder. To run in test mode, pass the `test` parameter:

```bash
npm run test
```

## Creating Documents

- **Location:**  
  Place your markdown documents in the `src` folder (or `test/src` for test mode).

- **Content Markers:**  
  - **File Imports:** Use the `@import:relative/path/to/file.md@` marker to include another file's content.
  - **Variable Replacement:** Use the `@var:variableName@` marker to replace with a value from your dictionary (configured in `plugins/parseDictVars.json`).
  - **Table of Contents:** Place the `@toc@` marker where you want the TOC inserted.  
    The TOC will be generated based on markdown headings in your document.

- **Skip Processing:**  
  To skip a file, either:
  - Include `.skip` in the file or folder name

## Testing

- **Test Documents:**  
  Put your test documents under the `test/src` folder.

- **Running Tests:**  
  Execute the test build by running:

  ```bash
  npm run test
  ```

  This will compile the documents in `test/src` and output them to `test/build`.

- **Plugin Behavior:**  
  All plugins receive an options object (e.g., `{ test: true }`) so they can adjust their behavior when running in test mode.

## Creating Plugins

Plugins allow you to extend or modify the compilation process. Each plugin must export a `process` function that accepts the document content (and an options object) and returns the updated content.

### Example Plugin Template

Create a new file in the `plugins` folder, for example `myPlugin.js`:

```javascript
// plugins/myPlugin.js
module.exports = {
  /**
   * Process the content of a document.
   * @param {string} content - The current document content.
   * @param {Object} options - An options object (e.g., { test: true }).
   * @returns {string} - The updated content.
   */
  process: (content, options) => {
    // Your custom processing here.
    // For example, replacing a custom marker:
    return content.replace(/@myMarker:([^@]+)@/g, (match, text) => {
      return `Processed: ${text.trim()}`;
    });
  },
};
```

### Plugin Order

The order of plugin execution is determined explicitly in `scripts/compile.js`. To adjust the order, edit the plugins array in that file:

```javascript
const plugins = [
  require(path.join(PLUGINS_FOLDER, "importFiles")),
  require(path.join(PLUGINS_FOLDER, "parseDictVars")),
  require(path.join(PLUGINS_FOLDER, "generateTOC")),
  // Add your plugin here:
  require(path.join(PLUGINS_FOLDER, "myPlugin")),
];
```

Plugins are applied sequentially. The output of one becomes the input for the next.

## Project Structure

```
documents-builder/
├── plugins/
│   ├── importFiles.js
│   ├── parseDictVars.js
│   ├── parseDictVars.json
│   ├── generateTOC.js
│   └── myPlugin.js         # (Example custom plugin)
├── scripts/
│   └── compile.js
├── src/                    # Production documents go here
│   └── yourDocument.md
├── test/
│   ├── src/                # Test documents go here
│   └── build/              # Compiled test documents
├── dist/                   # Compiled production documents (created automatically)
├── package.json
└── README.md
```

## License

This project is licensed under the MIT License.


---

With this documentation, you should have all the instructions needed to install, run, test, and extend the documentation compilator. Happy documenting!