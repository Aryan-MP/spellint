const unified = require('unified');
const remarkParse = require('remark-parse');
const remarkLint = require('remark-lint');

/**
 * Lints Markdown content for formatting issues.
 * @param {string} content - Markdown content.
 * @returns {Promise<Array<{line: number, column: number, message: string}>>} - Linting errors.
 */
async function lintMarkdown(content) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkLint, {
      // Add custom rules or use a .remarkrc file for configuration
      'no-duplicate-headings': true,
      'no-undefined-references': true,
    });

  const file = await processor.process(content);
  return file.messages.map((msg) => ({
    line: msg.line,
    column: msg.column,
    message: msg.reason,
  }));
}

module.exports = { lintMarkdown };