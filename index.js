#!/usr/bin/env node

const { program } = require('commander');
const globby = require('globby');
const chalk = require('chalk');
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
    const [spellingErrors, lintErrors] = await Promise.all([
      checkSpelling(content),
      lintMarkdown(content),
    ]);

    if (spellingErrors.length === 0 && lintErrors.length === 0) {
      return true;
    }

    console.log(chalk.yellowBright(`\n📄 ${filePath}`));

    if (lintErrors.length > 0) {
      console.log(chalk.cyanBright('\n⚠️  Linting Issues:\n'));
      lintErrors.forEach((err) => {
        const ruleCode = err.ruleId ? chalk.green(`[${err.ruleId}]`) : '';
        console.log(
          chalk.red(`  Line ${err.line}, Col ${err.column}: ${ruleCode} ${err.message}`)
        );
      });
    }

    if (spellingErrors.length > 0) {
      console.log(chalk.magentaBright('\n📝 Spelling Mistakes:\n'));
      spellingErrors.forEach((err) => {
        console.log(
          chalk.red(`  Line ${err.line}, Col ${err.column}: ${err.message}`)
        );
        if (err.suggestions?.length) {
          console.log(
            chalk.gray(`    Suggestions: ${err.suggestions.join(', ')}`)
          );
        }
      });
    }

    return false;
  } catch (err) {
    console.error(chalk.red(`Error reading ${filePath}: ${err.message}`));
    return false;
  }
}

/**
 * Main CLI execution function.
 */
async function main() {
  program
    .name('spellint')
    .version('1.0.0', '-v, --version', 'Output the current version')
    .description('Check spelling and Markdown formatting in .md files')
    .argument('[input]', 'File or directory to check', '.')
    .action(async (input) => {
      try {
        const resolvedPath = path.resolve(input);
        let files = [];

        // Check if input is a file or directory
        const stats = await fs.stat(resolvedPath);
        if (stats.isFile()) {
          if (resolvedPath.endsWith('.md')) {
            files = [resolvedPath];
          } else {
            console.log(chalk.red('Error: Input file must be a .md file.'));
            process.exit(1);
          }
        } else if (stats.isDirectory()) {
          files = await globby([path.join(resolvedPath, '**', '*.md')], {
            gitignore: true,
            absolute: true,
          });
        } else {
          console.log(chalk.red('Error: Input must be a file or directory.'));
          process.exit(1);
        }

        if (files.length === 0) {
          console.log(chalk.green('✅ No Markdown files found to check.'));
          process.exit(0);
        }

        let hasErrors = false;
        await Promise.all(files.map(async (file) => {
          const success = await processFile(file);
          if (!success) hasErrors = true;
        }));

        process.exit(hasErrors ? 1 : 0);
      } catch (err) {
        console.error(chalk.red(`Unexpected error: ${err.message}`));
        process.exit(1);
      }
    });

  await program.parseAsync();
}

main();
