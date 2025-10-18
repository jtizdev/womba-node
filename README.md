# Womba Node.js CLI

AI-powered test generation for Jira stories.

## Installation

```bash
npm install -g womba-cli
```

## Configuration

```bash
export WOMBA_API_URL="https://womba-api.up.railway.app"
export WOMBA_API_KEY="your-api-key"
```

## Usage

```bash
# Generate tests
womba generate -s PLAT-12991

# Generate and upload to Zephyr
womba generate -s PLAT-12991 --upload

# Check API health
womba health
```

## Support

- [Main Docs](https://github.com/jtizdev/womba)
- [Issues](https://github.com/jtizdev/womba-node/issues)
