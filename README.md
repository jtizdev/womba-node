# Womba CLI (Node.js)

> AI-powered test generation for Jira stories

## Install

```bash
npm install -g womba-cli
```

## Usage

```bash
# Setup
export WOMBA_API_URL="https://womba-api.onrender.com"
export WOMBA_API_KEY="your-api-key"

# Generate tests
womba generate -s PLAT-12991

# Generate and upload to Zephyr
womba generate -s PLAT-12991 --upload
```

## License

MIT · [Womba](https://github.com/jtizdev/womba)
