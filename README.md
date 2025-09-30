# YouTube Shorts Blocker

Browser extension that blocks YouTube Shorts and redirects to the homepage.

## Installation

1. Clone the repository
2. Run `node build.js` to build the extension
3. Load the `dist/` folder as an unpacked extension in Chrome

## Development

```bash
# Build extension
npm run build

# Clean build output
npm run clean
```

## Structure

- `src/` - Source code (modular ES6)
- `dist/` - Build output (bundled for browser)
- `assets/` - Icons and images

## Configuration

Edit `src/shared/config.js` to customize:
- Countdown duration
- Redirect URL
- Debug logging

## License

MIT