const nspell = require('nspell');
const dictionary = require('dictionary-en');
const { promisify } = require('util');
const { extractTextWithPositions } = require('./utils');

/**
 * Checks spelling in Markdown content, returning errors with positions.
 * @param {string} content - Markdown content.
 * @returns {Promise<Array<{line: number, column: number, message: string, suggestions: string[]}>}>} - Spelling errors.
 */
async function checkSpelling(content) {
  const loadDictionary = promisify(dictionary);
  const dict = await loadDictionary();
  const spell = nspell(dict);
  const textSegments = extractTextWithPositions(content);
  const errors = [];

  for (const { text, position } of textSegments) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = position.start.line + i;
      const words = line.match(/\b\w+\b/g) || [];
      let columnOffset = position.start.column - 1;

      for (const word of words) {
        const wordStart = line.indexOf(word, columnOffset - position.start.column + 1) + position.start.column;
        if (!spell.correct(word)) {
          errors.push({
            line: lineNumber,
            column: wordStart,
            message: `Spelling error: "${word}"`,
            suggestions: spell.suggest(word),
          });
        }
        columnOffset = wordStart + word.length;
      }
    }
  }

  return errors;
}

module.exports = { checkSpelling };