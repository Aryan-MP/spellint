// lib/lint.js
const markdownlint = require('markdownlint');

/**
 * Lints Markdown content for formatting issues using markdownlint.
 * @param {string} content - Markdown content to lint.
 * @returns {Array<{line: number, column: number, message: string}>} - Linting errors.
 */
function lintMarkdown(content) {
  const options = {
    strings: { content },
    config: {
      "default": true,
      "MD013": false, // Disable line length rule (customize this as needed)
    }
  };

  const results = markdownlint.sync(options);

  const errors = results.content.map(err => ({
    line: err.lineNumber,
    column: 1, // markdownlint doesn't provide column, default to 1
    message: `Linting error [${err.ruleNames.join(', ')}]: ${err.ruleDescription}`,
  }));

  return errors;
}

module.exports = { lintMarkdown };
