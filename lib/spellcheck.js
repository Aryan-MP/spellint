const nspell = require('nspell');
const dictionary = require('dictionary-en');
const { promisify } = require('util');
const { extractTextWithPositions } = require('./utils');

// Cache the spell checker instance
let spellChecker = null;

/**
 * Loads or retrieves the cached spell checker.
 * @returns {Promise<nspell>} - The spell checker instance.
 */
async function getSpellChecker() {
  if (!spellChecker) {
    const loadDictionary = promisify(dictionary);
    const dict = await loadDictionary();
    spellChecker = nspell(dict);
  }
  return spellChecker;
}

/**
 * Checks spelling in Markdown content.
 * @param {string} content - Markdown content to check.
 * @returns {Promise<Array<{line: number, column: number, message: string, suggestions: string[]}>}> - Spelling errors.
 */
async function checkSpelling(content) {
  const spell = await getSpellChecker();
  const segments = extractTextWithPositions(content);
  const errors = [];

  for (const { text, position } of segments) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const words = line.match(/\b\w+\b/g) || [];
      let colOffset = 0;

      for (const word of words) {
        const wordStart = line.indexOf(word, colOffset) + 1;
        if (!spell.correct(word)) {
          errors.push({
            line: position.start.line + i,
            column: wordStart,
            message: `Spelling error: "${word}"`,
            suggestions: spell.suggest(word).slice(0, 5),
          });
        }
        colOffset = wordStart + word.length - 1;
      }
    }
  }

  return errors;
}

module.exports = { checkSpelling };
