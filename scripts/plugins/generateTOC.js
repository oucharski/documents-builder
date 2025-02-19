// plugins/generateTOC.js

// Set the title for your Table of Contents here
const TOC_TITLE = "Table of Contents";

// Generates a Table of Contents (TOC) from markdown headings.
function generateTOC(content) {
  // Regex to capture markdown headings (from level 1 to 6)
  const headingRegex = /^(#{1,6})\s+(.*)$/gm;
  const tocEntries = [];
  let match;

  // Loop through all heading matches.
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    // Generate a slug for the heading (e.g., "My Heading" -> "my-heading")
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
    tocEntries.push({ level, title, slug });
  }

  // Build the TOC as a markdown list.
  // Each heading gets indented based on its level.
  const toc = tocEntries
    .map((entry) => {
      const indent = "  ".repeat(entry.level - 1);
      return `${indent}- [${entry.title}](#${entry.slug})`;
    })
    .join("\n");

  return toc;
}

/**
 * Process function that replaces the @toc@ marker in the content
 * with the TOC (preceded by the title defined in TOC_TITLE).
 *
 * @param {string} content - The markdown content.
 * @returns {string} - The content with the TOC inserted.
 */
function process(content) {
  // Generate the TOC based on headings in the content.
  const toc = generateTOC(content);
  // Prepare the final insertion including the title.
  const tocWithTitle = `### ${TOC_TITLE}\n\n${toc}`;
  // Replace all occurrences of @toc@ with the TOC with title.
  return content.replace(/@toc@/g, tocWithTitle);
}

module.exports = { process };
