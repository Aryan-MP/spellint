# Spellint

**Spellint** is a sleek, fast, and developer-friendly command-line tool that checks spelling and Markdown formatting in `.md` files. Whether you're a developer writing documentation, a technical writer polishing content, or a contributor reviewing PRs, Spellint ensures your Markdown is clean and typo-free — all with minimal setup.

Perfect for local development and CI/CD pipelines, Spellint seamlessly blends into your workflow, catching spelling mistakes and style issues before they hit production.

---

## 🚀 Features

- ✅ **Smart Spelling Checks**: Detects spelling mistakes in natural language text while ignoring code blocks and inline code.
- 📄 **Markdown Linting**: Ensures consistent formatting — headings, lists, spacing, and more.
- ⚙️ **CI/CD Friendly**: Exits with a non-zero code on issues, perfect for automated build pipelines.
- ⚡ **Blazing Fast**: Optimized to scan large directories without slowing you down.
- 🧩 **Extensible Architecture**: Planned support for custom dictionaries and configuration files.

---

## 📦 Installation

Install globally via NPM:

```bash
npm install -g spellint
```

Or set it up locally:

```bash
git clone https://github.com/yourusername/spellint.git
cd spellint
npm install
npm link
```

---

## 🛠 Usage

Run Spellint on a specific Markdown file or an entire directory:

```bash
spellint [path]
```

- `path` — optional path to a file or folder (defaults to current directory `.`).

### Examples

```bash
# Check a single file
spellint README.md

# Check all markdown files in the docs directory
spellint docs/
```

### Sample Output

```text
docs/guide.md:
  Line 3, Col 8: Spelling error: "paragrap"
    Suggestions: paragraph, paragraphs
  Line 10, Col 2: Formatting error: Invalid heading level (use #, ##, etc.)
```

---

## ⚙️ Configuration

Spellint uses default English spelling and a base set of Markdown linting rules.

**Coming Soon:**
- `.spellintrc` configuration file
- Custom dictionaries for technical terms (e.g., GitHub, Kubernetes)
- Toggle rules for formatting (headings, lists, spacing, etc.)

Advanced users can also modify `lib/lint.js` to tweak rules directly.

---

## 🔁 GitHub Actions Integration

Automate checks on pull requests by adding the following workflow to `.github/workflows/spellint.yml`:

```yaml
name: Spellint Check
on:
  pull_request:
    branches: [main]
jobs:
  spellint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install -g spellint
      - run: spellint .
```

This ensures that documentation issues are caught before merging.

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push your branch: `git push origin feature/my-feature`
5. Open a pull request

Make sure to describe your changes clearly and align with the project’s direction.

---

## 🧭 Roadmap

- [ ] Custom dictionary support
- [ ] Config file support via `.spellintrc`
- [ ] GitHub Actions error annotations
- [ ] Language localization support

---

## 📜 License

Spellint is licensed under the [MIT License](LICENSE).

---

## 📬 Contact & Feedback

Have suggestions or feedback? Feel free to:
- Open an issue on GitHub
- Reach out to the maintainers
- Star the repo if you find it helpful!

Happy documenting — and may your Markdown stay lint-free! ✨

