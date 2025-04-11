#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const { checkSpelling } = require('./lib/spellcheck');
const { lintMarkdown } = require('./lib/lint');

/**
 * Processes a Markdown file for spelling and linting errors.
 * @param {string} filePath - Path to the Markdown file.
 * @returns {Promise<boolean>} - True if no errors, false if errors found.
 */
async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const spellingErrors = await checkSpelling(content);
    const lintErrors = await lintMarkdown(content);

    const allErrors = [...spellingErrors, ...lintErrors].sort(
      (a, b) => a.line - b.line || a.column - b.column
    );

    if (allErrors.length > 0) {
      console.log(`\n${filePath}:`);
      allErrors.forEach((err) => {
        console.log(`  Line ${err.line}, Col ${err.column}: ${err.message}`);
        if (err.suggestions?.length) {
          console.log(`    Suggestions: ${err.suggestions.join(', ')}`);
        }
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Main function to handle CLI execution.
 */
async function main() {
  program
    .name('spellint')
    .description('A tool to check spelling and Markdown formatting in .md files')
    .argument('[path]', 'File or directory to check', '.')
    .action(async (inputPath) => {
      try {
        const stats = await fs.stat(inputPath);
        const files = [];

        if (stats.isFile()) {
          if (!inputPath.endsWith('.md')) {
            console.error('Error: File must be a .md file.');
            process.exit(1);
          }
          files.push(inputPath);
        } else if (stats.isDirectory()) {
          const dirFiles = await fs.readdir(inputPath, { recursive: true });
          files.push(
            ...dirFiles
              .filter((file) => file.endsWith('.md'))
              .map((file) => path.join(inputPath, file))
          );
        } else {
          console.error('Error: Path must be a file or directory.');
          process.exit(1);
        }

        if (files.length === 0) {
          console.log('No .md files found.');
          return;
        }

        let hasErrors = false;
        for (const file of files) {
          const success = await processFile(file);
          if (!success) hasErrors = true;
        }

        process.exit(hasErrors ? 1 : 0);
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
    });

  await program.parseAsync();
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});