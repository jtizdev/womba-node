# Womba Node.js CLI

Node.js client for the Womba AI test generation service.

## Features

- 🚀 Fast and lightweight
- 🎨 Colored terminal output
- 📦 Easy npm installation
- 🔒 Secure API authentication
- ⚡ Async/await support

## Installation

### Option 1: Global Install (Recommended)

```bash
npm install -g womba-cli
```

### Option 2: npx (No Installation)

```bash
npx womba-cli generate -s PLAT-12991
```

### Option 3: Local Project

```bash
npm install womba-cli
npx womba generate -s PLAT-12991
```

## Configuration

Set environment variables:

```bash
# Required
export WOMBA_API_URL="https://womba-api.up.railway.app"
export WOMBA_API_KEY="your-api-key-here"

# Add to ~/.bashrc or ~/.zshrc for persistence
echo 'export WOMBA_API_URL="https://womba-api.up.railway.app"' >> ~/.bashrc
echo 'export WOMBA_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

## Usage

### Generate Tests

Generate test cases for a Jira story:

```bash
# Basic generation (no upload)
womba generate -s PLAT-12991

# Generate and upload to Zephyr
womba generate -s PLAT-12991 --upload

# Using long form flags
womba generate --story PLAT-12991 --upload
```

### Check API Health

```bash
womba health
```

### Show Version

```bash
womba --version
```

### Show Help

```bash
womba --help
womba generate --help
```

## Example Output

```
🚀 Generating tests for PLAT-12991...

✅ Successfully generated 8 test cases!
📊 Quality Score: 88.5/100
📁 Suggested Folder: Orchestration WS/POP ID Alignment
⏱️  Execution Time: 12.34s
🤖 AI Model: gpt-4o

Generated Test Cases:
================================================================================

1. Verify POP ID alignment in orchestration workflow
   Priority: High | Type: Functional
   Description: Test that POP IDs are correctly aligned...
   Steps: 5

2. Test POP ID validation with invalid inputs
   Priority: High | Type: Negative
   Description: Verify system handles invalid POP IDs...
   Steps: 4

...

🎉 Done!
```

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `generate` | Generate test cases | `womba generate -s PLAT-12991` |
| `health` | Check API status | `womba health` |
| `--version` | Show CLI version | `womba --version` |

## Flags

### generate

- `-s, --story <key>` (required) - Jira story key (e.g., PLAT-12991)
- `-u, --upload` (optional) - Upload generated tests to Zephyr

## Development

### Prerequisites

- Node.js 14 or higher
- npm 6 or higher

### Setup

```bash
git clone https://github.com/jtizdev/womba-node.git
cd womba-node
npm install
```

### Run Locally

```bash
# Direct execution
node index.js generate -s PLAT-12991

# Or link globally
npm link
womba generate -s PLAT-12991
```

### Run Tests

```bash
npm test
```

### Project Structure

```
womba-node/
├── index.js           # CLI entry point
├── lib/
│   └── client.js      # HTTP client
├── package.json       # npm configuration
└── README.md          # This file
```

### Dependencies

- **axios** (^1.6.5) - HTTP client
- **chalk** (^4.1.2) - Terminal colors
- **commander** (^11.1.0) - CLI framework

## Architecture

```
┌─────────────┐
│  Node.js CLI│
│(womba-node) │
└──────┬──────┘
       │ HTTP
       ↓
┌─────────────┐
│  Womba API  │
│  (Python)   │
└─────────────┘
```

The Node.js CLI is a thin wrapper that calls the Womba API service via HTTP. All test generation logic is in the Python service.

## Integration with CI/CD

### GitHub Actions

```yaml
name: Generate Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Womba CLI
        run: npm install -g womba-cli
      
      - name: Generate Tests
        env:
          WOMBA_API_URL: https://womba-api.up.railway.app
          WOMBA_API_KEY: ${{ secrets.WOMBA_API_KEY }}
        run: womba generate -s PLAT-12991
```

### Package.json Script

```json
{
  "scripts": {
    "generate-tests": "womba generate -s $STORY_KEY"
  }
}
```

Then run:
```bash
STORY_KEY=PLAT-12991 npm run generate-tests
```

## Using as a Library

You can also use Womba as a library in your Node.js application:

```javascript
const WombaClient = require('womba-cli/lib/client');

const client = new WombaClient(
  'https://womba-api.up.railway.app',
  'your-api-key'
);

async function generateTests() {
  try {
    const result = await client.generateTests('PLAT-12991', false);
    console.log(`Generated ${result.test_cases.length} tests`);
    console.log(`Quality: ${result.quality_score}/100`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generateTests();
```

## Troubleshooting

### Error: WOMBA_API_URL not set

```bash
export WOMBA_API_URL="https://womba-api.up.railway.app"
```

### Error: WOMBA_API_KEY not set

```bash
export WOMBA_API_KEY="your-api-key"
```

### Error: Command not found: womba

If globally installed but not found:

```bash
# Re-install globally
npm uninstall -g womba-cli
npm install -g womba-cli

# Or check npm global path
npm config get prefix
# Add to PATH if needed
```

### Error: ECONNREFUSED

The API is not reachable. Check:
1. WOMBA_API_URL is correct
2. API is running: `womba health`
3. Network connectivity

### Error: API error 401

Invalid API key. Check your `WOMBA_API_KEY`.

## Publishing to npm (Maintainers Only)

```bash
# Login to npm
npm login

# Bump version
npm version patch  # or minor, major

# Publish
npm publish

# Push tags
git push --tags
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - See [LICENSE](LICENSE) file

## Related Projects

- [womba](https://github.com/jtizdev/womba) - Python CLI (core)
- [womba-api](https://github.com/jtizdev/womba-api) - REST API service
- [womba-go](https://github.com/jtizdev/womba-go) - Go CLI
- [womba-java](https://github.com/jtizdev/womba-java) - Java CLI
- [womba-forge](https://github.com/jtizdev/womba-forge) - Atlassian Forge plugin

## Support

- **Issues**: https://github.com/jtizdev/womba-node/issues
- **Docs**: https://github.com/jtizdev/womba
- **API Docs**: https://womba-api.up.railway.app/docs

