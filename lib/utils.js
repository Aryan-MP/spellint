const { unified } = require('unified');
const remarkParse = require('remark-parse').default;

/**
 * Extracts text segments from Markdown content, excluding code blocks.
 * @param {string} content - Markdown content to parse.
 * @returns {Array<{text: string, position: {start: {line: number, column: number}, end: {line: number, column: number}}}>} - Text segments with positions.
 * @throws {Error} - If content cannot be parsed.
 */
function extractTextWithPositions(content) {
  if (typeof content !== 'string') {
    throw new Error('Input content must be a string');
  }

  try {
    const processor = unified().use(remarkParse);
    const ast = processor.parse(content);
    const segments = [];

    function walk(node) {
      if (!node || node.type === 'code' || node.type === 'inlineCode') return;
      if (node.type === 'text' && node.position) {
        segments.push({ text: node.value, position: node.position });
      }
      if (node.children) node.children.forEach(walk);
    }

    walk(ast);
    return segments;
  } catch (err) {
    throw new Error(`Failed to parse Markdown content: ${err.message}`);
  }
}

module.exports = { extractTextWithPositions };