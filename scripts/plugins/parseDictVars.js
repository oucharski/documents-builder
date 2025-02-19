// plugins/parseDictVars.js

// Load the dictionary from the JSON file
const dict = require("./parseDictVars.json");

// Process function to search and replace @var:VAR_NAME@
function process(content) {
  return content.replace(/@var:([^@]+)@/g, (match, varName) => {
    // Trim any accidental spaces and return the dictionary value if it exists
    const key = varName.trim();
    return dict[key] || match;
  });
}

module.exports = { process };
