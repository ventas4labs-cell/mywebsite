# Auto-Bundling Workflow

## Goal
Ensure `index.html` is always a self-contained, bundled file containing all CSS and JS source code.

## Inputs
- `index_template.html`: The source HTML file (formerly index.html).
- `styles.css`: The source CSS file.
- `script.js`: The source JavaScript file.

## Execution
Run the python script:
```bash
python3 execution/bundle.py
```

## When to Run
- **ALWAYS** run this script after modifying `index_template.html`, `styles.css`, or `script.js`.
- Do **NOT** edit `index.html` directly. It is a generated artifact.

## Output
- `index.html`: The final bundled file.
