const unified = require('unified');
const remarkParse = require('remark-parse');

/**
 * Extracts text from Markdown, excluding code blocks and inline code.
 * @param {string} content - Markdown content.
 * @returns {Array<{text: string, position: {start: {line: number, column: number}, end: {line: number, column: number}}}>} - Text segments with positions.
 */
function extractTextWithPositions(content) {
  const processor = unified().use(remarkParse);
  const ast = processor.parse(content);
  const textSegments = [];

  function traverse(node) {
    if (node.type === 'code' || node.type === 'inlineCode') return;
    if (node.type === 'text' && node.position) {
      textSegments.push({
        text: node.value,
        position: node.position,
      });
    }
    if (node.children) node.children.forEach(traverse);
  }

  traverse(ast);
  return textSegments;
}

module.exports = { extractTextWithPositions };