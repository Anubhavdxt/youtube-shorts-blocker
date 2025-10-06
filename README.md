# Synaptimo Focus

> In an age of endless distraction, focus is a superpower.

**Synaptimo Focus** is a browser extension that blocks YouTube Shorts and helps you reclaim your attention. Part of the Synaptimo suite of tools for mindful productivity.

[Install from Chrome Web Store](https://chromewebstore.google.com/detail/synaptimo-focus/nkklfnlemjknkgplbmoonibhicgffkdb) · [Visit Synaptimo.com](https://synaptimo.com)

## Features

- **Reclaim Attention** - Automatically blocks YouTube Shorts before they load
- **Minimalist Design** - Lightweight, fast, and privacy-first
- **Beautiful UI** - Modern overlay with Synaptimo branding
- **Open Source** - Transparent, customizable, community-driven

## Installation

### From Chrome Web Store (Recommended)

Install directly: [Synaptimo Focus on Chrome Web Store](https://chromewebstore.google.com/detail/synaptimo-focus/nkklfnlemjknkgplbmoonibhicgffkdb)

### From Source

1. Clone the repository
```bash
git clone https://github.com/Anubhavdxt/youtube-shorts-blocker.git
cd youtube-shorts-blocker
```

2. Build the extension
```bash
node build.js
```

3. Load in Chrome
- Go to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist/` folder

## Development

```bash
# Build extension
npm run build

# Watch for changes (requires nodemon)
npm run watch

# Clean build output
npm run clean
```

## Architecture

The extension follows a modular architecture for maintainability:

```
src/
├── content/
│   ├── index.js          # Main orchestrator
│   ├── detector.js       # URL detection & monitoring
│   ├── blocker.js        # Content blocking
│   └── ui/
│       ├── overlay.js    # Warning overlay
│       ├── styles.css    # UI styles
│       └── template.html # HTML template
└── shared/
    ├── config.js         # Configuration
    └── logger.js         # Logging utility
```

## Configuration

Edit `src/shared/config.js` to customize:
- Countdown duration
- Redirect URL
- Brand colors
- Debug logging

## Privacy

Synaptimo Focus is privacy-first:
- ✅ No tracking or analytics
- ✅ No data collection
- ✅ No permissions beyond YouTube domain
- ✅ All processing happens locally

Read our full [Privacy Policy](PRIVACY_POLICY.md).

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features including:
- Personal analytics dashboard (Pro)
- Advanced blocking options (Pro)
- Focus sessions and timers (Pro)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## About Synaptimo

Synaptimo is dedicated to building tools for mindful productivity. We believe in technology that serves you, not the other way around.

**Other Synaptimo Products:**
- More coming soon...

---

Built by [Anubhav](https://github.com/Anubhavdxt) with focus and intention.
